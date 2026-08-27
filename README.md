# Maharaja Tofu

Marketing and waitlist site for a fresh soya-tofu brand delivering in Noida Sector 62 and
Vasundhara, Ghaziabad. This is a **six-week validation pilot**: it collects interest, not
money. There is no cart and no payment gateway anywhere in the codebase, and adding one is
a product decision, not a feature request.

`docs/pilot-plan.html` is the authoritative brief — positioning, unit economics, the ad
plan, the compliance checklist and the go/no-go gates. Read it before arguing with a
decision in here; most of them are explained there.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind · Drizzle ORM · Neon Postgres · Fly.io.

Deliberately different from `nirman`, which is a Spring Boot API behind a React SPA. The
reason is SEO: sixteen recipe pages are this site's most durable asset — the thing that
keeps working after the ad budget stops — and they are statically generated here. A
client-rendered SPA would need prerendering bolted on to rank at all. Deploys go
straight off `main`, serialized with no mid-flight cancellation and smoke-tested after.

## Setup

```bash
npm install
```

```bash
cp .env.example .env.local
```

Fill in `DATABASE_URL`, using the **pooled** endpoint — the one with `-pooler` in the host.
This app talks to Neon over HTTP and holds no prepared-statement state, so unlike nirman's
Hikari pool there is nothing here for PgBouncer to break.

If the database and the deploy secrets do not exist yet, `./scripts/setup-secrets.sh` does
all of it in one go. See [`docs/deployment.md`](docs/deployment.md).

```bash
npm run db:migrate
```

```bash
npm run dev
```

The site runs at http://localhost:3000. Only `/api/*`, `/thanks` and `/r/[code]` need the
database — every other page renders without it, so you can work on most of the site with
`DATABASE_URL` unset.

## Commands

```bash
npm run lint && npm run typecheck && npm run test
```

What CI runs. Everything must be clean before a PR.

```bash
npm run db:generate
```

After **any** edit to `src/db/schema.ts`. Commit the generated file in `drizzle/` in the
same commit as the schema change — CI regenerates and fails on a diff, because a schema
edit without a migration only surfaces at deploy time otherwise.

```bash
npm run build
```

Also a correctness check, not just a build: every page that reads Postgres is marked
dynamic, so if one becomes static by accident the build is where it breaks.

## Where things live

| Path | What |
|---|---|
| `src/lib/calculator.ts` | The protein calculator. Pure functions, fully unit tested. |
| `src/lib/nutrition.ts` | Every nutrition constant the site quotes, declared once. |
| `src/lib/coupon.ts` | Coupon codes, tiers, and the three price-sensitivity cohorts. |
| `src/lib/areas.ts` | The delivery circle as a fixed list. |
| `src/content/recipes.ts` | All sixteen recipes. |
| `src/db/schema.ts` | Three tables: signups, bulk leads, out-of-zone pincodes. |
| `src/app/globals.css` | The whole visual identity, as CSS variables. |

### The calculator is the point

`src/lib/calculator.ts` exists to avoid one specific mistake: `people × meals × 100 g`. That
is wrong for an Indian kitchen, where a shared sabzi for four uses 250–300 g in total —
about 60 g a head — while a tikka plate is a personal 110 g portion and an eight-year-old
eats under half an adult's share. Portion follows the dish, eaters are weighted, prep loss
is accounted for, results round **down** to the nearest pack, and anything over five packs
splits across two deliveries because fresh tofu keeps about five days.

The tests encode the worked examples from `docs/pilot-plan.html`. If you change a constant
and a test fails, the plan needs updating too — they are meant to agree.

### Styling

Every colour and typeface is a CSS variable in `src/app/globals.css`, referenced from
`tailwind.config.ts` by name. **The current palette is a placeholder.** Dropping in the
approved brand direction should be an edit to that one `:root` block — if it ever requires
touching a component, something has leaked, and that is a bug worth fixing rather than
working around.

## Things that are decisions, not oversights

- **No payments.** The pilot measures intent, not revenue. The intent signal is the WhatsApp
  confirmation step, which is why `confirmedAt` is set by hand and not by the website.
- **Four form fields.** No house or flat number. Area plus pincode plans a route; anything
  more costs signups and creates data we would then have to hold.
- **Consent is `z.literal(true)`.** A signup arriving without it is refused rather than
  defaulted, and the exact wording shown is stored on the row — DPDP consent has to be
  specific and informed, and a reworded checkbox must not rewrite what past signups agreed to.
- **Prices are shown, but late.** Never in the hero. Hiding them would break the
  calculator's output and reads as evasive in consumer food.
- **Coupon depth varies, list price does not.** Three cohorts, assigned by a hash of the
  phone number so nobody can shop for a better one. Launch-week redemption by cohort is
  revealed price sensitivity. Two different list prices in a five-kilometre circle would be
  noticed and read as bad faith.
- **`TOFU_PROTEIN_PER_100G` is a placeholder.** Replace it with the NABL lab figure before
  launch. It feeds the pack label, the calculator and the ad copy, which is exactly why it
  is one constant in one file.

## Deployment

See [`docs/deployment.md`](docs/deployment.md).
