import { describe, expect, it } from 'vitest'
import { calculatePlan, calculateSwap, householdDailyProtein, proteinSharePct } from './calculator'
import { packsFromGrams, deliverySplit, planForPacks } from './plans'

describe('swap mode', () => {
  // A household buying 1 kg of paneer a week swaps half of it.
  const half = calculateSwap({ paneerGramsPerWeek: 1000, swapShare: 0.5, matchProtein: false })

  it('turns 500 g into 3 packs, one delivery', () => {
    expect(half.tofuGrams).toBe(500)
    expect(half.packsPerWeek).toBe(3)
    expect(half.actualGrams).toBe(600)
    expect(half.deliveries).toBe(1)
  })

  it('offers the largest plan already covered, not the next one up', () => {
    // Three packs gets Chhota (two), not Ghar (four). A plan is a floor people
    // top up from — selling more perishable food than asked for ends in waste.
    expect(half.plan.id).toBe('chhota')
  })

  it('computes savings from what actually lands in the fridge', () => {
    // 500 g paneer at 2.65 kcal/g, less the 600 g of tofu actually delivered.
    expect(half.kcalSaved).toBe(869)
    expect(half.kcalSavedFourWeeks).toBe(3476)
    expect(half.satFatSavedGrams).toBe(18.5)
  })

  it('states the protein trade-off rather than hiding it', () => {
    expect(half.tofuProtein).toBe(60)
    expect(half.paneerProtein).toBe(90)
    expect(half.tofuProtein).toBeLessThan(half.paneerProtein)
  })

  it('matches the protein when asked, and still saves calories', () => {
    const matched = calculateSwap({ paneerGramsPerWeek: 1000, swapShare: 0.5, matchProtein: true })
    expect(matched.tofuGrams).toBe(900)
    expect(matched.packsPerWeek).toBe(5)
    expect(matched.tofuProtein).toBeGreaterThanOrEqual(matched.paneerProtein)
    expect(matched.kcalSaved).toBeGreaterThan(0)
    // More tofu means a smaller calorie saving than the 1:1 swap, not a larger one.
    expect(matched.kcalSaved).toBeLessThan(half.kcalSaved)
  })

  it('never quotes a negative saving', () => {
    const all = calculateSwap({ paneerGramsPerWeek: 250, swapShare: 0.25, matchProtein: true })
    expect(all.kcalSaved).toBeGreaterThanOrEqual(0)
    expect(all.satFatSavedGrams).toBeGreaterThanOrEqual(0)
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
    trains: false,
    meals: { gravy: 2, bhurji: 1, tikka: 0, addon: 2 },
  })

  it('weights eaters instead of counting heads', () => {
    // 1.0 + 1.0 + 0.85 + 0.45 = 3.3 adult-equivalents, not 4 people.
    // shared 60*3.3*2 = 396; personal (75*1 + 50*2)*3.3 = 577.5; x1.12 = 1090 g.
    expect(family.tofuGrams).toBe(1090)
    expect(family.packsPerWeek).toBe(5)
  })

  it('splits anything over five packs across two deliveries', () => {
    expect(family.deliveries).toBe(1)
    const big = calculatePlan({
      adults: 4, teens: 0, kids10to12: 0, kids4to9: 0, trains: false,
      meals: { gravy: 4, bhurji: 1, tikka: 1, addon: 2 },
    })
    expect(big.split).toBe(true)
    expect(big.tue + big.fri).toBe(big.packsPerWeek)
    expect(big.tue).toBeGreaterThanOrEqual(big.fri)
  })

  it('nudges a first-timer two packs lower once the basket is large', () => {
    // Nudges above four packs, so this five-pack basket gets one.
    expect(family.packsPerWeek).toBe(5)
    expect(family.nudgePacks).toBe(3)

    const small = calculatePlan({
      adults: 2, teens: 0, kids10to12: 0, kids4to9: 0, trains: false,
      meals: { gravy: 2, bhurji: 0, tikka: 0, addon: 0 },
    })
    expect(small.packsPerWeek).toBeLessThanOrEqual(4)
    expect(small.nudgePacks).toBeNull()
  })

  it('gives the gym bonus on personal plates only, never on a shared gravy', () => {
    const base = { adults: 2, teens: 0, kids10to12: 0, kids4to9: 0 }
    const gravyTrains = calculatePlan({ ...base, trains: true, meals: { gravy: 3, bhurji: 0, tikka: 0, addon: 0 } })
    const gravyPlain = calculatePlan({ ...base, trains: false, meals: { gravy: 3, bhurji: 0, tikka: 0, addon: 0 } })
    expect(gravyTrains.tofuGrams).toBe(gravyPlain.tofuGrams)

    const tikkaTrains = calculatePlan({ ...base, trains: true, meals: { gravy: 0, bhurji: 0, tikka: 3, addon: 0 } })
    const tikkaPlain = calculatePlan({ ...base, trains: false, meals: { gravy: 0, bhurji: 0, tikka: 3, addon: 0 } })
    expect(tikkaTrains.tofuGrams).toBeGreaterThan(tikkaPlain.tofuGrams)
  })

  it('a child is not a small adult', () => {
    const twoAdults = calculatePlan({ adults: 2, teens: 0, kids10to12: 0, kids4to9: 0, trains: false, meals: { gravy: 3, bhurji: 0, tikka: 0, addon: 0 } })
    const adultPlusChild = calculatePlan({ adults: 1, teens: 0, kids10to12: 0, kids4to9: 1, trains: false, meals: { gravy: 3, bhurji: 0, tikka: 0, addon: 0 } })
    expect(adultPlusChild.tofuGrams).toBeLessThan(twoAdults.tofuGrams)
  })

  it('compares against the same dishes cooked with paneer', () => {
    // Paneer is not pressed, so the comparison is taken before prep loss.
    expect(family.paneerProtein).toBe(Math.round(((396 + 577.5) * 18) / 100))
  })
})

