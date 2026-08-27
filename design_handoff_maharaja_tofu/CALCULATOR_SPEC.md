# Protein calculator — model, reference implementation, tests

The calculator is the product. It must model a real Indian kitchen, not multiply heads by 100 g. Two modes, switched by a tab at the top of the block.

## Constants
```ts
export const TOFU_KCAL_PER_G = 0.76;    // 76 kcal / 100 g  (our lab report, batch 0412)
export const TOFU_PROT_PER_G = 0.10;    // 10 g  / 100 g
export const PANEER_KCAL_PER_G = 2.65;  // 265 kcal / 100 g (ICMR-NIN IFCT 2017)
export const PANEER_PROT_PER_G = 0.18;  // 18 g  / 100 g
export const PACK_G = 200;
export const PREP_LOSS = 1.12;          // pressing + searing
export const MATCH_MULTIPLIER = 1.8;    // 180 g tofu ≈ 100 g paneer on protein
export const EATER_WEIGHT = { adult: 1.0, teen: 0.85, c1012: 0.7, c49: 0.45 };
export const PORTION_G = { gravy: 60, bhurji: 75, tikka: 110, addon: 50 };  // gravy is SHARED
export const GYM_MULTIPLIER = 1.4;      // personal plates ONLY, never a shared gravy
export const SHELF_LIFE_DAYS = 5;
export const SPLIT_ABOVE_PACKS = 5;     // > 5 packs must arrive in two drops
```

## Mode 1 — "Swap my paneer" (default)
Default because it anchors to behaviour the household already has.

Inputs: `paneerG` slider 250–3000 g, step 250, default 1000 · `pct` chips 25 / 50 / 100, default 50 · `match` toggle, default **off**.

```
paneerEquivG = paneerG * pct/100
tofuG        = match ? paneerEquivG * 1.8 : paneerEquivG   // recipe swap is 1:1 by weight
packs        = max(1, round(tofuG / 200))                   // NEAREST, never up
```

## Mode 2 — "Plan my week"
Portions come from the **dish**, not the person. Ask who *eats* it, not who lives in the house — in most homes at least one person won't touch it in week one, and an honest count produces an honest basket.

Inputs: eater steppers (adult / teen 13–19 / child 10–12 / child 4–9) · dish steppers = meals per week (shared gravy sabzi / bhurji / tikka-grill plate / quick add-on) · `trains` toggle ("someone trains 4+ days a week").

```
w        = adult*1.0 + teen*0.85 + c1012*0.7 + c49*0.45
shared   = 60 * w * meals.gravy                                        // no gym bonus, ever
personal = (75*meals.bhurji + 110*meals.tikka + 50*meals.addon) * w * (trains ? 1.4 : 1)
tofuG    = (shared + personal) * 1.12                                  // prep loss
packs    = max(1, round(tofuG / 200))
```

## Shared output
```
actualG   = packs * 200
kcalSaved = max(0, round(paneerEquivG * 2.65 - actualG * 0.76))
tofuProt   = round(actualG * 0.10)
paneerProt = round(paneerEquivG * 0.18)
split = packs > 5
tue   = split ? ceil(packs/2) : packs
fri   = split ? packs - tue : 0
plan  = highest tier whose packs <= packs   // 2 → Chhota ₹155, 4 → Ghar ₹305, 6 → Bada ₹455, 10 → Gym ₹765
nudge = packs > 4                            // "start with (packs-2) for two weeks"
```
In mode 2, `paneerEquivG = shared + personal` (before prep loss) — the same dishes cooked with paneer.

## Result card — visual weight, in this order
1. **Packs per week and which days they arrive** — Archivo Black 60px, then two bordered TUE / FRI boxes. Not grams, not servings.
2. **Calories saved this week** — the largest thing on the screen, marigold block, Archivo Black 54px, plus "Over 4 weeks: {×4} kcal". This is the number people screenshot.
3. **The honest protein line** — bordered panel, footnoted `RDA REFERENCE — ICMR-NIN 2020: 0.83 G PROTEIN / KG BODY WEIGHT / DAY`. Required copy:
   - 1:1 swap, match off: "Straight 1:1 swap: {actualG} g of tofu gives about {tofuProt} g protein against {paneerProt} g from the paneer it replaces — that is less, and we would rather say it than hide it. Turn on 'match my protein' and we send 1.8× the weight to make it level."
   - match on: "Matched: {actualG} g of tofu ≈ {tofuProt} g protein, level with the {paneerProt} g the paneer was giving you — and still {kcalSaved} kcal lighter this week."
   - mode 2: "This basket carries about {tofuProt} g of protein across the week. The same dishes made with paneer would give roughly {paneerProt} g — a little more, at more than double the calories. Add one tikka plate to close the gap."
