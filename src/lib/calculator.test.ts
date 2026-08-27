import { describe, expect, it } from 'vitest'
import {
  calculatePlan,
  calculateSwap,
  householdDailyProtein,
  proteinSharePct,
} from './calculator'
import { packsFromGrams, deliverySplit, planForPacks } from './plans'

describe('swap mode', () => {
  // The worked example in docs/pilot-plan.html: a household buying 1 kg of
  // paneer a week swaps half of it.
  const half = calculateSwap({ paneerGramsPerWeek: 1000, swapShare: 0.5, matchProtein: false })

  it('turns 500 g into 3 packs on the Thrice plan', () => {
    expect(half.gramsPerWeek).toBe(500)
    expect(half.packsPerWeek).toBe(3)
    expect(half.plan.id).toBe('thrice')
    expect(half.deliveries).toBe(1)
  })

  it('reports the calorie and saturated-fat saving', () => {
    expect(half.kcalSaved).toBe(945)
    expect(half.satFatSavedGrams).toBe(20)
  })

  it('states the protein trade-off honestly rather than hiding it', () => {
    // A 1:1 recipe swap genuinely loses protein. The result carries both numbers
    // so the UI cannot show one without the other.
    expect(half.proteinPerWeek).toBe(50)
    expect(half.paneerProteinPerWeek).toBe(90)
    expect(half.proteinPerWeek).toBeLessThan(half.paneerProteinPerWeek)
  })

  it('costs about the same as the paneer it replaces', () => {
    expect(half.tofuCostPerWeek).toBe(255)
    expect(half.paneerCostPerWeek).toBe(240)
  })

  it('matches the protein when asked, and still saves calories', () => {
    const matched = calculateSwap({ paneerGramsPerWeek: 1000, swapShare: 0.5, matchProtein: true })
    expect(matched.gramsPerWeek).toBe(900)
    expect(matched.packsPerWeek).toBe(5)
    expect(matched.proteinPerWeek).toBe(matched.paneerProteinPerWeek)
    expect(matched.kcalSaved).toBeGreaterThan(0)
    // More tofu means a smaller calorie saving than the 1:1 swap — not a larger one.
    expect(matched.kcalSaved).toBeLessThan(half.kcalSaved)
  })

  it('never returns zero packs for a household that wants any tofu', () => {
    expect(calculateSwap({ paneerGramsPerWeek: 250, swapShare: 0.25, matchProtein: false }).packsPerWeek).toBe(1)
  })
})

