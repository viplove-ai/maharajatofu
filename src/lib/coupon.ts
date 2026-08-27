import { createHash } from 'crypto'

/**
 * Price sensitivity is measured by varying the COUPON, never the list price.
 * ₹79 and ₹99 are the same for everybody — in a five-kilometre circle where
 * neighbours compare notes, two simultaneous prices read as bad faith. Three
 * discount depths do not: a promotional offer differing by cohort is ordinary,
 * and launch-week redemption by cohort is revealed preference rather than a
 * survey answer.
 */
export const COHORTS = {
  a: { label: '25% off your first order', discountPct: 25, freePack: false },
  b: { label: '15% off your first order', discountPct: 15, freePack: false },
  c: { label: 'A free Masala Tofu pack with your first order', discountPct: 0, freePack: true },
} as const

export type Cohort = keyof typeof COHORTS

/** First this many signups are Founding Members. Batch capacity really is limited. */
export const FOUNDING_LIMIT = 100

export type Tier = 'founding' | 'early_bird'

export function tierForSeq(seq: number): Tier {
  return seq <= FOUNDING_LIMIT ? 'founding' : 'early_bird'
}

/**
 * Derived from the phone number rather than drawn at random, so a cohort is
 * stable: the same person re-submitting cannot shop for a better coupon, and a
 * result is reproducible when we come to analyse redemption.
 */
export function cohortForPhone(phone: string): Cohort {
  const n = createHash('sha256').update(phone).digest()[0] % 3
  return (['a', 'b', 'c'] as const)[n]
}

/** MT-F-0042 for a Founding Member, MT-E-0231 for an Early Bird. */
export function couponCode(seq: number, tier: Tier): string {
  return `MT-${tier === 'founding' ? 'F' : 'E'}-${String(seq).padStart(4, '0')}`
}

export function foundingSlotsLeft(signupCount: number): number {
  return Math.max(0, FOUNDING_LIMIT - signupCount)
}
