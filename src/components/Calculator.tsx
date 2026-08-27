'use client'

import { useMemo } from 'react'
import { calcSwap, calcWeek, noEaters, type Dishes, type Eaters } from '@/lib/calculator'
import { comparison } from '@/content'
import { scrollToId, usePilot, type Pct } from '@/lib/store'
import { Eyebrow, HeadingHi, Meta, Num } from './ui'

const TAB = 'h-[46px] flex-1 font-headline text-[15px] font-extrabold'
const CHIP_ON = 'border-2 border-indigo bg-indigo text-cream'
const CHIP_OFF = 'border-2 border-indigo bg-transparent text-indigo'

function Stepper({
  label,
  value,
  onChange,
  max = 9,
  tone = 'light',
}: {
  label: string
  value: number
  onChange: (n: number) => void
  max?: number
  tone?: 'light' | 'dark'
}) {
  const border = tone === 'dark' ? 'border-cream/40 text-cream' : 'border-indigo text-indigo'
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className={`text-body-sm ${tone === 'dark' ? 'text-cream' : 'text-slate'}`}>{label}</span>
      <span className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`${label} — kam`}
          onClick={() => onChange(Math.max(0, value - 1))}
          className={`h-target w-target border-2 text-[20px] leading-none ${border}`}
        >
          −
        </button>
        <span className={`w-8 text-center font-mono text-[17px] tabular-nums ${tone === 'dark' ? 'text-cream' : 'text-ink'}`}>
          {value}
        </span>
        <button
          type="button"
          aria-label={`${label} — zyada`}
          onClick={() => onChange(Math.min(max, value + 1))}
          className={`h-target w-target border-2 text-[20px] leading-none ${border}`}
        >
          +
        </button>
      </span>
    </div>
  )
}

/**
 * The calculator. Two modes, because the two realistic ways to answer "how much
 * do I need?" are different questions: either you already buy paneer and this is
 * a substitution, or you do not and we have to model the week dish by dish.
 *
 * The slider updates the result synchronously — no debounce. The numbers should
 * move under the thumb.
 */
