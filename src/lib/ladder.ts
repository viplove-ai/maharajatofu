import { createHash, randomBytes } from 'crypto'

/**
 * Rank and coupon are assigned SERVER-SIDE on confirmation and returned with the
 * response — never computed in the browser. The scarcity counter is served from
 * the same source, so the number on the page moves only when a row is written.
 */

export const FOUNDING_LIMIT = 100

export type Tier = 'founding' | 'early_bird'

export function tierForRank(rank: number): Tier {
  return rank <= FOUNDING_LIMIT ? 'founding' : 'early_bird'
}

/**
 * `MT-{NAME}-{RANK}` — the person's own name in their own coupon. Latin letters
 * only and folded to upper case, so a Devanagari or accented name still yields
 * something readable over a phone line; falls back to MT-DOST-064.
 */
export function couponCode(name: string, rank: number): string {
  const clean = name
    .normalize('NFD')
    .replace(/[^A-Za-z]/g, '')
    .toUpperCase()
    .slice(0, 8)
  return `MT-${clean || 'DOST'}-${String(rank).padStart(3, '0')}`
}

export function foundingSlotsLeft(confirmed: number): number {
  return Math.max(0, FOUNDING_LIMIT - confirmed)
}

/**
 * Price sensitivity is measured by varying the COUPON, never the list price.
 * ₹79 and ₹99 are the same for everybody — in a five-kilometre circle where
 * neighbours compare notes, two list prices would read as bad faith. Three
 * discount depths do not, and launch-week redemption by cohort is revealed
 * preference rather than a survey answer.
 *
 * Derived from the phone number rather than drawn at random, so the cohort is
 * stable: re-submitting cannot shop for a better coupon, and the analysis is
 * reproducible.
 */
export const COHORTS = {
  a: { label: '25% off your first order', discountPct: 25, freePack: false },
  b: { label: '15% off your first order', discountPct: 15, freePack: false },
  c: { label: 'A free Masala Tofu pack with your first order', discountPct: 0, freePack: true },
} as const

export type Cohort = keyof typeof COHORTS

export function cohortForPhone(phone: string): Cohort {
  const n = createHash('sha256').update(phone).digest()[0] % 3
  return (['a', 'b', 'c'] as const)[n]
}

/** Opaque referral token for /r/[token]. Not derived from the phone number. */
export function referralToken(): string {
  return randomBytes(9).toString('base64url')
}
