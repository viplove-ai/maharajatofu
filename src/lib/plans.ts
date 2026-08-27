import { PACK_GRAMS } from './nutrition'

export type PlanId = 'chhota' | 'ghar' | 'bada' | 'gym'

export interface Plan {
  id: PlanId
  name: string
  packsPerWeek: number
  /** Rupees per week, mixed basket, 10% subscriber discount already applied. */
  pricePerWeek: number
  deliveriesPerWeek: 1 | 2
  blurb: string
}

/** Names and prices from design_handoff_maharaja_tofu/CALCULATOR_SPEC.md. */
export const PLANS: readonly Plan[] = [
  { id: 'chhota', name: 'Chhota Plan', packsPerWeek: 2, pricePerWeek: 155, deliveriesPerWeek: 1, blurb: 'Tofu on the weekend, a couple or a single' },
  { id: 'ghar', name: 'Ghar Plan', packsPerWeek: 4, pricePerWeek: 305, deliveriesPerWeek: 2, blurb: 'Small family, about three tofu meals a week' },
  { id: 'bada', name: 'Bada Plan', packsPerWeek: 6, pricePerWeek: 455, deliveriesPerWeek: 2, blurb: 'Family of four, or one serious gym-goer' },
  { id: 'gym', name: 'Gym / Cloud Kitchen', packsPerWeek: 10, pricePerWeek: 765, deliveriesPerWeek: 2, blurb: 'Large family, a gym café, or tofu five times a week' },
] as const

/**
 * The LARGEST plan you have already covered — not the smallest one that covers
 * you. Someone needing three packs is offered Chhota (two), not Ghar (four).
 *
 * That is deliberate and consistent with rounding packs down: a plan is a floor
 * people top up from, and selling somebody more perishable food than they asked
 * for is how a first month ends in waste and a cancellation.
 */
export function planForPacks(packs: number): Plan {
  let plan = PLANS[0]
  for (const p of PLANS) if (packs >= p.packsPerWeek) plan = p
  return plan
}

export function planById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id)
}

/**
 * Fresh tofu keeps about five days, and a household comfortably finishes around
 * a kilo inside that window. More than five packs is therefore two deliveries,
 * not one larger drop — the constraint is the product's, not the logistics'.
 */
export const SPLIT_ABOVE_PACKS = 5

export function deliverySplit(packs: number): { deliveries: 1 | 2; tue: number; fri: number } {
  const split = packs > SPLIT_ABOVE_PACKS
  const tue = split ? Math.ceil(packs / 2) : packs
  return { deliveries: split ? 2 : 1, tue, fri: split ? packs - tue : 0 }
}

/** Round to the NEAREST pack, never up: over-buying perishable food creates waste. */
export function packsFromGrams(grams: number): number {
  return Math.max(1, Math.round(grams / PACK_GRAMS))
}
