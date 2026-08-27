'use client'

import { useMemo, useRef, useState } from 'react'
import {
  calculatePlan,
  calculateSwap,
  householdDailyProtein,
  proteinSharePct,
  type Dish,
} from '@/lib/calculator'
import { PLANS } from '@/lib/plans'
import { track } from '@/lib/attribution'
import { Button, Card } from './ui'

type Mode = 'swap' | 'plan'

const CHIP = 'min-h-[44px] rounded border px-3 text-sm font-medium'
const on = 'border-accent bg-accent text-white'
const off = 'border-line bg-surface text-ink'

function Stepper({ label, value, onChange, max = 8 }: { label: string; value: number; onChange: (n: number) => void; max?: number }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-sm">{label}</span>
      <span className="flex items-center gap-1">
        <button type="button" aria-label={`Fewer ${label}`} onClick={() => onChange(Math.max(0, value - 1))} className="h-11 w-11 rounded border border-line text-lg">
          −
        </button>
        <span className="w-8 text-center font-mono tabular-nums">{value}</span>
        <button type="button" aria-label={`More ${label}`} onClick={() => onChange(Math.min(max, value + 1))} className="h-11 w-11 rounded border border-line text-lg">
          +
        </button>
      </span>
    </div>
  )
}

export interface CalculatorOutcome {
  mode: Mode
  packsPerWeek: number
  planId: string
  kcalSaved: number
}

/**
 * The most important screen on the site. Two modes, because the two realistic
 * ways to answer "how much do I need?" are completely different questions:
 * either you already buy paneer and this is a substitution, or you don't and
 * we have to model your week. Neither one is people x meals x 100 g.
 */
