/**
 * The protein calculator, as two pure functions.
 *
 * The rule the whole module exists to enforce: people x meals x 100 g is wrong
 * for an Indian kitchen. A shared sabzi for four uses 250-300 g of paneer in
 * total — about 60 g a head — while a tikka plate is a personal 110 g portion,
 * and an eight-year-old eats under half of what an adult does. Portion follows
 * the dish; eaters are weighted; and nothing is rounded up.
 */
import {
  PACK_GRAMS,
  PANEER_KCAL_PER_G,
  PANEER_SATFAT_PER_G,
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
  gramsPerWeek: number
  packsPerWeek: number
  deliveries: 1 | 2
  packsPerDrop: number
  plan: Plan
  /** Set when the result is large enough that a first-timer should start lower. */
  startSmallerPacks: number | null
  proteinPerWeek: number
  kcalSaved: number
  satFatSavedGrams: number
  tofuCostPerWeek: number
  paneerCostPerWeek: number
}

function buildResult(gramsPerWeek: number, paneerDisplacedGrams: number, isNewCustomer: boolean): Result {
  const packsPerWeek = packsFromGrams(gramsPerWeek)
  const { deliveries, perDrop } = deliverySplit(packsPerWeek)
  return {
    gramsPerWeek: Math.round(gramsPerWeek),
    packsPerWeek,
    deliveries,
    packsPerDrop: perDrop,
    plan: planForPacks(packsPerWeek),
    // Almost everyone over-orders in week one and throws some away, and thrown-away
    // tofu is why people quit tofu. Suggesting less is worth the smaller first order.
    startSmallerPacks: isNewCustomer && packsPerWeek > 4 ? Math.max(2, Math.round(packsPerWeek * 0.6)) : null,
    proteinPerWeek: round1((gramsPerWeek * TOFU_PROTEIN_PER_100G) / 100),
    kcalSaved: Math.round(paneerDisplacedGrams * PANEER_KCAL_PER_G - gramsPerWeek * TOFU_KCAL_PER_G),
    satFatSavedGrams: round1(paneerDisplacedGrams * PANEER_SATFAT_PER_G - gramsPerWeek * TOFU_SATFAT_PER_G),
    tofuCostPerWeek: packsPerWeek * AVG_PACK_PRICE,
    paneerCostPerWeek: Math.round((paneerDisplacedGrams / 1000) * PANEER_PRICE_PER_KG),
  }
}

const round1 = (n: number) => Math.round(n * 10) / 10

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
  isNewCustomer?: boolean
}

export interface SwapResult extends Result {
  /** Protein the displaced paneer would have supplied — shown beside proteinPerWeek. */
  paneerProteinPerWeek: number
}

export function calculateSwap(input: SwapInput): SwapResult {
  const displaced = input.paneerGramsPerWeek * input.swapShare
  const grams = input.matchProtein ? displaced * PROTEIN_MATCH_RATIO : displaced
  return {
    ...buildResult(grams, displaced, input.isNewCustomer ?? true),
    paneerProteinPerWeek: round1((displaced * 18) / 100),
  }
}

// ---------------------------------------------------------------- plan mode

/** Grams of raw tofu in one adult portion, by dish. */
export const PORTION = { gravy: 60, bhurji: 75, grill: 110, addon: 50 } as const
export type Dish = keyof typeof PORTION

/** An adult portion is 1.0; everyone else is a fraction of one. */
export const EATER_WEIGHT = { adults: 1.0, teens: 0.85, kids10to12: 0.7, kids4to9: 0.45 } as const

/**
 * Someone training four or more days a week eats a bigger PERSONAL plate. They do
 * not get 40% more of the shared sabzi, so this never applies to gravy or bhurji.
 */
export const TRAINING_BONUS = 1.4

/** Pressing and searing take roughly 12% of the weight, so raw > cooked. */
export const PREP_YIELD = 0.88

export interface PlanInput {
  /** Count only the people who will ACTUALLY eat tofu, not everyone in the house. */
  adults: number
  teens: number
  kids10to12: number
  kids4to9: number
  /** Subset of `adults` who train 4+ days a week. */
  trainingAdults: number
  meals: Record<Dish, number>
  isNewCustomer?: boolean
}

export function calculatePlan(input: PlanInput): Result {
  const shared =
    input.adults * EATER_WEIGHT.adults +
    input.teens * EATER_WEIGHT.teens +
    input.kids10to12 * EATER_WEIGHT.kids10to12 +
    input.kids4to9 * EATER_WEIGHT.kids4to9

  const personal = shared + Math.min(input.trainingAdults, input.adults) * (TRAINING_BONUS - 1)

  const cooked =
    input.meals.gravy * PORTION.gravy * shared +
    input.meals.bhurji * PORTION.bhurji * shared +
    input.meals.grill * PORTION.grill * personal +
    input.meals.addon * PORTION.addon * personal

  const raw = cooked / PREP_YIELD
  // Tofu displaces the paneer that would have been cooked instead, 1:1 by weight.
  return buildResult(raw, raw, input.isNewCustomer ?? true)
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
      input.teens * KID_PROTEIN_RDA['13-17'],
  )
}

export function proteinSharePct(result: Result, householdDaily: number): number {
  if (householdDaily <= 0) return 0
  return Math.round(((result.proteinPerWeek / 7) / householdDaily) * 100)
}

export { PACK_GRAMS }
