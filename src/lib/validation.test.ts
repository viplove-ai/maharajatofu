import { describe, expect, it } from 'vitest'
import { normalisePhone, signupSchema } from './validation'
import { cohortForPhone, couponCode, tierForSeq, foundingSlotsLeft, FOUNDING_LIMIT } from './coupon'

describe('phone normalisation', () => {
  it('accepts the shapes people actually type', () => {
    for (const raw of ['9876543210', '+91 98765 43210', '098765-43210', '0091 9876543210']) {
      expect(normalisePhone(raw)).toBe('9876543210')
    }
  })

  it('rejects anything that is not an Indian mobile', () => {
    for (const raw of ['1234567890', '98765', '5876543210', '', 'abcdefghij']) {
      expect(normalisePhone(raw)).toBeNull()
    }
  })
})

describe('signup validation', () => {
  const valid = {
    name: 'Anjali',
    phone: '+91 98765 43210',
    area: 'vasundhara-6-11',
    pincode: '201012',
    intent: 'launch_week' as const,
    consent: true as const,
  }

  it('accepts a complete signup and stores a normalised phone', () => {
    const parsed = signupSchema.parse(valid)
    expect(parsed.phone).toBe('9876543210')
  })

  it('refuses a signup without consent rather than defaulting it', () => {
    expect(signupSchema.safeParse({ ...valid, consent: false }).success).toBe(false)
    const withoutConsent: Record<string, unknown> = { ...valid }
    delete withoutConsent.consent
    expect(signupSchema.safeParse(withoutConsent).success).toBe(false)
  })

  it('refuses an area outside the delivery list', () => {
    expect(signupSchema.safeParse({ ...valid, area: 'mumbai' }).success).toBe(false)
  })
})

describe('coupons', () => {
  it('makes the first hundred signups Founding Members', () => {
    expect(tierForSeq(1)).toBe('founding')
    expect(tierForSeq(FOUNDING_LIMIT)).toBe('founding')
    expect(tierForSeq(FOUNDING_LIMIT + 1)).toBe('early_bird')
    expect(foundingSlotsLeft(63)).toBe(37)
    expect(foundingSlotsLeft(400)).toBe(0)
  })

  it('numbers codes by tier', () => {
    expect(couponCode(42, 'founding')).toBe('MT-F-0042')
    expect(couponCode(231, 'early_bird')).toBe('MT-E-0231')
  })

  it('assigns a stable cohort so nobody can shop for a better coupon', () => {
    expect(cohortForPhone('9876543210')).toBe(cohortForPhone('9876543210'))
  })

  it('spreads roughly evenly across the three cohorts', () => {
    const counts = { a: 0, b: 0, c: 0 }
    for (let i = 0; i < 900; i++) counts[cohortForPhone(`98765${String(i).padStart(5, '0')}`)]++
    for (const n of Object.values(counts)) expect(n).toBeGreaterThan(240)
  })
})