export function Calculator({ onResult }: { onResult?: (o: CalculatorOutcome) => void }) {
  const [mode, setMode] = useState<Mode>('swap')
  const started = useRef(false)

  const [paneer, setPaneer] = useState(1000)
  const [share, setShare] = useState(0.5)
  const [matchProtein, setMatchProtein] = useState(false)

  const [adults, setAdults] = useState(2)
  const [teens, setTeens] = useState(0)
  const [kids10to12, setKids10to12] = useState(0)
  const [kids4to9, setKids4to9] = useState(0)
  const [trainingAdults, setTrainingAdults] = useState(0)
  const [meals, setMeals] = useState<Record<Dish, number>>({ gravy: 2, bhurji: 1, grill: 0, addon: 0 })

  function begin() {
    if (started.current) return
    started.current = true
    track('calculator_started', { mode })
  }

  const swap = useMemo(
    () => calculateSwap({ paneerGramsPerWeek: paneer, swapShare: share, matchProtein }),
    [paneer, share, matchProtein],
  )
  const plan = useMemo(
    () => calculatePlan({ adults, teens, kids10to12, kids4to9, trainingAdults, meals }),
    [adults, teens, kids10to12, kids4to9, trainingAdults, meals],
  )
  const result = mode === 'swap' ? swap : plan

  const dailyNeed = useMemo(
    () =>
      householdDailyProtein({
        adults: mode === 'swap' ? 2 : adults,
        avgAdultWeightKg: 65,
        activity: 'desk',
        kids4to9: mode === 'swap' ? 0 : kids4to9,
        kids10to12: mode === 'swap' ? 0 : kids10to12,
        teens: mode === 'swap' ? 0 : teens,
      }),
    [mode, adults, teens, kids10to12, kids4to9],
  )

  const shareText =
    `Maharaja Tofu: humein hafte mein ${result.packsPerWeek} pack chahiye. ` +
    `Isse ${result.kcalSaved.toLocaleString('en-IN')} calories bachengi — wahi sabzi, aadhi calories. maharajatofu.com`

  return (
    <div className="space-y-5" onFocusCapture={begin} onPointerDown={begin}>
      <div role="tablist" aria-label="Calculator mode" className="grid grid-cols-2 gap-2">
        {(['swap', 'plan'] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`${CHIP} ${mode === m ? on : off}`}
          >
            {m === 'swap' ? 'Swap my paneer' : 'Plan my week'}
          </button>
        ))}
      </div>

      {mode === 'swap' ? (
        <Card className="space-y-4">
          <p className="text-sm text-muted">
            The most realistic thing to go on is what you already buy.
          </p>
          <div>
            <label htmlFor="paneer" className="block text-sm font-semibold">
              Paneer your house buys in a week:{' '}
              <span className="font-mono tabular-nums">{paneer} g</span>
            </label>
            <input
              id="paneer"
              type="range"
              min={250}
              max={3000}
              step={250}
              value={paneer}
              onChange={(e) => setPaneer(Number(e.target.value))}
              className="mt-2 w-full accent-[var(--c-accent)]"
            />
          </div>
          <div>
            <span className="block text-sm font-semibold">How much of it to swap?</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[0.25, 0.5, 1].map((s) => (
                <button key={s} onClick={() => setShare(s)} className={`${CHIP} ${share === s ? on : off}`}>
                  {s * 100}%
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-sm text-muted">Most people start at half. Nobody drops paneer entirely.</p>
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={matchProtein}
              onChange={(e) => setMatchProtein(e.target.checked)}
              className="mt-1 h-5 w-5 accent-[var(--c-accent)]"
            />
            <span>
              Match my protein exactly
              <span className="block text-muted">
                A 1:1 swap gives less protein than paneer. This scales it up so it doesn&rsquo;t — and it still cuts calories.
              </span>
            </span>
          </label>
        </Card>
      ) : (
        <Card className="space-y-4">
          <div>
            <p className="text-sm font-semibold">Who will actually eat the tofu?</p>
            <p className="text-sm text-muted">
              Count only the people who&rsquo;ll really eat it — in most houses at least one person won&rsquo;t touch it in week one.
            </p>
            <div className="mt-2 divide-y divide-line">
              <Stepper label="Adults" value={adults} onChange={setAdults} />
              <Stepper label="Teenagers (13–17)" value={teens} onChange={setTeens} />
              <Stepper label="Children (10–12)" value={kids10to12} onChange={setKids10to12} />
              <Stepper label="Children (4–9)" value={kids4to9} onChange={setKids4to9} />
              <Stepper label="Of the adults, how many train 4+ days a week?" value={trainingAdults} onChange={setTrainingAdults} max={adults} />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold">How will you cook it, in a week?</p>
            {(
              [
                ['gravy', 'Sabzi or gravy (shared)'],
                ['bhurji', 'Bhurji or scramble'],
                ['grill', 'Tikka, grilled or a snack plate'],
                ['addon', 'Quick add-on — Maggi, roll, salad'],
              ] as const
            ).map(([dish, label]) => (
              <Stepper
                key={dish}
                label={label}
                value={meals[dish]}
                onChange={(n) => setMeals((m) => ({ ...m, [dish]: n }))}
                max={7}
              />
            ))}
          </div>
        </Card>
      )}

      {/* ---- result ---- */}
      <Card className="space-y-4 border-accent">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">You need</p>
          <p className="font-display text-3xl font-semibold">
            {result.packsPerWeek} {result.packsPerWeek === 1 ? 'pack' : 'packs'} a week
          </p>
          <p className="text-sm text-muted">
            {result.deliveries === 1
              ? 'One delivery — Tuesday.'
              : `Two deliveries — ${result.packsPerDrop} on Tuesday, ${result.packsPerWeek - result.packsPerDrop} on Friday.`}{' '}
            {result.deliveries === 2 && 'Fresh tofu keeps about five days, so we split it rather than dropping a week at once.'}
          </p>
        </div>

        <div className="border-t border-line pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">And it saves you</p>
          <p className="font-display text-4xl font-semibold text-plant tabular-nums">
            {result.kcalSaved.toLocaleString('en-IN')} calories
          </p>
          <p className="text-sm text-muted">
            every week, versus the same paneer — plus {result.satFatSavedGrams} g of saturated fat, and zero cholesterol.
            Nothing about your cooking changes.
          </p>
        </div>

        <div className="border-t border-line pt-4 text-sm">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">The protein, honestly</p>
          <p className="mt-1">
            {result.proteinPerWeek} g of protein a week — about {proteinSharePct(result, dailyNeed)}% of what your
            household needs.{' '}
            {mode === 'swap' && !matchProtein && (
              <>
                The paneer you&rsquo;re replacing would have given {swap.paneerProteinPerWeek} g. Tick &ldquo;match my
                protein&rdquo; above to close that gap.
              </>
            )}
          </p>
          <p className="mt-2 text-muted">
            Dal, roti and curd are the backbone of an Indian household&rsquo;s protein, and tofu never will be. What it
            changes is the calories.
          </p>
        </div>

        {result.startSmallerPacks && (
          <div className="border-t border-line pt-4 text-sm">
            <p className="font-semibold">Start with {result.startSmallerPacks} packs for the first two weeks.</p>
            <p className="text-muted">
              Almost everyone over-orders in week one and throws some away. Move up once you know your rhythm.
            </p>
          </div>
        )}

        <div className="border-t border-line pt-4 text-sm">
          <p>
            Roughly <span className="font-mono tabular-nums">₹{result.tofuCostPerWeek}</span> of tofu a week, against{' '}
            <span className="font-mono tabular-nums">₹{result.paneerCostPerWeek}</span> of the paneer it replaces.
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-line pt-4 sm:flex-row">
          <Button
            onClick={() => {
              track('calculator_completed', { mode, packs: result.packsPerWeek, plan: result.plan.id })
              track('plan_selected', { plan: result.plan.id })
              onResult?.({ mode, packsPerWeek: result.packsPerWeek, planId: result.plan.id, kcalSaved: result.kcalSaved })
            }}
            className="flex-1"
          >
            {result.plan.name} plan · ₹{result.plan.pricePerWeek}/week
          </Button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded border border-line px-4 text-sm font-semibold"
          >
            Share on WhatsApp
          </a>
        </div>
        <p className="text-xs text-muted">
          Protein needs follow ICMR-NIN RDA 2020 (0.83 g per kg of body weight a day for an adult).{' '}
          {PLANS.length} plans, pause or cancel any week.
        </p>
      </Card>
    </div>
  )
}