describe('household protein context', () => {
  it('reports tofu as a modest share of the household need, not the whole of it', () => {
    const daily = householdDailyProtein({
      adults: 2, avgAdultWeightKg: 64, activity: 'desk', kids4to9: 1, kids10to12: 0, teens: 1,
    })
    expect(daily).toBe(174)

    const family = calculatePlan({
      adults: 2, teens: 1, kids10to12: 0, kids4to9: 1, trains: false,
      meals: { gravy: 2, bhurji: 1, tikka: 0, addon: 2 },
    })
    // Dal, roti and curd are the backbone of an Indian household's protein and
    // tofu never will be. The UI prints this number as-is.
    expect(proteinSharePct(family, daily)).toBeLessThan(15)
  })
})

describe('pack and delivery rules', () => {
  it('rounds to the nearest pack rather than up', () => {
    expect(packsFromGrams(500)).toBe(3) // 2.5 -> 3
    expect(packsFromGrams(480)).toBe(2) // 2.4 -> 2, not 3
    expect(packsFromGrams(10)).toBe(1) // never zero
  })

  it('keeps a single drop inside the five-day shelf life', () => {
    expect(deliverySplit(5)).toEqual({ deliveries: 1, tue: 5, fri: 0 })
    expect(deliverySplit(6)).toEqual({ deliveries: 2, tue: 3, fri: 3 })
    expect(deliverySplit(7)).toEqual({ deliveries: 2, tue: 4, fri: 3 })
    expect(deliverySplit(10)).toEqual({ deliveries: 2, tue: 5, fri: 5 })
  })

  it('picks the largest plan already covered', () => {
    expect(planForPacks(1).id).toBe('chhota')
    expect(planForPacks(3).id).toBe('chhota')
    expect(planForPacks(4).id).toBe('ghar')
    expect(planForPacks(9).id).toBe('bada')
    expect(planForPacks(99).id).toBe('gym')
  })
})
