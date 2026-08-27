# Handoff: Maharaja Tofu — pilot website

## Overview
A 6-week validation pilot site for **Maharaja Tofu**, a fresh soya tofu brand made twice a week in a home kitchen in Sector 10, Ghaziabad and delivered inside a 5 km radius (Vasundhara, Vaishali, Indirapuram, Noida Sectors 60/62/63).

There is **no cart, no payment and no checkout**. The site's single job: turn a stranger who tapped an Instagram ad into a *named, reachable, located, ranked* person in under 90 seconds, one-handed, on 4G. The centrepiece is a protein calculator that models a real Indian kitchen and outputs a pack count, a calorie payoff and a pre-filled plan that flows into a four-field form.

Positioning line: **"Utna hi protein. Aadhi calories."** (Same protein. Half the calories.)

## About the design files
`design-references/` holds two rendered prototypes:

| File | What it is |
| --- | --- |
| `Maharaja Tofu Website.dc.html` | The site design: live mobile home page, both working calculator modes, 1440px desktop grid, all states, and mobile layouts for every remaining route. |
| `Maharaja Tofu Brand Book.dc.html` | The brand system: logo suite, palette, packaging type scale, tub label artwork, voice rules. Reference for anything not specified here. |

These are **design references created in HTML** — prototypes showing intended look and behaviour, not production code to copy. The task is to **recreate them in this codebase's existing environment** (React/Next, Vue, whatever is established) using its own components, styling system and patterns. If no frontend environment exists yet, choose one appropriate for the project (Next.js App Router + TypeScript + Tailwind is a good default for this brief) and implement there.

Open them in a browser to interact: drag the calculator slider, switch modes, type a pincode (try `201012` in-zone and `201304` out-of-zone), submit the form. `support.js` must sit beside them for them to render.

## Fidelity
**High-fidelity.** Colours, typography, spacing, copy and interaction logic are final. Recreate the UI closely using this codebase's libraries; treat every hex value and type size below as a spec, not a suggestion. Mobile (390px) is the primary target; desktop (1440px) is the same design on a wider grid.

---

## Design tokens

### Colour
| Token | Hex | Role |
| --- | --- | --- |
| `indigo` | `#14224A` | Primary ground. ~60% of every surface. |
| `indigo-raise` | `#1B2C58` | Raised panel on indigo (counter card, photo fills). |
| `ink` | `#0E1526` | Body text on light, phone status bar. |
| `cream` | `#F4EBDA` | Secondary surface; all lettering on indigo. |
| `paper` | `#FBF7EE` | Page canvas on light sections. |
| `stone` | `#DCD3C0` | Dividers, 1px borders, inactive tracks. |
| `stone-edge` | `#C9C0AC` | Frame borders in the design doc only. |
| `grey-warm` | `#7E7768` | Captions, mono meta. |
| `grey-warm-dark` | `#6E6757` | Secondary body on light. |
| `slate` | `#2A3350` | Body copy on cream/paper. |
| `vermilion` | `#E1442A` | Primary action, rules, section numbers. Never a large background. |
| `marigold` | `#F2A118` | Classic SKU, accents on indigo, the calories-saved block. |
| `chilli` | `#B4202A` | Masala SKU, hard error text. |
| `green` | `#1E7B34` | WhatsApp actions, veg mark, confirmed states, toggle-on. |
| `placeholder-text` | `#A8A08C` | Input placeholder. |
| `track-off` | `#B9B09C` | Toggle track, off. |

Photo placeholders (until real photography lands):
- on indigo: `repeating-linear-gradient(45deg, #1B2C58 0 7px, #22345F 7px 14px)`
- on cream: `repeating-linear-gradient(45deg, #E6DBC4 0 6px, #EFE6D2 6px 12px)`
Each carries a mono caption naming the shot.

### Typography
Four families, all Google Fonts, `display: swap`, no FOIT:

