'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { areas, form as copy } from '@/content'
import { CONSENT_SUB, CONSENT_TEXT } from '@/lib/consent'
import { digitsOnly, normalisePhone } from '@/lib/validation'
import { usePilot } from '@/lib/store'
import { AlreadyIn } from './AlreadyIn'
import { ErrorText, Eyebrow, Heading, INPUT, INPUT_MONO, Meta, Section, Spinner } from './ui'

interface Props {
  token: string
  referrer: string
  society: string | null
  area: string
  pincode: string
  plan: string | null
}

/**
 * It should feel like being recognised, not like a pre-filled form. Everything
 * the token knows is shown as a fact with an EDIT affordance beside it — visible
 * and changeable, but not something anybody has to touch.
 */
export function RecognisedArrival({ token, referrer, society, area, pincode, plan }: Props) {
  const router = useRouter()
  const { state, set, setForm, hydrating } = usePilot()
  const [editing, setEditing] = useState<'area' | 'pincode' | null>(null)
  const [busy, setBusy] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; phone?: string; consent?: string }>({})

  // Pre-load from the token, but never overwrite something they already typed.
  useEffect(() => {
    if (hydrating) return
    setForm({ area: state.form.area || area, pin: state.form.pin || pincode })
  }, [hydrating, area, pincode, setForm, state.form.area, state.form.pin])

  // Hold the ground colour rather than flashing a form before storage returns.
  if (hydrating) return <Section ground="indigo" className="min-h-[420px]"><span /></Section>
  if (state.signup) {
    return (
      <Section ground="paper">
        <AlreadyIn />
      </Section>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!state.form.name.trim()) next.name = 'Please tell us your name'
    if (!normalisePhone(state.form.phone)) next.phone = copy.errors.phone
    if (!state.form.consent) next.consent = copy.errors.consent
    setErrors(next)
    if (Object.keys(next).length) return

    setBusy(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.form.name.trim(),
          phone: state.form.phone,
          area: state.form.area || area,
          pincode: state.form.pin || pincode,
          intent: 'launch',
          plan,
          consent: true,
          attribution: state.attribution,
          referredBy: token,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setBusy(false)
        return
      }
      set({
        signup: {
          rank: data.rank,
          code: data.code,
          plan: data.plan ?? plan ?? '',
          name: state.form.name.trim(),
          area: state.form.area || area,
          pincode: state.form.pin || pincode,
        },
      })
      router.push(`/thanks?code=${encodeURIComponent(data.code)}&rank=${data.rank}&tier=${data.tier}`)
    } catch {
      setBusy(false)
    }
  }

  const rows: [string, string, 'area' | 'pincode'][] = [
    ['AREA', state.form.area || area, 'area'],
    ['PINCODE', state.form.pin || pincode, 'pincode'],
  ]

  return (
    <Section ground="indigo" className="pt-10">
      <div className="mx-auto max-w-[700px]">
        <Eyebrow tone="marigold">{referrer.toUpperCase()} SENT YOU THIS</Eyebrow>
        <Heading as="h1" size="lg" className="mt-2">
          Hello. It&rsquo;s all filled in.
        </Heading>
        <p className="mt-3 max-w-measure text-body text-cream/80">
          {referrer} {society ? `from ${society}` : 'from your area'} is already on the list. Everything below came
          across with the link — change anything you like, or leave it as it is.
        </p>

        <div className="mt-6 bg-paper p-4 text-ink">
          {rows.map(([label, value, key]) => (
            <div key={key} className="flex items-center justify-between gap-3 border-b border-stone py-3 last:border-0">
              {editing === key ? (
                key === 'area' ? (
                  <select
                    autoFocus
                    value={state.form.area || area}
                    onChange={(e) => setForm({ area: e.target.value })}
                    onBlur={() => setEditing(null)}
                    className={INPUT}
                  >
                    {areas.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    autoFocus
                    value={state.form.pin || pincode}
                    onChange={(e) => setForm({ pin: digitsOnly(e.target.value, 6) })}
                    onBlur={() => setEditing(null)}
                    inputMode="numeric"
                    maxLength={6}
                    className={INPUT_MONO}
                  />
                )
              ) : (
                <>
                  <span>
                    <Meta className="text-grey-warm">{label}</Meta>
                    <span className="block font-headline text-[16px] font-bold text-ink">{value}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditing(key)}
                    className="min-h-target font-mono text-[11px] uppercase tracking-[0.12em] text-vermilion underline"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
          {plan && (
            <div className="flex items-center justify-between gap-3 border-t border-stone py-3">
              <span>
                <Meta className="text-grey-warm">PLAN</Meta>
                <span className="block font-headline text-[16px] font-bold text-ink">{plan}</span>
              </span>
              <a href="/protein-calculator" className="min-h-target font-mono text-[11px] uppercase tracking-[0.12em] text-vermilion underline">
                Edit
              </a>
            </div>
          )}
        </div>

        <div className="mt-3 border-2 border-marigold p-4">
          <Meta className="text-marigold">PADOSI BONUS</Meta>
          <p className="mt-2 text-body-sm text-cream/80">
            When you confirm, {referrer} gets a free pack — and so do you. Deliveries to one society cost us a fraction
            of scattered ones.
          </p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="r-name" className="mb-1.5 block font-mono text-eyebrow uppercase text-cream/60">
              {copy.labels.name}
            </label>
            <input
              id="r-name"
              value={state.form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              placeholder="Ritu"
              autoComplete="given-name"
              className={INPUT}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </div>

          <div>
            <label htmlFor="r-phone" className="mb-1.5 block font-mono text-eyebrow uppercase text-cream/60">
              {copy.labels.phone}
            </label>
            <div className="flex">
              <span className="flex h-input w-[62px] shrink-0 items-center justify-center border-2 border-r-0 border-indigo bg-cream font-mono text-[16px] text-ink">
                +91
              </span>
              <input
                id="r-phone"
                value={state.form.phone}
                onChange={(e) => {
                  setForm({ phone: digitsOnly(e.target.value, 10) })
                  if (errors.phone) setErrors((x) => ({ ...x, phone: undefined }))
                }}
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel-national"
                className={INPUT_MONO}
              />
            </div>
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={state.form.consent}
              onChange={(e) => setForm({ consent: e.target.checked })}
              className="mt-0.5 h-7 w-7 shrink-0 accent-[var(--c-green)]"
            />
            <span>
              <span className="block font-headline text-[15px] font-bold leading-[1.4] text-cream">
                {CONSENT_TEXT}
              </span>
              <span className="mt-1 block text-[11.5px] leading-[1.6] text-cream/60">{CONSENT_SUB}</span>
            </span>
          </label>
          {errors.consent && <ErrorText>{errors.consent}</ErrorText>}

          <button
            type="submit"
            className="flex h-button w-full items-center justify-center gap-2 bg-vermilion px-4 font-headline text-[19px] font-extrabold text-white"
          >
            {busy && <Spinner className="text-white" />}
            <span>Yes, add me</span>
          </button>

          <Meta className="text-cream/40">
            NOTHING TO TYPE · ONE TAP · TOKEN CARRIES NAME, AREA, PLAN AND REFERRAL ID
          </Meta>
        </form>
      </div>
    </Section>
  )
}