4. **Split note** when `split`: "Fresh tofu keeps about 5 days, so {packs} packs come in two drops — that is exactly why we deliver Tuesday and Friday." This explains the schedule better than any sales copy.
5. **First-timer nudge** when `packs > 4` (paper card inside the indigo): "पहले 2 हफ़्ते {packs-2} पैक से शुरू करें" + "Week one is where people over-order, throw tofu away and quit. Start smaller, then move up — we change your plan on WhatsApp in one message."
6. **Share to WhatsApp** — green 56px, plain text only (no image; it must send in ~1 s on 4G): `Ghar ke liye {packs} packs/week — Tue {tue}, Fri {fri}. Wahi sabzi, {kcalSaved} kcal kam. Maharaja Tofu, Ghaziabad — maharajatofu.com/r/{token}`. The referral token makes the forward the growth loop: whoever taps arrives recognised.
7. **The pre-filled plan** — vermilion 56px "यही plan चुनें — {planName}", scrolling to the four-field form with the plan already set. Mono line under it: `{planName} · {planPrice} / WEEK · CHANGE ANYTIME`.

Design the card as something a person forwards to their family group. That is the entire growth loop.

## Reference implementation
```ts
export interface CalcResult {
  packs: number; actualG: number; kcalSaved: number;
  tofuProt: number; paneerProt: number;
  tue: number; fri: number; split: boolean;
  plan: { name: string; price: string; packs: number };
  nudge: boolean; nudgePacks: number;
}

const PLANS = [
  { packs: 2,  name: 'Chhota Plan', price: '₹155' },
  { packs: 4,  name: 'Ghar Plan',   price: '₹305' },
  { packs: 6,  name: 'Bada Plan',   price: '₹455' },
  { packs: 10, name: 'Gym / Cloud Kitchen', price: '₹765' },
];

function finish(tofuG: number, paneerEquivG: number): CalcResult {
  const packs = Math.max(1, Math.round(tofuG / PACK_G));
  const actualG = packs * PACK_G;
  const split = packs > SPLIT_ABOVE_PACKS;
  const tue = split ? Math.ceil(packs / 2) : packs;
  let plan = PLANS[0];
  for (const p of PLANS) if (packs >= p.packs) plan = p;
  return {
    packs, actualG,
    kcalSaved: Math.max(0, Math.round(paneerEquivG * PANEER_KCAL_PER_G - actualG * TOFU_KCAL_PER_G)),
    tofuProt: Math.round(actualG * TOFU_PROT_PER_G),
    paneerProt: Math.round(paneerEquivG * PANEER_PROT_PER_G),
    tue, fri: split ? packs - tue : 0, split,
    plan, nudge: packs > 4, nudgePacks: Math.max(2, packs - 2),
  };
}

export function calcSwap(paneerG: number, pct: 25|50|100, match: boolean): CalcResult {
  const paneerEquivG = paneerG * (pct / 100);
  return finish(match ? paneerEquivG * MATCH_MULTIPLIER : paneerEquivG, paneerEquivG);
}

export function calcWeek(
  eaters: { adult: number; teen: number; c1012: number; c49: number },
  dishes: { gravy: number; bhurji: number; tikka: number; addon: number },
  trains: boolean
): CalcResult {
  const w = eaters.adult * EATER_WEIGHT.adult + eaters.teen * EATER_WEIGHT.teen
          + eaters.c1012 * EATER_WEIGHT.c1012 + eaters.c49 * EATER_WEIGHT.c49;
  const shared = PORTION_G.gravy * w * dishes.gravy;
  const personal = (PORTION_G.bhurji * dishes.bhurji + PORTION_G.tikka * dishes.tikka
                  + PORTION_G.addon * dishes.addon) * w * (trains ? GYM_MULTIPLIER : 1);
  return finish((shared + personal) * PREP_LOSS, shared + personal);
}
```

## Test table
| Case | Input | Expect |
| --- | --- | --- |
| Default swap | 1000 g, 50%, match off | tofuG 500 → **3 packs**, kcalSaved 869, tofuProt 60, paneerProt 90, no split, Ghar-tier fallback = Chhota Plan (packs 3 ≥ 2) |
| Rounds down, never up | 1000 g, 25%, match off | tofuG 250 → **1 pack** (1.25 rounds to 1) |
| Matched protein | 1000 g, 50%, match on | tofuG 900 → **5 packs**, tofuProt 100 ≈ paneerProt 90, no split (5 is not > 5) |
| Full swap, matched | 2000 g, 100%, match on | tofuG 3600 → **18 packs**, split true, tue 9 / fri 9 |
| Minimum | 250 g, 25%, match off | tofuG 62.5 → **1 pack** (floor at 1) |
| Week, default household | 2 adult, 1 child 10–12, gravy 2, bhurji 1, tikka 1, addon 1, gym off | w = 2.7; shared 324; personal 634.5; ×1.12 = 1073.6 → **5 packs**, nudge true (>4), no split |
| Gym bonus is personal-only | same + gym on | shared stays 324; personal ×1.4 = 888.3; ×1.12 = 1357.7 → **7 packs**, split true, tue 4 / fri 3 |
| Nobody eats it | all eaters 0 | w 0 → tofuG 0 → **1 pack** floor; UI should instead prompt "kaun khayega?" before showing a result |

Cover at minimum: rounding to nearest in both directions, the pack floor of 1, the >5 split, the gym bonus never touching `shared`, and `kcalSaved` never going negative.