| Family | Use |
| --- | --- |
| **Yatra One** (400) | Devanagari wordmark and logo only. Never body copy. |
| **Mukta** (600/700/800) | Devanagari + Latin headlines, buttons, labels. Devanagari headlines are always Mukta 800. |
| **Archivo** (400/500/600/700) + **Archivo Black** | Latin display (`Archivo Black` for numbers, SKU names, eyebrow-caps) and English body. |
| **IBM Plex Mono** (400/500/600) | Every number that is data — batch codes, dates, pincodes, nutrition, prices in meta, spec captions. Letter-spacing 0.08–0.22em when caps. |

Mobile scale (px / line-height):
- Hero Devanagari: Mukta 800, 40 / 1.1
- Section headline Devanagari: Mukta 800, 22–26 / 1.2–1.25
- Big number: Archivo Black, 54–60 / 0.9–1
- SKU name: Archivo Black, 17–24, letter-spacing 0.03em
- Eyebrow: IBM Plex Mono, 10, letter-spacing 0.20em, uppercase
- Body: Archivo 400, 13.5–14.5 / 1.55
- Button label: Mukta 800, 17–19
- Field value: Archivo 17, mono 18 for numeric fields
- Legal/meta: Plex Mono 9.5–11 / 1.7–2

Desktop overrides: hero Devanagari 68 / 1.05; section headline 30–34; big number 76 / 0.9; body 15–18 / 1.6.

Rule from the brand book: **Devanagari is only ever the brand name and the headline claim.** Never set legal, nutrition or address copy in Devanagari.

### Spacing, radii, borders
- Section padding, mobile: `26px 20px`. Desktop: `44px 40px` / `56px 40px` for the hero.
- Gaps: 8 / 10 / 14 / 16 / 24 px. Card grids use `display: grid` + `gap`, never margins.
- **Radius: 0 everywhere.** The only round things are the circular `म` mark, toggle knobs, the video play button and the phone bezel. This is an enamel-signboard system; corners are square.
- Borders: 1px `stone` on light cards; 2px `indigo` on inputs and chips; 3px `vermilion` as a section rule; 4px left border for pull-quotes; 8px marigold/chilli top bar as an SKU cue.
- Shadows: **none.** Depth comes from colour blocks.
- Minimum hit target 44px; primary buttons 56–58px tall, full width on mobile.

---

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home, 11 blocks (below). |
| `/classic-tofu` | ₹79 / 200 g. Three-ingredient panel as hero element. |
| `/masala-tofu` | ₹99 / 200 g. Video-first (9:16, 11 s, muted autoplay, ≤480 KB, no music, no text overlay). |
| `/protein-calculator` | The calculator standalone, same component as home block 6. |
| `/plans` | Four tiers: ₹155 / ₹305 / ₹455 / ₹765 per week. No payment. |
| `/recipes` | Hub, two filter chips: "Under 5 minutes", "Family dinner". |
| `/recipes/[slug]` | 16 recipe pages. Each shows the paneer version's calories for contrast. |
| `/bulk` | B2B lead form. **The only page designed laptop-first.** |
| `/kitchen` | Two founders, FSSAI number, batch days, Saturday visit invitation. |
| `/privacy` | Short, human, first-person. |
| `/thanks` | "Save our number — we'll WhatsApp you in 2 minutes." Shows rank + coupon. |
| `/r/[token]` | Recognised arrival. Greets by name, pre-loads area + plan, asks for nothing. |

---

## Home page — 11 blocks, in order

**Nav (sticky top, indigo):** 34px circular cream disc with `म` in Yatra One 20px; wordmark महाराजा टोफ़ू Yatra One 17; mono sub-label `GHAZIABAD · 5 KM` in marigold 8.5px/0.16em; hamburger (three 22×2px cream bars, 4px gap).

