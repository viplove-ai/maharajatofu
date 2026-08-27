'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { areas, form as copy, brand } from '@/content'
import { calcSwap, calcWeek } from '@/lib/calculator'
import { CONSENT_SUB, CONSENT_TEXT } from '@/lib/consent'
import { digitsOnly, normalisePhone } from '@/lib/validation'
import { scrollToId, usePilot } from '@/lib/store'
import { Eyebrow, ErrorText, FieldLabel, INPUT, INPUT_MONO, Meta, Spinner } from './ui'
import { WhatsAppLink } from './WhatsApp'

type Errors = { name?: string; phone?: string; area?: string; pin?: string; consent?: string }

/**
 * Four fields, and deliberately no more. No house number, no flat, no full
 * address — area plus pincode plans a route, and every extra field costs
 * signups while creating data we would then have to hold and delete.
 *
 * The keyboard appears exactly twice on this form: phone and pincode.
 */
export function SignupForm({ referredBy }: { referredBy?: string }) {
  const router = useRouter()
  const { state, set, setForm } = usePilot()
  const { form, submitState } = state
  const [errors, setErrors] = useState<Errors>({})

  const result = useMemo(
    () =>
      state.mode === 'swap'
        ? calcSwap(state.paneerG, state.pct, state.match)
        : calcWeek(state.eaters, state.dishes, state.trains),
    [state.mode, state.paneerG, state.pct, state.match, state.eaters, state.dishes, state.trains],
  )

  function validate(): Errors {
    const next: Errors = {}
    if (!form.name.trim()) next.name = 'Naam likh dijiye'
    if (!normalisePhone(form.phone)) next.phone = copy.errors.phone
    if (!form.area) next.area = 'Area chun lijiye'
    if (!/^\d{6}$/.test(form.pin)) next.pin = '6 digits chahiye'
    if (!form.consent) next.consent = copy.errors.consent
    return next
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Validate on submit, not on blur. The button is never disabled — tapping it
    // reveals which field needs help rather than doing nothing.
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) {
      const first = document.querySelector<HTMLElement>('[data-invalid="true"]')
      first?.focus()
      return
    }

    set({ submitState: 'loading' })
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone,
          area: form.area,
          pincode: form.pin,
          intent: form.intent || 'explore',
          plan: result.plan.name,
          packs: result.packs,
          consent: true,
          calculatorSnapshot: {
            mode: state.mode,
            packs: result.packs,
            kcalSaved: result.kcalSaved,
            plan: result.plan.name,
          },
          attribution: state.attribution,
          referredBy: referredBy ?? null,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        set({ submitState: 'error' })
        return
      }

      set({
        submitState: 'done',
        signup: {
          rank: data.rank,
          code: data.code,
          plan: data.plan ?? result.plan.name,
          name: form.name.trim(),
          area: form.area,
          pincode: form.pin,
        },
      })
      router.push(`/thanks?code=${encodeURIComponent(data.code)}&rank=${data.rank}&tier=${data.tier}`)
    } catch {
      // Keep what they typed and let them retry — losing a filled form to a
      // flaky 4G moment is the most avoidable way to lose a signup.
      set({ submitState: 'error' })
    }
  }

  const busy = submitState === 'loading'

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <FieldLabel htmlFor="f-name">{copy.labels.name}</FieldLabel>
        <input
          id="f-name"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          data-invalid={errors.name ? 'true' : undefined}
          aria-invalid={!!errors.name}
          autoComplete="given-name"
          maxLength={60}
          placeholder="Ritu"
          className={INPUT}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </div>

      <div>
        <FieldLabel htmlFor="f-phone">{copy.labels.phone}</FieldLabel>
        <div className="flex">
          <span className="flex h-input w-[62px] shrink-0 items-center justify-center border-2 border-r-0 border-indigo bg-cream font-mono text-[16px] text-ink">
            +91
          </span>
          <input
            id="f-phone"
            value={form.phone}
            onChange={(e) => {
              setForm({ phone: digitsOnly(e.target.value, 10) })
              // Clear the phone error as soon as they start fixing it.
              if (errors.phone) setErrors((x) => ({ ...x, phone: undefined }))
            }}
            data-invalid={errors.phone ? 'true' : undefined}
            aria-invalid={!!errors.phone}
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            placeholder="98765 43210"
            className={`${INPUT_MONO} tracking-[0.08em]`}
          />
        </div>
        {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
      </div>

      <div>
        <FieldLabel htmlFor="f-area">{copy.labels.area}</FieldLabel>
        <select
          id="f-area"
          value={form.area}
          onChange={(e) => setForm({ area: e.target.value })}
          data-invalid={errors.area ? 'true' : undefined}
          aria-invalid={!!errors.area}
          className={INPUT}
        >
          <option value="">Area chuniye</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
        {errors.area && <ErrorText>{errors.area}</ErrorText>}
      </div>

      <div>
        <FieldLabel htmlFor="f-pin">{copy.labels.pincode}</FieldLabel>
        <input
          id="f-pin"
          value={form.pin}
          onChange={(e) => setForm({ pin: digitsOnly(e.target.value, 6) })}
          data-invalid={errors.pin ? 'true' : undefined}
          aria-invalid={!!errors.pin}
          inputMode="numeric"
          maxLength={6}
          placeholder="201012"
          className={`${INPUT_MONO} tracking-[0.14em]`}
        />
        {errors.pin && <ErrorText>{errors.pin}</ErrorText>}
        <p className="mt-1.5 text-[12.5px] text-grey-warm">{copy.sub}</p>
      </div>

      {/* Auto-filled from the calculator — never re-ask something already told. */}
      <div className="bg-cream p-3">
        <Meta className="text-grey-warm">AUTO-FILLED FROM CALCULATOR</Meta>
        <p className="mt-1 font-headline text-[17px] font-bold text-ink">
          {result.plan.name} · {result.packs} {result.packs === 1 ? 'pack' : 'packs'} / week
        </p>
        <p className="font-mono text-[15px] text-vermilion">₹{result.plan.price} / WEEK</p>
        <button
          type="button"
          onClick={() => scrollToId('calculator')}
          className="mt-1 font-mono text-eyebrow uppercase text-indigo underline"
        >
          Change in calculator
        </button>
      </div>

      <fieldset>
        <legend className="mb-2 font-mono text-eyebrow uppercase text-grey-warm">{copy.labels.intent}</legend>
        <div className="space-y-2">
          {copy.intents.map((i) => (
            <label
              key={i.key}
              className={`flex h-chip cursor-pointer items-center gap-3 border-2 px-3 text-body-sm ${
                form.intent === i.key ? 'border-indigo bg-indigo text-cream' : 'border-indigo bg-transparent text-ink'
              }`}
            >
              <input
                type="radio"
                name="intent"
                value={i.key}
                checked={form.intent === i.key}
                onChange={() => setForm({ intent: i.key as typeof form.intent })}
                className="sr-only"
              />
              <span>{i.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Ships UNTICKED. DPDP consent must be free, specific, informed and
          unambiguous — styled to be read, not skipped. The whole row is the target. */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm({ consent: e.target.checked })}
          data-invalid={errors.consent ? 'true' : undefined}
          aria-invalid={!!errors.consent}
          className="mt-0.5 h-7 w-7 shrink-0 accent-[var(--c-green)]"
        />
        <span>
          <span lang="hi" className="block font-headline text-[15px] font-bold leading-[1.4] text-ink">
            {CONSENT_TEXT}
          </span>
          <span className="mt-1 block text-[11.5px] leading-[1.6] text-grey-warm-dark">
            {CONSENT_SUB}{' '}
            <a href="/privacy" className="underline">
              Privacy
            </a>
            .
          </span>
        </span>
      </label>
      {errors.consent && <ErrorText>{errors.consent}</ErrorText>}

      {submitState === 'error' && (
        <div className="border-2 border-chilli bg-paper p-3">
          <p lang="hi" className="font-headline text-[16px] font-extrabold text-ink">
            नहीं गया — पर आपका data सुरक्षित है
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              className="h-[52px] flex-1 bg-vermilion px-3 font-headline text-[16px] font-extrabold text-white"
            >
              फिर से भेजें
            </button>
            <WhatsAppLink
              message={`${brand.whatsappPrefill} Naam: ${form.name}. Area: ${form.area}.`}
              className="flex h-[52px] flex-1 items-center justify-center bg-green px-3 font-headline text-[16px] font-extrabold text-white"
            >
              WhatsApp करें
            </WhatsAppLink>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="flex h-button w-full items-center justify-center gap-2 bg-vermilion px-4 font-headline text-[19px] font-extrabold text-white"
      >
        {busy && <Spinner className="text-white" />}
        <span lang="hi">{busy ? copy.submit.loading : copy.submit.idle}</span>
      </button>

      <Eyebrow tone="grey">
        NO PAYMENT · NO ACCOUNT · {Object.keys(state.attribution).length > 0 ? 'AD ATTRIBUTION CAPTURED' : 'DIRECT VISIT'}
      </Eyebrow>
    </form>
  )
}
