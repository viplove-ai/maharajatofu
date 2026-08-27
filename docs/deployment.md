# Deployment

Production runs on **Fly.io** as a single app, with Postgres from Neon.

```
browser ──https──► maharaja-tofu (Next.js standalone, bom)
                        └──► Neon Postgres (maharaja_tofu database, TLS)
```

One app, not two. Unlike nirman there is no separate API to proxy to — the route handlers
live in the same Next.js server as the pages, so there is no second machine and no CORS.

## Why this shape

| Choice | Reason |
|---|---|
| Region `sin` (Singapore) | Fly deprecated `bom` and now has no India region at all, so this is the closest available — about 60–80 ms from Delhi. It does at least colocate with the Neon project, so the few routes that hit Postgres do their round trips inside one datacentre. |
| One machine (`--ha=false`) | Fly provisions two by default for high availability. A pilot site that suspends to zero does not need a standby, and each machine bills for its rootfs even while suspended. |
| `auto_stop_machines = "suspend"`, `min_machines_running = 0` | Node resumes in about a second and most pages are static, so suspending between visits costs almost nothing. Nirman keeps a machine warm because a JVM cold start is ~20s; that does not apply here. |
| Migrations in CI, not at boot | A bad migration fails a one-off job while the running machine keeps serving, instead of putting every boot into a crash loop. |
| Neon **pooled** endpoint | `@neondatabase/serverless` speaks HTTP and holds no prepared-statement state, so PgBouncer in transaction mode is fine — the opposite of nirman's constraint. |

Running cost: one shared-cpu-1x/512 MB machine that suspends when idle, roughly $0–2 a
month at pilot traffic, plus whatever the Neon project already costs.

---

## One-time setup

### 1. Fly app

```bash
brew install flyctl && flyctl auth login
```

```bash
flyctl apps create maharaja-tofu
```

If you pick a different name, update `app =` in `fly.toml` and the two smoke-test URLs in
`.github/workflows/deploy.yml`.

### 2–4. Database and secrets, in one step

```bash
./scripts/setup-secrets.sh
```

That script reads the Neon credentials out of the running `nirman-constructions-api`
machine — Fly stores digests rather than values, so that environment is the only place they
exist — creates a `maharaja_tofu` database inside the same Neon project, and pipes the
results into the Fly secret and the two GitHub Actions secrets. Nothing is ever printed.

Three details in it that are easy to get wrong by hand:

- **`CREATE DATABASE` runs against the direct endpoint**, not the pooled one. It cannot run
  inside a transaction, and PgBouncer in transaction mode would wrap it in one.
- **The app uses the pooled endpoint.** The opposite of nirman's constraint: Hikari holds
  prepared statements that PgBouncer breaks, whereas `@neondatabase/serverless` speaks HTTP
  and holds none.
- **The Fly deploy token is scoped to this app.** Never reuse nirman's.

Doing it by hand instead:

```bash
psql '<nirman connection string, direct endpoint>' -c 'CREATE DATABASE maharaja_tofu;'
```

```bash
flyctl tokens create deploy --app maharaja-tofu --name github-actions --expiry 8760h | gh secret set FLY_API_TOKEN --repo viplove-ai/maharajatofu
```

Set `DATABASE_URL` — pooled host, `maharaja_tofu` database — both as a Fly secret on the app
and as a GitHub Actions secret for the migration job. Keep it out of your shell history and
never put it in `fly.toml`; that file is committed and the repository is public.

> One thing to know: Neon's free tier limits storage and compute **per project**, so this
> database and nirman's share that ceiling. At pilot volume — a few hundred rows — it is not
> a concern. Move this to its own project before anything here gets busy.

### 5. First deploy

```bash
git commit --allow-empty -m 'Trigger first deploy' && git push
```

The pipeline does the rest: CI, then migrations, then `flyctl deploy`, then the smoke test.
There is no separate first-deploy dance — the same path that ships every later change ships
the first one, which is the point of having it.

### 6. Custom domain

```bash
flyctl certs add maharajatofu.com --app maharaja-tofu
```

Add the records it prints, then set `NEXT_PUBLIC_SITE_URL` in `fly.toml` under
`[build.args]` to `https://maharajatofu.com` and redeploy — it is baked into the bundle at
build time, so a secret would not work and a redeploy is required.

---

## The pipeline

**`.github/workflows/ci.yml`** — every pull request, and called by the deploy workflow.
Lint, typecheck, unit tests, a check that the migration runner actually loads, and a
production build; plus a job that regenerates the Drizzle migrations and fails if `drizzle/`
comes out different from what was committed. It has no push trigger of its own — deploy.yml
calls it on `main`, and a push trigger as well would run everything twice.

**`.github/workflows/deploy.yml`** — every push to `main`, or manual dispatch.
Four stages: CI, then migrations, then `flyctl deploy`, then a smoke test on `/api/health`
followed by the home page. `concurrency` serializes deploys and never cancels one in flight.

**There is no release branch.** Anything merged to `main` is live within a few minutes, so
CI is wired in as the deploy pipeline's first job rather than as a parallel workflow — a
push that fails lint, typecheck, tests or build never reaches Fly. What this does *not*
protect against is a change that passes every check and is still wrong, which is what a
release branch used to catch. Use pull requests for anything you would not want live
immediately, and `flyctl releases` below to roll back when something slips through.

## Migrations

Drizzle SQL files in `drizzle/`, applied by `npm run db:migrate` from CI before the deploy.

Write them backward-compatible — add columns nullable, drop them in a later release — so
the old machine keeps serving happily during the gap between the migration job finishing and
the new image going live.

## Rollback

```bash
flyctl releases --app maharaja-tofu
```

```bash
flyctl deploy --app maharaja-tofu --image registry.fly.io/maharaja-tofu:deployment-XXXX
```

Rolling back the image does **not** roll back the database. Write a forward migration
instead wherever you can.

## Operations

```bash
flyctl logs --app maharaja-tofu
```

```bash
flyctl status --app maharaja-tofu
```

### Getting the signups out

There is no admin UI — at pilot scale a query is faster to write than a screen.

```bash
psql "$DATABASE_URL" -c "\copy (SELECT seq, name, phone, area, pincode, plan, intent, coupon_code, coupon_cohort, tier, confirmed_at, created_at FROM signups WHERE deleted_at IS NULL ORDER BY seq) TO 'signups.csv' CSV HEADER"
```

Marking someone confirmed after they reply on WhatsApp:

```bash
psql "$DATABASE_URL" -c "UPDATE signups SET confirmed_at = now() WHERE phone = '9876543210'"
```

An erasure request — tombstoned rather than deleted, so the coupon number is never reissued
to somebody else:

```bash
psql "$DATABASE_URL" -c "UPDATE signups SET deleted_at = now(), phone = 'erased-' || seq, name = 'erased' WHERE phone = '9876543210'"
```
