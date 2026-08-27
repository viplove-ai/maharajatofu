# Paste this into Claude Code

You are implementing the **Maharaja Tofu** pilot website in this repository.

## What you're given
`design_handoff_maharaja_tofu/` contains:
- `README.md` — the full spec: every screen, component, colour, type value, state and interaction. Read it fully before writing code.
- `CALCULATOR_SPEC.md` — the protein calculator model, a reference implementation and test cases. The maths is the product; do not improvise it.
- `tokens.json` — design tokens (colours, type scale, spacing, radii).
- `content.json` — real copy, area list, pincode zone map, plans, FAQs, recipes. Use these strings verbatim; do not rewrite the Hinglish.
- `design-references/*.dc.html` — the rendered design prototypes. Open them in a browser to see intended look and behaviour.

**The HTML files are design references, not production code.** Do not copy their markup. Recreate the designs in this repo's existing framework and conventions (components, styling system, routing, forms). If this repo has no frontend yet, use Next.js App Router + TypeScript + Tailwind and say so in your first message.

## Fidelity
High-fidelity. Colours, type sizes, weights, spacing and copy in the README are final — match them. Layout should be pixel-close on a 390px viewport first, then the 1440px grid described for desktop.

## Build order
1. Design tokens + type setup (fonts: Yatra One, Mukta, Archivo/Archivo Black, IBM Plex Mono via `next/font` or equivalent, `display: swap`).
2. The protein calculator as a pure, unit-tested module (`calcSwap`, `calcWeek`) + its UI. Everything else depends on its output.
3. The four-field signup form with validation, DPDP consent, hidden UTM capture and localStorage persistence.
4. The home page, blocks 1–11 in the README's order.
5. Remaining routes: /classic-tofu, /masala-tofu, /protein-calculator, /plans, /recipes, /recipes/[slug], /bulk, /kitchen, /privacy, /thanks, /r/[token].
6. All states: empty, loading, error, already-signed-up, out-of-delivery-zone, recognised arrival.

## Non-negotiables
- **No cart, no payments, no checkout.** This is a 6-week validation pilot. The only conversion is the four-field form.
- **Four fields only**: first name, phone (10 digits, +91 prefixed, `inputmode="numeric"`), area (select from the 25-item list — never free text), pincode (6 digits). Never ask for house/flat number or full address.
- **Consent checkbox ships unticked** and must be readable, not skippable-looking. DPDP Act 2023: free, specific, informed, unambiguous.
- **The keyboard may appear exactly twice**: phone and pincode. Everything else is steppers, sliders, chips, native select.
- **Round packs to NEAREST, never up.** Rounding up inflates the basket and is a trust breach.
- **Never claim more protein per 100 g than paneer.** The honest protein line in the result card is required copy, including the 1:1 trade-off admission.
- **Never attack another brand** or cite paneer-adulteration statistics anywhere in code, copy, alt text or meta tags.
- **Out-of-zone is a conversion state, not an error**: capture the pincode, show the 25-requests-opens-a-route progress, offer the form.
- **Performance**: target LCP < 2.0 s on 4G. No carousel library, no chat widget, no analytics bundle beyond a single lightweight pageview call. Hero image ≤ 90 KB AVIF, preloaded. Calculator logic must stay client-side and tiny.
- **Persistence**: calculator inputs, pincode, area and chosen plan persist under a single `mt.pilot.v1` localStorage key. A returning visitor re-enters nothing. Never clear keys you didn't write.
- **UTM / ad attribution**: read `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `ad_id`, `fbclid` off the landing URL on first visit, store them, and submit them as hidden fields with every signup row.
- **Accessibility**: 44px minimum hit targets, visible focus rings in Sign Vermilion `#E1442A`, labels tied to inputs, Devanagari headings inside elements with `lang="hi"`.

## Data layer
No CMS. `content.json` is the source of truth for areas, pincodes, plans, FAQs and recipes — load it statically. Signups POST to a single endpoint (`POST /api/signup`) that appends a row (Google Sheet, Airtable or Postgres — pick what this repo already has) and returns `{ rank, code }` so the client can show "Founding Member #64" and the coupon `MT-<NAME>-<NNN>`.

## Definition of done
- `/` scores LCP < 2.0 s on simulated 4G in Lighthouse mobile.
- Calculator unit tests pass, including the CALCULATOR_SPEC test table.
- Form cannot submit with an invalid phone or an unticked consent box, and shows the exact error copy from the README.
- Reloading the page after touching the calculator restores every input.
- A visit to `/r/<token>` renders the recognised arrival with nothing to type.
- All 11 home blocks render in order on a 390px viewport with the sticky bar pinned.