**1 — Hero** (indigo). Mukta 800 40px: "वही सब्ज़ी।" / "आधी कैलोरी।" (second line marigold). Sub, Archivo 14.5/1.55: fresh soya tofu, made in a home kitchen in Ghaziabad, delivered **Tuesday & Friday** in Sector 62 and Vasundhara. Then a 4:3 hero photo (cut tofu face, hard side light, steel plate, hand in frame). Then one full-width 58px vermilion button "कितना चाहिए? Calculate करें" with a `→` on the right, scrolling to the calculator. Under it, mono 10px centred: `40 SECONDS · NO PAYMENT · NO ACCOUNT`. **No price in the hero** — see "price placement".

**2 — Pincode check** (cream, 3px vermilion bottom rule). Eyebrow `02 — DELIVERY CHECK`; Mukta 800 22 "आपके यहाँ पहुँचाते हैं?"; a 56px mono input (`inputmode="numeric"`, maxlength 6, placeholder 201012) + 106px indigo "Check" button. Four states — see "States".

**3 — Two products** (paper). Two indigo cards, each 118px photo column + text; photo column has a 6px right border in the SKU colour (marigold / chilli). SKU name Archivo Black 17 in marigold / vermilion; one-line description; price Archivo Black 20 with mono `/ 200 G`. No carousel.

**4 — The honest comparison** (cream). Mukta 800 24: "एक ही प्रोटीन, आधी कैलोरी। हिसाब देख लीजिए।" Two side-by-side cards: **180 G TOFU** (indigo card) 137 kcal, protein 18 g, sat fat 1.1 g, cholesterol 0 mg — and **100 G PANEER** (paper card, 2px stone border) 265 kcal, protein 18 g, sat fat 2.3 g, cholesterol 72 mg. Below, a pull-quote with 4px indigo left border headed **WHERE PANEER WINS**: per 100 g paneer has more protein — 18 g against our 10 g — which is why the comparison is per serving. Footnote, mono 9.5: `SOURCE — OUR LAB REPORT (BATCH 0412) & ICMR-NIN IFCT 2017 FOR PANEER`. This block is required; the admission is the point.

**5 — Teen cheezein** (indigo). Photo (soybeans in a steel bowl, water, muslin, the press, 06:00 window light), then the ingredient list as the hero element: IBM Plex Mono 600, 27px, line-height 1.5, numbered `1 SOYBEAN / 2 WATER / 3 COAGULANT`. 2px vermilion rule. Mukta 700 18: "बस इतना ही। पूरी लिस्ट।" Body: no starch, no preservative, no colour; every tub carries its batch number and pressing date; Saturday visits welcome. Link "KITCHEN DEKHIYE →" in marigold with a 1px underline.

**6 — Protein calculator** (paper). Two tabs in a 2px indigo box, 50px tall: "Paneer swap करें" (default) / "हफ़्ते का plan". Active tab = indigo fill, cream text. Inputs in a cream panel; result card in indigo. Full spec in `CALCULATOR_SPEC.md`.

**7 — Recipes** (cream). Three filter chips (44px, 2px indigo border, active = indigo fill): सब / Under 5 minutes / Family dinner. Six cards in a 2-col grid: 92px 4:3 photo, Mukta 700 14.5 name, mono 9.5 meta (`6 MIN · 2 PACKS`).

**8 — Kitchen, price and trust** (paper). Two 128px photos (Ritu at the press 06:10; Arjun loading the insulated bag). Mukta 800 21: "दो लोग, एक रसोई, हफ़्ते में दो बार।" Body naming both founders and the Saturday open invitation. Mono block: `FSSAI LIC. NO. <licence>` / `BATCH DAYS · MON & THU, PRESSED 05:30` / `DELIVERY · TUE & FRI, 6–9 PM`. Then the **price frame** (cream panel): branded paneer 1 kg ₹475–500 (grey, mono) vs Maharaja Classic 1 kg / 5 tubs **₹395** (Archivo Black 17, vermilion); closing line "Cheaper per kilo, half the calories… Plans start at ₹155 a week."