export function Calculator({ standalone = false }: { standalone?: boolean }) {
  const { state, set } = usePilot()
  const { mode, paneerG, pct, match, eaters, dishes, trains } = state

  const result = useMemo(
    () => (mode === 'swap' ? calcSwap(paneerG, pct, match) : calcWeek(eaters, dishes, trains)),
    [mode, paneerG, pct, match, eaters, dishes, trains],
  )
  const empty = mode === 'week' && noEaters(eaters)

  const setEaters = (patch: Partial<Eaters>) => set({ eaters: { ...eaters, ...patch } })
  const setDishes = (patch: Partial<Dishes>) => set({ dishes: { ...dishes, ...patch } })

  const shareText = `${result.packs} packs/week — Tue ${result.tue}${result.fri ? `, Fri ${result.fri}` : ''}. Wahi sabzi, ${result.kcalSaved.toLocaleString('en-IN')} kcal kam. Maharaja Tofu, Ghaziabad — maharajatofu.com`

  return (
    <div className="grid gap-4 md:grid-cols-2 md:items-start">
      <div className="space-y-4">
        {/* Tabs */}
        <div role="tablist" aria-label="Calculator mode" className="flex border-2 border-indigo">
          <button
            role="tab"
            aria-selected={mode === 'swap'}
            onClick={() => set({ mode: 'swap' })}
            className={`${TAB} ${mode === 'swap' ? 'bg-indigo text-cream' : 'bg-transparent text-indigo'}`}
          >
            Paneer swap करें
          </button>
          <button
            role="tab"
            aria-selected={mode === 'week'}
            onClick={() => set({ mode: 'week' })}
            className={`${TAB} ${mode === 'week' ? 'bg-indigo text-cream' : 'bg-transparent text-indigo'}`}
          >
            हफ़्ते का plan
          </button>
        </div>

        {/* Inputs — cream panel */}
        <div className="bg-cream p-4">
          {mode === 'swap' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="paneerG" className="block text-body-sm text-slate">
                  हफ़्ते में कितना पनीर आता है?
                </label>
                <p className="mt-1 font-display text-[28px] leading-none text-indigo">
                  <Num>{paneerG}</Num>
                  <span className="font-mono text-[13px]"> G</span>
                </p>
                <input
                  id="paneerG"
                  type="range"
                  min={250}
                  max={3000}
                  step={250}
                  value={paneerG}
                  onChange={(e) => set({ paneerG: Number(e.target.value) })}
                  className="mt-2 h-target w-full accent-[var(--c-vermilion)]"
                />
                <Meta className="text-grey-warm">250 G — 3 KG</Meta>
              </div>

              <div>
                <span className="block text-body-sm text-slate">कितना बदलना है?</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {([25, 50, 100] as Pct[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => set({ pct: p })}
                      className={`h-chip font-headline text-[15px] font-bold ${pct === p ? CHIP_ON : CHIP_OFF}`}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-body-sm text-grey-warm-dark">
                  Most people start at half. Nobody drops paneer entirely.
                </p>
              </div>

              <label className="flex min-h-target cursor-pointer items-start gap-3 text-body-sm">
                <input
                  type="checkbox"
                  checked={match}
                  onChange={(e) => set({ match: e.target.checked })}
                  className="mt-0.5 h-6 w-6 shrink-0 accent-[var(--c-green)]"
                />
                <span className="text-slate">
                  <span className="font-semibold">Match my protein exactly</span>
                  <span className="block text-grey-warm-dark">
                    A 1:1 swap carries less protein than the paneer it replaces. This sends 1.8× the weight so it does
                    not — and it still cuts calories.
                  </span>
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-body-sm font-semibold text-slate">कौन खाएगा?</p>
                <p className="text-body-sm text-grey-warm-dark">
                  Count only the people who will actually eat it — in most houses one person won&rsquo;t touch it in
                  week one, and an honest count gives an honest basket.
                </p>
                <div className="mt-2 divide-y divide-stone">
                  <Stepper label="Adults" value={eaters.adult} onChange={(n) => setEaters({ adult: n })} />
                  <Stepper label="Teenagers (13–19)" value={eaters.teen} onChange={(n) => setEaters({ teen: n })} />
                  <Stepper label="Children (10–12)" value={eaters.c1012} onChange={(n) => setEaters({ c1012: n })} />
                  <Stepper label="Children (4–9)" value={eaters.c49} onChange={(n) => setEaters({ c49: n })} />
                </div>
              </div>

              <div>
                <p className="text-body-sm font-semibold text-slate">हफ़्ते में कैसे बनेगा?</p>
                <div className="mt-2 divide-y divide-stone">
                  <Stepper label="सब्ज़ी / gravy (shared)" value={dishes.gravy} onChange={(n) => setDishes({ gravy: n })} max={7} />
                  <Stepper label="भुर्जी / scramble" value={dishes.bhurji} onChange={(n) => setDishes({ bhurji: n })} max={7} />
                  <Stepper label="टिक्का / grilled plate" value={dishes.tikka} onChange={(n) => setDishes({ tikka: n })} max={7} />
                  <Stepper label="Roll, Maggi, salad" value={dishes.addon} onChange={(n) => setDishes({ addon: n })} max={7} />
                </div>
              </div>

              <label className="flex min-h-target cursor-pointer items-start gap-3 text-body-sm">
                <input
                  type="checkbox"
                  checked={trains}
                  onChange={(e) => set({ trains: e.target.checked })}
                  className="mt-0.5 h-6 w-6 shrink-0 accent-[var(--c-green)]"
                />
                <span className="text-slate">
                  <span className="font-semibold">कोई हफ़्ते में 4+ दिन gym जाता है</span>
                  <span className="block text-grey-warm-dark">
                    Adds to grilled and snack plates only. Nobody gets a bigger share of the sabzi everyone is eating
                    out of the same pan.
                  </span>
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Result — indigo card */}
      <div className="bg-indigo p-5 text-cream md:sticky md:top-20">
        {empty ? (
          <div className="py-8">
            <HeadingHi size="sm">कौन खाएगा?</HeadingHi>
            <p className="mt-2 text-body text-cream/70">
              Add at least one person above and we&rsquo;ll work out the week.
            </p>
          </div>
        ) : (
          <>
            <Eyebrow tone="cream">आपको चाहिए</Eyebrow>
            <p className="mt-1 font-display text-num-lg leading-none text-cream">
              <Num>{result.packs}</Num>
              <span className="ml-2 font-mono text-[14px] tracking-[0.12em]">{result.packs === 1 ? 'PACK' : 'PACKS'} / WEEK</span>
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="border-2 border-cream/40 p-3">
                <Meta className="text-cream/60">TUE</Meta>
                <p className="font-display text-[26px] text-cream">
                  <Num>{result.tue}</Num>
                </p>
              </div>
              <div className={`border-2 p-3 ${result.split ? 'border-cream/40' : 'border-cream/15'}`}>
                <Meta className="text-cream/60">FRI</Meta>
                <p className={`font-display text-[26px] ${result.split ? 'text-cream' : 'text-cream/30'}`}>
                  <Num>{result.fri}</Num>
                </p>
              </div>
            </div>

            {result.split && (
              <p className="mt-2 text-body-sm text-cream/70">
                Fresh tofu keeps about 5 days, so {result.packs} packs come in two drops — that is exactly why we
                deliver Tuesday and Friday.
              </p>
            )}

            {/* The calories block — marigold, the largest thing on the screen.
                Deliberately not animated: a count-up would undercut the honesty
                this whole card is built on. */}
            <div className="mt-4 bg-marigold p-4 text-ink">
              <Eyebrow tone="grey">इतनी कैलोरी बचेंगी</Eyebrow>
              <p className="mt-1 font-display text-num leading-none">
                <Num>{result.kcalSaved.toLocaleString('en-IN')}</Num>
              </p>
              <Meta className="mt-1 text-ink/70">
                PER WEEK · OVER 4 WEEKS {result.kcalSavedFourWeeks.toLocaleString('en-IN')} KCAL
              </Meta>
            </div>

            {/* The honest protein line — required copy, including the admission. */}
            <div className="mt-4 border-2 border-cream/30 p-3">
              <Eyebrow tone="cream">प्रोटीन — सीधी बात</Eyebrow>
              <p className="mt-1.5 text-body-sm text-cream/85">
                {mode === 'swap' && !match && (
                  <>
                    Straight 1:1 swap: {result.actualG} g of tofu gives about {result.tofuProt} g protein against{' '}
                    {result.paneerProt} g from the paneer it replaces — that is less, and we would rather say it than
                    hide it. Turn on &ldquo;match my protein&rdquo; and we send 1.8× the weight to make it level.
                  </>
                )}
                {mode === 'swap' && match && (
                  <>
                    Matched: {result.actualG} g of tofu ≈ {result.tofuProt} g protein, level with the {result.paneerProt}{' '}
                    g the paneer was giving you — and still {result.kcalSaved.toLocaleString('en-IN')} kcal lighter this
                    week.
                  </>
                )}
                {mode === 'week' && (
                  <>
                    This basket carries about {result.tofuProt} g of protein across the week. The same dishes made with
                    paneer would give roughly {result.paneerProt} g — a little more, at more than double the calories.
                    Add one tikka plate to close the gap.
                  </>
                )}
              </p>
              <Meta className="mt-2 text-cream/45">
                RDA REFERENCE — ICMR-NIN 2020: 0.83 G PROTEIN / KG BODY WEIGHT / DAY
              </Meta>
            </div>

            {result.nudge && (
              <div className="mt-4 bg-paper p-3 text-ink">
                <p lang="hi" className="font-headline text-[16px] font-extrabold">
                  पहले 2 हफ़्ते {result.nudgePacks} पैक से शुरू करें
                </p>
                <p className="mt-1 text-body-sm text-grey-warm-dark">
                  Week one is where people over-order, throw tofu away and quit. Start smaller, then move up — we change
                  your plan on WhatsApp in one message.
                </p>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <button
                onClick={() => (standalone ? (window.location.href = '/#form') : scrollToId('form'))}
                className="flex h-button w-full items-center justify-center bg-vermilion px-4 font-headline text-[18px] font-extrabold text-white"
              >
                <span lang="hi">यही plan चुनें</span>
                <span className="ml-2">— {result.plan.name}</span>
              </button>
              <Meta className="text-center text-cream/55">
                {result.plan.name} · ₹{result.plan.price} / WEEK · CHANGE ANYTIME
              </Meta>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[56px] w-full items-center justify-center bg-green px-4 font-headline text-[16px] font-extrabold text-white"
              >
                WhatsApp पर भेजें
              </a>
            </div>

            <Meta className="mt-3 text-cream/40">
              {comparison.source.toUpperCase()}
            </Meta>
          </>
        )}
      </div>
    </div>
  )
}
