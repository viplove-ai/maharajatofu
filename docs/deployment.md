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
| Region `bom` (Mumbai) | Nearly every request is a prerendered page that never touches Postgres. The trip that matters is the one to a phone in Noida, not the one to Neon. |
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

### 2. Database

A separate database inside the **existing** Neon project — same project, same free tier, no
new billing, and cleanly separated from nirman's data:

```bash
psql '<nirman connection string>' -c 'CREATE DATABASE maharaja_tofu;'
```

Take the connection string, swap the database name at the end for `maharaja_tofu`, and use
the **pooled** host (the one containing `-pooler`).

> One thing to know: Neon's free tier limits storage and compute **per project**, so this
> database and nirman's share that ceiling. At pilot volume — a few hundred rows — it is not
> a concern. Move this to its own project before anything here gets busy.

### 3. Secrets

```bash
flyctl secrets set --app maharaja-tofu DATABASE_URL='postgresql://user:pass@ep-xxx-pooler.ap-southeast-1.aws.neon.tech/maharaja_tofu?sslmode=require'
```

Never put this in `fly.toml` — that file is committed.

### 4. GitHub secrets

```bash
flyctl tokens create deploy --name github-actions --expiry 8760h
```

Under Settings → Secrets and variables → Actions, add:

| Secret | Value |
|---|---|
| `FLY_API_TOKEN` | the token printed above |
| `DATABASE_URL` | the same connection string, for the migration job |

Create a `production` environment (Settings → Environments) if you want a manual approval
gate — both deploy jobs already reference it.

### 5. First deploy

```bash
npm run db:migrate
```

```bash
flyctl deploy --remote-only
```

After that, merging `main` into `release` does both automatically.

### 6. Custom domain

```bash
flyctl certs add maharajatofu.com --app maharaja-tofu
```

Add the records it prints, then set `NEXT_PUBLIC_SITE_URL` in `fly.toml` under
`[build.args]` to `https://maharajatofu.com` and redeploy — it is baked into the bundle at
build time, so a secret would not work and a redeploy is required.

---

## The pipeline

**`.github/workflows/ci.yml`** — every PR and every push to `main` or `release`.
Lint, typecheck, unit tests, production build; plus a job that regenerates the Drizzle
migrations and fails if `drizzle/` comes out different from what was committed.

**`.github/workflows/deploy.yml`** — push to `release`, or manual dispatch.
Migrations first, then `flyctl deploy`, then a smoke test on `/api/health` followed by the
home page. `concurrency` serializes deploys and never cancels one in flight.

CI is not a hard gate on deploy — protect `release` and require the CI checks if you want
it to be.

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