**9 — Signup + early-bird ladder** (indigo). Mukta 800 26: "पहले 100 लोग Founding Members हैं". Honest scarcity card (see "Scarcity"). Three ladder cards: FOUNDING MEMBER (2px marigold border, `CONFIRMED 1–100`, mono list: 25% off first order / free Masala Tofu pack / subscription price locked 3 months / your own code), EARLY BIRD (1px cream-40% border, `CONFIRMED 101+`, 15% off first order), PADOSI BONUS (`ANY REFERRER`, free pack when a neighbour from your society signs up). Then **the form** (see below).

**10 — FAQ** (paper). Six accordion rows, 2px indigo top border, 1px stone dividers, Mukta 700 16 question + mono `+` in vermilion, Archivo 13.5/1.55 answer. Questions and answers are in `content.json`: taste, shelf life, soy allergy, freezing, what's in it, launch date.

**11 — Sticky bottom bar** (mobile, 56px controls, cream ground, 3px indigo top border): full-width vermilion "Early-bird coupon लें" + a 56px square green WhatsApp button linking to `wa.me` with a pre-filled Hinglish message. Present on **every** page.

**Footer** (indigo): Yatra One wordmark, mono link columns, address, FSSAI licence, `© 2026 · PILOT BATCH 01`.

### Price placement — a deliberate decision
Price stays **out of the hero**. The hero sells the swap. Prices appear on the product cards (block 3), inside every calculator result, and are *framed* at block 8 against branded paneer (₹475–500/kg vs ₹395/kg) — after the visitor already wants it. Prices are never hidden; hiding them would break the calculator output and read as evasive. Do not "helpfully" move a price into the hero.

---

## The form — four fields, nothing more

Lives at `#form` in home block 9, and is the target of every primary CTA.

| Field | Control | Rules |
| --- | --- | --- |
| Name | text, 56px, 2px indigo border, placeholder "Ritu" | First name only. The one text field on the site. |
| Phone | 62px `+91` prefix box (cream) + mono input | Exactly 10 digits; strip non-digits on input; `inputmode="numeric"`, `maxlength=10`, `autocomplete="tel-national"`. |
| Area | native `<select>`, 56px | 25 options from `content.json` + "Somewhere else". **Never free text.** |
| Pincode | mono input, letter-spacing 0.14em | 6 digits, `inputmode="numeric"`. |

Plus:
- **Auto-filled plan** (cream panel): `AUTO-FILLED FROM CALCULATOR`, plan name + pack count, price/wk in vermilion mono, and an underlined mono link "CHANGE IN CALCULATOR".
- **Intent chips**, label `KAB ORDER KARENGE?`: "Launch week — पहले हफ़्ते" / "Within a month" / "Just exploring". Single select, 52px, left-aligned text, 2px indigo border, active = indigo fill.
- **Consent checkbox — ships UNTICKED.** 28px square box, 2px indigo border, green fill + cream ✓ when ticked. Label, Mukta 700 15/1.4: "हाँ, मुझे WhatsApp पर launch update और early-bird coupon भेजिए।" Sub-line, 11.5px: only these two messages, from the stated number; reply STOP any time and the number is deleted the same day; link to /privacy. The whole row is the hit target. DPDP Act 2023 requires consent that is free, specific, informed and unambiguous — style it to be *read*, not skipped.
- **Hidden attribution field**, rendered in the design as a visible mono note for the developer: `utm_source`, `utm_campaign`, `ad_id`, `fbclid` read off the landing URL (also capture `utm_medium`, `utm_content`). Instagram passes no user identity — only ad attribution — so every signup row must carry which creative made it.
- **Submit**: 58px vermilion, Mukta 800 19, label "Coupon भेज दीजिए" → "भेज रहे हैं…" → "हो गया ✓".

