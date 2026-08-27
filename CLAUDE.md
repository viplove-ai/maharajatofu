# CLAUDE.md

Guidance for Claude Code working in this repository.

Maharaja Tofu is the marketing and waitlist site for a fresh soya-tofu brand delivering in
Noida Sector 62 and Vasundhara, Ghaziabad. Next.js 15 App Router, TypeScript, Tailwind,
Drizzle on Neon Postgres, deployed to Fly.io.

`README.md` is the authoritative setup guide. `docs/pilot-plan.html` is the product brief and
explains *why* most of the rules below exist — read it before arguing with one.

## This is a validation pilot, not a shop

It collects interest, not money. There is no cart, no checkout and no payment gateway, and
that is deliberate: the pilot's job is to find out whether people in two pin codes want
this. Do not add commerce features without being asked for them explicitly.

The signal that substitutes for a payment is the WhatsApp confirmation step — someone saving
the number and replying. That is why `signups.confirmedAt` is nullable and set by hand, and
why nothing in the web app can set it.

## Commands

```bash
npm run lint && npm run typecheck && npm run test
```

Exactly what CI runs. All three must be clean.

```bash
npm run db:generate
```

Required after **any** change to `src/db/schema.ts`, committed alongside it. CI regenerates
and fails on a diff.

```bash
npm run test -- calculator
```

The calculator tests encode the worked examples from the pilot plan. A change that breaks
them means the plan document needs updating too.

## Rules that are easy to break by accident

- **Never claim tofu has more protein than paneer.** Per 100 g it does not — 8–12 g against
  18–20 g. The defensible claim is protein *per calorie*, and the arithmetic behind
  "utna hi protein, aadhi calories" (180 g tofu = 100 g paneer = 18 g protein, at 137 kcal
  against 265) is on the home page on purpose. Copy that overstates this gets screenshotted.
- **The product name is "Tofu (Soya Bean Curd)".** FSSAI restricts dairy terms for non-dairy
  analogues. Marketing copy may compare against paneer; a label may not borrow its name.
- **No health claims.** No isoflavone or heart-health language anywhere. The evidence is too
  weak to defend and the category is regulated.
- **Never attack paneer sellers.** Disparagement is actionable under ASCI. The argument is
  made positively — three ingredients, a batch code, an open kitchen — and the reader draws
  their own conclusion.
- **Nutrition numbers come from `src/lib/nutrition.ts` only.** Never inline one in a
  component. They currently hold placeholder values pending the NABL lab report, and the
  whole point of a single module is that replacing them is one edit.
- **Consent stays affirmative.** `signupSchema` uses `z.literal(true)` and stores the exact
  wording shown. Do not give it a default, do not bundle it with another checkbox, and do
  not make it a condition of using the calculator.
- **Do not add fields to the signup form.** Four is the whole design. In particular, never
  ask for a house or flat number.

## Conventions

- Colours and typefaces live only in the `:root` block of `src/app/globals.css` and reach
  components through Tailwind token names. No component hard-codes a hex value. The palette
  in there now is a placeholder for the brand work in progress.
- Pages that read Postgres are `dynamic`; everything else is static. The sixteen recipe
  pages are statically generated and are the site's most durable asset — keep them that way.
- Analytics event names are declared in `src/lib/attribution.ts` (`EventName`). Add new ones
  there rather than passing a string literal, so the site and the dashboards cannot drift.
- Copy is Hinglish in headlines, English in body text. Devanagari belongs on the pack, not
  on the site.
- Mobile first, and literally: primary actions in the bottom third, 48 px minimum tap
  targets, the keyboard invoked only for the phone number and the pincode.

## Deployment

`main` is the integration branch; production deploys only from `release`. Migrations run as
their own CI job *before* the Fly deploy, not at app startup — a bad migration should fail a
one-off job while the running machine keeps serving, rather than crash-looping every boot.
See `docs/deployment.md`.
