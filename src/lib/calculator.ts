/**
 * The protein calculator — the reference implementation from
 * design_handoff_maharaja_tofu/CALCULATOR_SPEC.md, unchanged in substance.
 *
 * The rule the module exists to enforce: people × meals × 100 g is wrong for an
 * Indian kitchen. A shared sabzi for four uses 250–300 g of paneer in total,
 * about 60 g a head, while a tikka plate is a personal 110 g portion and an
 * eight-year-old eats under half an adult's share. Portion follows the dish,
 * eaters are weighted, and packs round to the NEAREST — never up.
 *
 * Pure and dependency-free on purpose: it runs client-side on every slider
 * movement, so it has to stay tiny and synchronous.
 */
import { planByPacks, type PlanTier } from '@/content'

/** Lab report batch 0412 for tofu; ICMR-NIN IFCT 2017 for paneer. */
export const TOFU_KCAL_PER_G = 0.76
export const TOFU_PROT_PER_G = 0.1
export const PANEER_KCAL_PER_G = 2.65
export const PANEER_PROT_PER_G = 0.18
export const PACK_G = 200
/** Pressing and searing take weight off, so raw purchased grams exceed cooked. */
export const PREP_LOSS = 1.12
/** 180 g of tofu carries the protein of 100 g of paneer. */
export const MATCH_MULTIPLIER = 1.8
export const EATER_WEIGHT = { adult: 1.0, teen: 0.85, c1012: 0.7, c49: 0.45 } as const
/** Gravy is SHARED — a portion off one pan. The rest are personal plates. */
export const PORTION_G = { gravy: 60, bhurji: 75, tikka: 110, addon: 50 } as const
export const GYM_MULTIPLIER = 1.4
export const SHELF_LIFE_DAYS = 5
/** Fresh tofu keeps about five days, so more than this arrives in two drops. */
export const SPLIT_ABOVE_PACKS = 5

export interface Eaters {
  adult: number
  teen: number
  c1012: number
  c49: number
}

export interface Dishes {
  gravy: number
  bhurji: number
  tikka: number
  addon: number
}

export interface CalcResult {
  packs: number
  /** What actually arrives: packs × 200 g. Every figure below derives from it. */
  actualG: number
  kcalSaved: number
  kcalSavedFourWeeks: number
  tofuProt: number
  paneerProt: number
  tue: number
  fri: number
  split: boolean
  plan: PlanTier
  nudge: boolean
  nudgePacks: number
}

function finish(tofuG: number, paneerEquivG: number): CalcResult {
  // Floor of one: a household asking for any tofu at all gets a pack.
  const packs = Math.max(1, Math.round(tofuG / PACK_G))
  const actualG = packs * PACK_G
  const split = packs > SPLIT_ABOVE_PACKS
  const tue = split ? Math.ceil(packs / 2) : packs
  const kcalSaved = Math.max(
    0,
    Math.round(paneerEquivG * PANEER_KCAL_PER_G - actualG * TOFU_KCAL_PER_G),
  )

  return {
    packs,
    actualG,
    kcalSaved,
    kcalSavedFourWeeks: kcalSaved * 4,
    tofuProt: Math.round(actualG * TOFU_PROT_PER_G),
    paneerProt: Math.round(paneerEquivG * PANEER_PROT_PER_G),
    tue,
    fri: split ? packs - tue : 0,
    split,
    plan: planByPacks(packs),
    // Week one is where people over-order, throw tofu away and quit.
    nudge: packs > 4,
    nudgePacks: Math.max(2, packs - 2),
  }
}

/**
 * Default mode, because it anchors to a behaviour the household already has:
 * how much paneer they buy. A 1:1 swap by weight genuinely carries less protein
 * — the result card says so rather than hiding it — and `match` scales the
 * weight up to close that gap while still cutting calories.
 */
export function calcSwap(paneerG: number, pct: 25 | 50 | 100, match: boolean): CalcResult {
  const paneerEquivG = paneerG * (pct / 100)
  return finish(match ? paneerEquivG * MATCH_MULTIPLIER : paneerEquivG, paneerEquivG)
}

/** For households that do not track paneer: model the week dish by dish. */
export function calcWeek(eaters: Eaters, dishes: Dishes, trains: boolean): CalcResult {
  const w =
    eaters.adult * EATER_WEIGHT.adult +
    eaters.teen * EATER_WEIGHT.teen +
    eaters.c1012 * EATER_WEIGHT.c1012 +
    eaters.c49 * EATER_WEIGHT.c49

  const shared = PORTION_G.gravy * w * dishes.gravy
  // The gym bonus reaches personal plates only. Nobody gets 40% more of the
  // sabzi everyone is eating out of the same pan.
  const personal =
    (PORTION_G.bhurji * dishes.bhurji + PORTION_G.tikka * dishes.tikka + PORTION_G.addon * dishes.addon) *
    w *
    (trains ? GYM_MULTIPLIER : 1)

  return finish((shared + personal) * PREP_LOSS, shared + personal)
}

/** True when nobody has been marked as eating it — the UI asks "kaun khayega?" */
export function noEaters(eaters: Eaters): boolean {
  return eaters.adult + eaters.teen + eaters.c1012 + eaters.c49 === 0
}