### Validation
- Phone ≠ 10 digits → chilli `#B4202A` 12.5px 600: "10 digits daal dijiye — we only ever use it on WhatsApp."
- Consent unticked → "We need this tick to message you — DPDP rules, and honestly it is the only way we can reach you."
- The submit button is **never disabled**. Tapping it reveals which field needs help rather than doing nothing.
- Validate on submit, not on blur. Clear the phone error as soon as the user types.

---

## States

**Pincode check**
| State | Design |
| --- | --- |
| Idle | 12.5px grey line naming the pilot zone. |
| Loading (~700 ms) | Dashed-border strip, 14px vermilion ring spinner, mono `CHECKING ROUTE…`. |
| < 6 digits | Paper strip, 4px vermilion left border: "6 digits chahiye — Vasundhara is 201012, Sector 62 is 201309." |
| In zone | Indigo card, 22px green tick square, Mukta 800 19 "{Area} — हाँ जी, पहुँचाते हैं", mono `DELIVERY DAYS · TUE & FRI, 6–9 PM` + `FOUNDING SLOTS LEFT HERE · {n}`. |
| Out of zone | Paper card, 2px marigold border. Mukta 800 19 "अभी नहीं — पर आपका पिन नोट कर लिया". Body: outside the 5 km pilot; a new route opens once **25 people** from one pincode ask; "Yours is #{n}". An 8px stone progress track with a vermilion fill, mono `{n} / 25 IN {pincode}`, and a 54px indigo button "मुझे बताइए जब शुरू हो" that scrolls to the form. **Capture the pincode regardless — this is a conversion state, not an error.** |

**Form** — Empty (placeholders in `#A8A08C`, nothing disabled) · Submitting (spinner in the button, inputs stay filled and editable, nothing greyed; if the request exceeds 8 s, persist locally and retry in the background) · Error (2px chilli border card: "नहीं गया — पर आपका data सुरक्षित है" + retry and WhatsApp buttons side by side) · Done → `/thanks`.

**`/thanks`** — indigo. Mukta 800 22 "हो गया, {Name} ji. हमारा number save कर लीजिए।" Body: we'll WhatsApp in about 2 minutes from the stated number; save it or the message lands in Unknown. Coupon in a 2px dashed marigold box, mono 600 22px, letter-spacing 0.1em: `MT-{NAME}-{RANK}`. Mono block: `FOUNDING MEMBER #64 OF 100` / plan / `FIRST DELIVERY TUE 15 SEP, 6–9 PM`. Two buttons: green "Number save करें" (vCard download or wa.me), outlined "पड़ोसी को भेजें — free pack".

**Already signed up** (returning visitor, identified by localStorage or the `/r/` token) — paper page. Mono green `CONFIRMED · FOUNDING MEMBER #64`; Mukta 800 30 "{Name} ji, आप पहले से अंदर हैं।"; "No form again." Coupon card (indigo, 2px dashed marigold). Plan card (cream) with mono TUE/FRI split, area, pincode, first delivery date, and two buttons: "Plan बदलें" (to calculator) and green "WhatsApp करें". Then a Padosi Bonus card: "1 PACK PENDING — Meenu from your society opened your link but hasn't confirmed", with "FORWARD YOUR LINK →". **Never show the form to someone already in.**

**`/r/[token]`** — recognised arrival, indigo, ~700px. Mono marigold `{REFERRER} NE AAPKO BHEJA HAI`. Mukta 800 34 "नमस्ते {Name}. सब भर दिया है।" Body naming the referrer's society. A paper card listing AREA / PINCODE / PLAN with a mono vermilion `EDIT` affordance on each row — pre-loaded from the token, editable but not required. A 2px marigold Padosi Bonus card. A single consent tick (unticked). One 58px vermilion button "हाँ, मुझे जोड़ लीजिए". Mono footnote: `NOTHING TO TYPE · ONE TAP · TOKEN CARRIES NAME, AREA, PLAN AND REFERRAL ID`. It should feel like being *recognised*, not like a pre-filled form.

