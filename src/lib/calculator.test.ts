import { describe, expect, it } from 'vitest'
import { calcSwap, calcWeek, noEaters, PACK_G } from './calculator'
import { planByPacks } from '@/content'

/**
 * The test table from design_handoff_maharaja_tofu/CALCULATOR_SPEC.md, case for
 * case. The maths is the product — these are the cases the spec asks be covered
 * at minimum, so a change that breaks one is a change to the product.
 */
describe('CALCULATOR_SPEC test table', () => {
  it('default swap: 1000 g, 50%, match off', () => {
    const r = calcSwap(1000, 50, false)
    expect(r.packs).toBe(3)
    expect(r.kcalSaved).toBe(869)
    expect(r.tofuProt).toBe(60)
    expect(r.paneerProt).toBe(90)
    expect(r.split).toBe(false)
    expect(r.plan.name).toBe('Chhota Plan')
  })

  it('rounds down, never up: 1000 g, 25%, match off', () => {
    // 250 g is 1.25 packs, which rounds to 1 rather than being pushed to 2.
    expect(calcSwap(1000, 25, false).packs).toBe(1)
  })

  it('matched protein: 1000 g, 50%, match on', () => {
    const r = calcSwap(1000, 50, true)
    expect(r.actualG).toBe(1000)
    expect(r.packs).toBe(5)
    expect(r.tofuProt).toBe(100)
    expect(r.paneerProt).toBe(90)
    expect(r.split).toBe(false) // 5 is not > 5
  })

  it('full swap, matched: 2000 g, 100%, match on', () => {
    const r = calcSwap(2000, 100, true)
    expect(r.packs).toBe(18)
    expect(r.split).toBe(true)
    expect(r.tue).toBe(9)
    expect(r.fri).toBe(9)
  })

  it('minimum: 250 g, 25%, match off floors at one pack', () => {
    expect(calcSwap(250, 25, false).packs).toBe(1)
  })

  it('week, default household', () => {
    // w = 2.7; shared 324; personal 634.5; x1.12 = 1073.6 -> 5 packs
    const r = calcWeek({ adult: 2, teen: 0, c1012: 1, c49: 0 }, { gravy: 2, bhurji: 1, tikka: 1, addon: 1 }, false)
    expect(r.packs).toBe(5)
    expect(r.nudge).toBe(true)
    expect(r.split).toBe(false)
  })

  it('gym bonus is personal-only', () => {
    const r = calcWeek({ adult: 2, teen: 0, c1012: 1, c49: 0 }, { gravy: 2, bhurji: 1, tikka: 1, addon: 1 }, true)
    expect(r.packs).toBe(7)
    expect(r.split).toBe(true)
    expect(r.tue).toBe(4)
    expect(r.fri).toBe(3)
  })

  it('nobody eats it: floors at one pack, and the UI is told to ask first', () => {
    const eaters = { adult: 0, teen: 0, c1012: 0, c49: 0 }
    expect(calcWeek(eaters, { gravy: 2, bhurji: 1, tikka: 1, addon: 1 }, false).packs).toBe(1)
    expect(noEaters(eaters)).toBe(true)
  })
})

describe('the invariants the spec asks be covered', () => {
  it('rounds to nearest in both directions', () => {
    expect(calcSwap(1000, 50, false).packs).toBe(3) // 2.5 -> 3
    expect(calcSwap(960, 50, false).packs).toBe(2) // 2.4 -> 2
  })

  it('never returns zero packs', () => {
    expect(calcSwap(250, 25, false).packs).toBeGreaterThanOrEqual(1)
    expect(calcWeek({ adult: 0, teen: 0, c1012: 0, c49: 0 }, { gravy: 0, bhurji: 0, tikka: 0, addon: 0 }, false).packs).toBe(1)
  })

  it('splits above five packs and the halves always sum back', () => {
    for (let packs = 1; packs <= 20; packs++) {
      const r = calcSwap(packs * PACK_G, 100, false)
      expect(r.split).toBe(r.packs > 5)
      expect(r.tue + r.fri).toBe(r.packs)
      expect(r.tue).toBeGreaterThanOrEqual(r.fri)
    }
  })

  it('the gym bonus never touches the shared gravy', () => {
    const eaters = { adult: 2, teen: 0, c1012: 0, c49: 0 }
    const gravyOnly = { gravy: 3, bhurji: 0, tikka: 0, addon: 0 }
    expect(calcWeek(eaters, gravyOnly, true).actualG).toBe(calcWeek(eaters, gravyOnly, false).actualG)

    const tikkaOnly = { gravy: 0, bhurji: 0, tikka: 3, addon: 0 }
    expect(calcWeek(eaters, tikkaOnly, true).actualG).toBeGreaterThan(calcWeek(eaters, tikkaOnly, false).actualG)
  })

  it('kcalSaved never goes negative', () => {
    // Matching protein on a tiny basket buys more tofu than the paneer it
    // replaces — the saving floors at zero rather than reading as a penalty.
    for (const pct of [25, 50, 100] as const) {
      for (const g of [250, 500, 1000, 3000]) {
        expect(calcSwap(g, pct, true).kcalSaved).toBeGreaterThanOrEqual(0)
        expect(calcSwap(g, pct, false).kcalSaved).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('a child is not a small adult', () => {
    const dishes = { gravy: 3, bhurji: 0, tikka: 0, addon: 0 }
    const twoAdults = calcWeek({ adult: 2, teen: 0, c1012: 0, c49: 0 }, dishes, false)
    const adultAndChild = calcWeek({ adult: 1, teen: 0, c1012: 0, c49: 1 }, dishes, false)
    expect(adultAndChild.actualG).toBeLessThan(twoAdults.actualG)
  })

  it('the nudge floors at two packs so it can never suggest less than a plan', () => {
    expect(calcSwap(1000, 50, false).nudgePacks).toBeGreaterThanOrEqual(2)
    expect(calcSwap(2000, 100, true).nudgePacks).toBe(16)
  })
})

describe('plan tiers', () => {
  it('offers the largest tier already covered, not the next one up', () => {
    // Three packs gets Chhota (two), not Ghar (four). A plan is a floor people
    // top up from — selling more perishable food than asked ends in waste.
    expect(planByPacks(1).name).toBe('Chhota Plan')
    expect(planByPacks(3).name).toBe('Chhota Plan')
    expect(planByPacks(4).name).toBe('Ghar Plan')
    expect(planByPacks(9).name).toBe('Bada Plan')
    expect(planByPacks(99).name).toBe('Gym / Cloud Kitchen')
  })
})
