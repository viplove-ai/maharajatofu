/**
 * The protein calculator. Implements design_handoff_maharaja_tofu/CALCULATOR_SPEC.md.
 *
 * The rule the whole module exists to enforce: people x meals x 100 g is wrong
 * for an Indian kitchen. A shared sabzi for four uses 250-300 g of paneer in
 * total — about 60 g a head — while a tikka plate is a personal 110 g portion,
 * and an eight-year-old eats under half of what an adult does. Portion follows
 * the dish, eaters are weighted, and nothing is rounded up.
 */
import {
  PACK_GRAMS,
  PANEER_KCAL_PER_G,
  PANEER_PROTEIN_PER_100G,
  PANEER_SATFAT_PER_G,
  PREP_LOSS,
  PROTEIN_FACTOR,
  PROTEIN_MATCH_RATIO,
  KID_PROTEIN_RDA,
  TOFU_KCAL_PER_G,
  TOFU_PROTEIN_PER_100G,
  TOFU_SATFAT_PER_G,
  type Activity,
} from './nutrition'
import { deliverySplit, packsFromGrams, planForPacks, type Plan } from './plans'

/** Average pack price used for the weekly cost estimate — mixed Classic/Masala basket. */
const AVG_PACK_PRICE = 85
/** Typical NCR shelf price for branded paneer, rupees per kg. Verify before printing. */
const PANEER_PRICE_PER_KG = 480

export interface Result {
  /** What the calculator worked out you need, before pack rounding. */
  tofuGrams: number
  packsPerWeek: number
  /** What you actually receive: packs x 200 g. Every figure below uses this. */
  actualGrams: number
  deliveries: 1 | 2
  tue: number
  fri: number
  split: boolean
  plan: Plan
  /** Set when the result is large enough that a first-timer should start lower. */
  nudgePacks: number | null
  tofuProtein: number
  paneerProtein: number
  kcalSaved: number
  kcalSavedFourWeeks: number
  satFatSavedGrams: number
  tofuCostPerWeek: number
  paneerCostPerWeek: number
}

/**
 * Everything downstream is computed from `actualGrams`, not from the raw
 * requirement — the honest number is what lands in the fridge, not what the
 * arithmetic asked for before it was rounded to whole tubs.
 */
function finish(tofuGrams: number, paneerEquivGrams: number): Result {
  const packsPerWeek = packsFromGrams(tofuGrams)
  const actualGrams = packsPerWeek * PACK_GRAMS
  const { deliveries, tue, fri } = deliverySplit(packsPerWeek)
  const kcalSaved = Math.max(
    0,
    Math.round(paneerEquivGrams * PANEER_KCAL_PER_G - actualGrams * TOFU_KCAL_PER_G),
  )

  return {
    tofuGrams: Math.round(tofuGrams),
    packsPerWeek,
    actualGrams,
    deliveries,
    tue,
    fri,
    split: deliveries === 2,
    plan: planForPacks(packsPerWeek),
    // Week one is where people over-order, throw tofu away and quit. Two packs
    // fewer is a small enough step to say out loud without losing the sale.
    nudgePacks: packsPerWeek > 4 ? packsPerWeek - 2 : null,
    tofuProtein: Math.round((actualGrams * TOFU_PROTEIN_PER_100G) / 100),
    paneerProtein: Math.round((paneerEquivGrams * PANEER_PROTEIN_PER_100G) / 100),
    kcalSaved,
    kcalSavedFourWeeks: kcalSaved * 4,
    satFatSavedGrams: Math.max(
      0,
      Math.round((paneerEquivGrams * PANEER_SATFAT_PER_G - actualGrams * TOFU_SATFAT_PER_G) * 10) / 10,
    ),
    tofuCostPerWeek: packsPerWeek * AVG_PACK_PRICE,
    paneerCostPerWeek: Math.round((paneerEquivGrams / 1000) * PANEER_PRICE_PER_KG),
  }
}

// ---------------------------------------------------------------- swap mode

export interface SwapInput {
  /** Grams of paneer the household buys in a week. */
  paneerGramsPerWeek: number
  /** Fraction of that paneer to replace: 0.25, 0.5 or 1. */
  swapShare: number
  /**
   * Off: swap 1:1 by weight, because the recipe needs the same volume of cubes —
   * which genuinely gives less protein, and the result says so. On: scale up so
   * the protein matches, which still cuts the calories.
   */
  matchProtein: boolean
}

export function calculateSwap(input: SwapInput): Result {
  const paneerEquiv = input.paneerGramsPerWeek * input.swapShare
  return finish(input.matchProtein ? paneerEquiv * PROTEIN_MATCH_RATIO : paneerEquiv, paneerEquiv)
}

// ---------------------------------------------------------------- plan mode

/** Grams of raw tofu in one adult portion, by dish. */
export const PORTION = { gravy: 60, bhurji: 75, tikka: 110, addon: 50 } as const
export type Dish = keyof typeof PORTION

/** An adult portion is 1.0; everyone else is a fraction of one. */
export const EATER_WEIGHT = { adults: 1.0, teens: 0.85, kids10to12: 0.7, kids4to9: 0.45 } as const

/**
 * Somebody training four or more days a week eats a bigger PERSONAL plate. It
 * never applies to a shared gravy — you do not get 40% more of the sabzi
 * everyone is eating out of the same pan.
 */
export const GYM_MULTIPLIER = 1.4

export interface PlanInput {
  /** Count only the people who will ACTUALLY eat tofu, not everyone in the house. */
  adults: number
  teens: number
  kids10to12: number
  kids4to9: number
  /** Does anyone in the house train 4+ days a week? */
  trains: boolean
  meals: Record<Dish, number>
}

export function calculatePlan(input: PlanInput): Result {
  const weight =
    input.adults * EATER_WEIGHT.adults +
    input.teens * EATER_WEIGHT.teens +
    input.kids10to12 * EATER_WEIGHT.kids10to12 +
    input.kids4to9 * EATER_WEIGHT.kids4to9

  const shared = PORTION.gravy * weight * input.meals.gravy
  const personal =
    (PORTION.bhurji * input.meals.bhurji +
      PORTION.tikka * input.meals.tikka +
      PORTION.addon * input.meals.addon) *
    weight *
    (input.trains ? GYM_MULTIPLIER : 1)

  // The paneer comparison is the same dishes cooked the old way — measured
  // before prep loss, because paneer does not get pressed.
  const paneerEquiv = shared + personal
  return finish(paneerEquiv * PREP_LOSS, paneerEquiv)
}

// ------------------------------------------------- household protein context

export interface HouseholdInput {
  adults: number
  avgAdultWeightKg: number
  activity: Activity
  kids4to9: number
  kids10to12: number
  teens: number
}

/**
 * Daily protein the household needs, in grams. Used only to show tofu's honest
 * SHARE of that need — which for a family of four is a modest number, and is
 * printed as such. A calculator that only ever produces good news reads as an
 * advertisement within about four seconds.
 */
export function householdDailyProtein(input: HouseholdInput): number {
  return Math.round(
    input.adults * input.avgAdultWeightKg * PROTEIN_FACTOR[input.activity] +
      input.kids4to9 * KID_PROTEIN_RDA['4-9'] +
      input.kids10to12 * KID_PROTEIN_RDA['10-12'] +
      input.teens * KID_PROTEIN_RDA['13-19'],
  )
}

export function proteinSharePct(result: Result, householdDaily: number): number {
  if (householdDaily <= 0) return 0
  return Math.round((result.tofuProtein / 7 / householdDaily) * 100)
}

export { PACK_GRAMS }