---

## Scarcity — honest, not a timer
The counter card (indigo, 1px marigold-50% border) shows: the whole number left in Archivo Black 30 marigold; mono `FOUNDING SLOTS LEFT / SECTOR 62`; an 8px progress track (marigold on cream-20%); mono `{taken} OF 100 CONFIRMED · COUNTED BY HAND AFTER EVERY BATCH · LAST UPDATED TODAY 06:40 BY RITU`; and one line of body explaining the real constraint — one kitchen presses about 60 kg a week, and when 100 founding tubs are committed the ladder closes.

**Never**: a ticking clock, a seconds countdown, a midnight reset, a randomly decrementing number, or red flashing. The number moves only when a batch is counted, and it is served from the backend, never generated client-side.

---

## Ladder logic
- Confirmed rank 1–100 → **Founding Member**: 25% off first order, free Masala Tofu pack, subscription price locked 3 months, unique code `MT-{NAME}-{RANK}`.
- Confirmed 101+ → **Early Bird**: 15% off first order.
- Any referrer → **Padosi Bonus**: a free pack when a neighbour from the same society confirms. Both sides get one.
Rank is assigned server-side on confirmation and returned with the response — never computed in the browser.

---

## Mobile rules
- Every primary action sits in the bottom third of the viewport; sticky bar is 56px of controls.
- LCP < 2 s on 4G. No carousel library, no chat widget, no web-font FOIT.
- Keyboard appears exactly twice (phone, pincode). Everything else: steppers, sliders, chips, native select.
- Hinglish headlines, English body copy.
- A floating `wa.me` button with a pre-filled message on every page. Many people will message instead of filling the form — that is a success, not a leak.
- Desktop is the same design on a wider grid (1440px, hero split 1:1 with the pincode check inline in the hero, product cards 2-up, calculator inputs left / result card pinned right). Only `/bulk` is authored for a laptop.

## `/bulk` — laptop-first
Indigo header: mono `FOR GYMS, CAFÉS & CLOUD KITCHENS`, Mukta 800 34 "1 kg blocks, pressed to your delivery day.", body on yield (~34 portions of 30 g), cut-stability, two batch days, monthly invoicing, FSSAI licence and lab report attached to every quote. Body: form left (business name, your name, +91 phone, type ▾, kg per week ▾) and — in a 2px vermilion box on cream — the field that prices the deal: **"What do you currently pay per kg for paneer?"** with a ₹-per-kg input. Right column: published slab pricing (5–10 kg ₹340/kg · 10–25 kg ₹315/kg · 25 kg+ "talk to Ritu"), a photo of the 1 kg block being cut, and a note that it stays one wide screen — form left, proof right, no scrolling to compare.

---

## State management
Client state (a single store or context is enough — no server state library needed):

```ts
type Mode = 'swap' | 'week';
interface PilotState {
  mode: Mode;                       // default 'swap'
  paneerG: number;                  // 250–3000, step 250, default 1000
  pct: 25 | 50 | 100;               // default 50
  match: boolean;                   // default false
  eaters: { adult: number; teen: number; c1012: number; c49: number };  // default 2/0/1/0
  dishes: { gravy: number; bhurji: number; tikka: number; addon: number }; // default 2/1/1/1
  trains: boolean;                  // default false
  pin: string;                      // digits only, max 6
  pinState: 'idle' | 'short' | 'loading' | 'ok' | 'out';
  form: { name: string; phone: string; area: string; pin: string; intent: 'launch'|'month'|'explore'|''; consent: boolean };
  submitState: 'idle' | 'loading' | 'error' | 'done';
  attribution: Record<string, string>;   // utm_*, ad_id, fbclid — captured once on first visit
  signup?: { rank: number; code: string; plan: string };  // set after a successful POST
}
```

