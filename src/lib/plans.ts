import { PACK_GRAMS } from './nutrition'

export type PlanId = 'weekender' | 'thrice' | 'daily' | 'parivaar'

export interface Plan {
  id: PlanId
  name: string
  packsPerWeek: number
  /** Rupees per week, mixed basket, 10% subscriber discount already applied. */
  pricePerWeek: number
  deliveriesPerWeek: 1 | 2
  blurb: string
}

export const PLANS: readonly Plan[] = [
  { id: 'weekender', name: 'Weekender', packsPerWeek: 2, pricePerWeek: 155, deliveriesPerWeek: 1, blurb: 'Tofu on the weekend, a couple or a single' },
  { id: 'thrice', name: 'Thrice', packsPerWeek: 4, pricePerWeek: 305, deliveriesPerWeek: 2, blurb: 'Small family, about three tofu meals a week' },
  { id: 'daily', name: 'Daily Protein', packsPerWeek: 6, pricePerWeek: 455, deliveriesPerWeek: 2, blurb: 'Family of four, or one serious gym-goer' },
  { id: 'parivaar', name: 'Parivaar', packsPerWeek: 10, pricePerWeek: 765, deliveriesPerWeek: 2, blurb: 'Large family, tofu five or more times a week' },
] as const

/** The cheapest plan that covers the weekly pack count, or the largest if none does. */
export function planForPacks(packs: number): Plan {
  return PLANS.find((p) => p.packsPerWeek >= packs) ?? PLANS[PLANS.length - 1]
}

export function planById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id)
}

/**
 * Fresh tofu keeps about five days, and a household comfortably finishes around
 * a kilo inside that window. More than five packs is therefore two deliveries,
 * not one larger drop — the constraint is the product's, not the logistics'.
 */
export const MAX_PACKS_PER_DELIVERY = 5

export function deliverySplit(packs: number): { deliveries: 1 | 2; perDrop: number } {
  const deliveries = packs <= MAX_PACKS_PER_DELIVERY ? 1 : 2
  return { deliveries, perDrop: Math.ceil(packs / deliveries) }
}

/** Round to the NEAREST pack, never up: over-buying perishable food creates waste. */
export function packsFromGrams(grams: number): number {
  return Math.max(1, Math.round(grams / PACK_GRAMS))
}