describe('plan mode', () => {
  // Two adults, a 14-year-old and an 8-year-old, all four of whom eat tofu:
  // gravy twice a week, bhurji once, quick add-ons twice.
  const family = calculatePlan({
    adults: 2,
    teens: 1,
    kids10to12: 0,
    kids4to9: 1,
    trainingAdults: 0,
    meals: { gravy: 2, bhurji: 1, grill: 0, addon: 2 },
  })

  it('weights eaters instead of counting heads', () => {
    // 1.0 + 1.0 + 0.85 + 0.45 = 3.3 adult-equivalents, not 4 people.
    // (2*60 + 1*75 + 2*50) * 3.3 = 973.5 g cooked, / 0.88 = 1106 g raw.
    expect(family.gramsPerWeek).toBe(1106)
    expect(family.packsPerWeek).toBe(6)
  })

  it('splits anything over 5 packs across two deliveries', () => {
    expect(family.deliveries).toBe(2)
    expect(family.packsPerDrop).toBe(3)
    expect(family.plan.id).toBe('daily')
  })

  it('nudges a first-timer to start smaller', () => {
    expect(family.startSmallerPacks).toBe(4)
    const returning = calculatePlan({
      adults: 2, teens: 1, kids10to12: 0, kids4to9: 1, trainingAdults: 0,
      meals: { gravy: 2, bhurji: 1, grill: 0, addon: 2 },
      isNewCustomer: false,
    })
    expect(returning.startSmallerPacks).toBeNull()
  })

  it('gives the training bonus on personal plates only, never on a shared gravy', () => {
    const base = { adults: 2, teens: 0, kids10to12: 0, kids4to9: 0, trainingAdults: 1 }
    const gravyOnly = calculatePlan({ ...base, meals: { gravy: 3, bhurji: 0, grill: 0, addon: 0 } })
    const noTrainer = calculatePlan({ ...base, trainingAdults: 0, meals: { gravy: 3, bhurji: 0, grill: 0, addon: 0 } })
    expect(gravyOnly.gramsPerWeek).toBe(noTrainer.gramsPerWeek)

    const grillOnly = calculatePlan({ ...base, meals: { gravy: 0, bhurji: 0, grill: 3, addon: 0 } })
    const grillNoTrainer = calculatePlan({ ...base, trainingAdults: 0, meals: { gravy: 0, bhurji: 0, grill: 3, addon: 0 } })
    expect(grillOnly.gramsPerWeek).toBeGreaterThan(grillNoTrainer.gramsPerWeek)
  })

  it('a child is not a small adult', () => {
    const twoAdults = calculatePlan({ adults: 2, teens: 0, kids10to12: 0, kids4to9: 0, trainingAdults: 0, meals: { gravy: 3, bhurji: 0, grill: 0, addon: 0 } })
    const adultPlusChild = calculatePlan({ adults: 1, teens: 0, kids10to12: 0, kids4to9: 1, trainingAdults: 0, meals: { gravy: 3, bhurji: 0, grill: 0, addon: 0 } })
    expect(adultPlusChild.gramsPerWeek).toBeLessThan(twoAdults.gramsPerWeek)
  })

  it('cannot be gamed by claiming more trainers than adults', () => {
    const sane = calculatePlan({ adults: 1, teens: 0, kids10to12: 0, kids4to9: 0, trainingAdults: 1, meals: { gravy: 0, bhurji: 0, grill: 4, addon: 0 } })
    const absurd = calculatePlan({ adults: 1, teens: 0, kids10to12: 0, kids4to9: 0, trainingAdults: 9, meals: { gravy: 0, bhurji: 0, grill: 4, addon: 0 } })
    expect(absurd.gramsPerWeek).toBe(sane.gramsPerWeek)
  })
})

describe('household protein context', () => {
  it('reports tofu as a modest share of the household need, not the whole of it', () => {
    const daily = householdDailyProtein({
      adults: 2, avgAdultWeightKg: 64, activity: 'desk', kids4to9: 1, kids10to12: 0, teens: 1,
    })
    expect(daily).toBe(174)

    const family = calculatePlan({
      adults: 2, teens: 1, kids10to12: 0, kids4to9: 1, trainingAdults: 0,
      meals: { gravy: 2, bhurji: 1, grill: 0, addon: 2 },
    })
    // ~9%. Dal, roti and curd are the backbone of an Indian household's protein
    // and tofu never will be. The UI prints this number as-is.
    expect(proteinSharePct(family, daily)).toBe(9)
  })
})

describe('pack and delivery rules', () => {
  it('rounds to the nearest pack rather than up', () => {
    expect(packsFromGrams(500)).toBe(3)  // 2.5 -> 3
    expect(packsFromGrams(480)).toBe(2)  // 2.4 -> 2, not 3
    expect(packsFromGrams(1106)).toBe(6) // 5.53 -> 6
  })

  it('keeps a single drop under the five-day shelf life', () => {
    expect(deliverySplit(5)).toEqual({ deliveries: 1, perDrop: 5 })
    expect(deliverySplit(6)).toEqual({ deliveries: 2, perDrop: 3 })
    expect(deliverySplit(10)).toEqual({ deliveries: 2, perDrop: 5 })
  })

  it('lands on the cheapest plan that covers the packs', () => {
    expect(planForPacks(1).id).toBe('weekender')
    expect(planForPacks(4).id).toBe('thrice')
    expect(planForPacks(5).id).toBe('daily')
    expect(planForPacks(99).id).toBe('parivaar')
  })
})