Persist `mode, paneerG, pct, match, eaters, dishes, trains, pin, form.area, plan` and `attribution` and `signup` under **one** localStorage key `mt.pilot.v1`, wrapped in try/catch (private mode must degrade silently, never throw). Rehydrate on mount. Never clear keys you didn't write.

Data fetching: `POST /api/signup` → `{ rank, code }`; `GET /api/slots?pincode=` → `{ left, taken, updatedAt, updatedBy }`; `GET /api/r/[token]` → `{ name, referrer, society, area, pincode, plan }`. Pincode zone lookup is static from `content.json` — no round trip needed, though the design shows a deliberate ~700 ms "checking route" beat so the answer feels checked rather than guessed. Keep it.

---

## Interactions & motion
Restrained by design. Transitions 120–180 ms `ease-out` on colour/opacity only. The spinner is a 2px ring with a transparent right edge, 0.8 s linear rotation. Slider updates the result card synchronously — no debounce, the numbers should move under the thumb. CTA scroll uses `window.scrollTo({ behavior: 'smooth' })` with a 60px offset (never `scrollIntoView`). No parallax, no reveal-on-scroll, no number count-up animation — a count-up on the calories figure would undercut the honesty the block is built on.

---

## Voice rules (from the brand book — enforce in copy review)
Headlines Hinglish, body English. Tone: the aunty next door who happens to be precise. Warm, specific, unbothered.

**Always say**: "Teen cheezein. Bas." (three ingredients, printed large) · "Aaj subah bana." (made-on date and batch number) · "Kitchen aa jao." (standing invitation).

**Never say**: never claim more protein than paneer per 100 g · never attack another brand or a local paneer seller, and never cite paneer-adulteration statistics · never frame it as giving up paneer (no diet talk, no "cheat day", no before-and-after bodies). Also banned: "clean eating", "guilt-free", "superfood", any wellness vocabulary.

Approved claim set: same protein per serving · half the calories · zero cholesterol · half the saturated fat · lactose-free · swaps into any paneer recipe 1:1.

---

## Assets
No production photography or video exists yet. Every image is a striped placeholder with a mono caption naming the shot required. Shot list (from the brand book's photography direction — hard side light at 45°, always a cut or torn face, Indian surfaces, hands in frame, 4300–4800 K, never flat frontal flash or white-on-white):
1. Hero 4:3 — cut tofu face, side light, steel plate, hand reaching in.
2. Teen cheezein — soybeans in a steel bowl, water, muslin, the press, 06:00.
3. Masala on the tawa, charred, hand in frame.
4. Tub in a home fridge, door light only.
5. Ritu at the press, 06:10 · Arjun loading the insulated bag.
6. 1 kg block on a commercial board, chef's hands cutting.
7. `/masala-tofu` video: 9:16, 11 s, muted autoplay, ≤480 KB, lid off → fork in → bite. No music, no text overlay.
Logo: circular `म` mark (Yatra One) on indigo with a marigold inner ring — ship as SVG, also used as the favicon and the Instagram avatar. Provide a one-colour indigo version for print/thermal contexts.

## Legal / compliance elements that must appear
FSSAI licence number (footer, /kitchen, /bulk) · manufacturer name and full address · "Contains Soy" allergen line on both product pages · nutrition per 100 g · DATE OF PACKING given equal prominence to BEST BEFORE wherever dates appear · batch code · "Keep refrigerated 0–4 °C" · green veg mark on product pages · DPDP-compliant consent and a privacy page stating retention, deletion on STOP, 48-hour data access, and India-only storage.

## Files
- `design-references/Maharaja Tofu Website.dc.html` — site design + working calculator (open in a browser).
- `design-references/Maharaja Tofu Brand Book.dc.html` — brand system, palette, packaging.
- `design-references/support.js` — runtime the two references need to render.
- `CALCULATOR_SPEC.md` — the model, reference implementation, test table.
- `tokens.json`, `content.json` — machine-readable tokens and copy.
- `PROMPT.md` — the prompt to paste into Claude Code.
