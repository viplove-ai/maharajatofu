'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AREAS } from '@/lib/areas'
import { PLANS } from '@/lib/plans'
import { CONSENT_TEXT } from '@/lib/consent'
import { captureUtm, storedUtm, track } from '@/lib/attribution'
import { Button, Field, inputClass } from './ui'
import type { CalculatorOutcome } from './Calculator'

type Errors = Record<string, string[] | undefined>

/**
 * Four fields, and deliberately no more. We do not ask for a house or flat
 * number: area plus pincode is enough to plan a delivery route, and every extra
 * field costs signups while creating data we would then have to hold.
 */
export function SignupForm({ outcome }: { outcome?: CalculatorOutcome | null }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    captureUtm(window.location.search)
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})
    setFormError(null)

    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      area: String(form.get('area') ?? ''),
      pincode: String(form.get('pincode') ?? ''),
      intent: String(form.get('intent') ?? 'exploring'),
      consent: form.get('consent') === 'on',
      plan: outcome?.planId ?? null,
      calculatorSnapshot: outcome ? { ...outcome } : null,
      utm: storedUtm(),
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrors(data.fields ?? {})
        setFormError(data.error ?? 'Please check the form')
        return
      }

      track('signup_submitted', { plan: payload.plan, area: payload.area, tier: data.tier })
      const q = new URLSearchParams({ code: data.couponCode, tier: data.tier })
      if (data.alreadySignedUp) q.set('again', '1')
      router.push(`/thanks?${q.toString()}`)
    } catch {
      setFormError('Network gadbad. Please try again, or just WhatsApp us.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Aapka naam" htmlFor="name" error={errors.name?.[0]}>
        <input id="name" name="name" required autoComplete="given-name" className={inputClass} placeholder="First name is enough" />
      </Field>

      <Field label="WhatsApp number" htmlFor="phone" hint="We message once at launch with your coupon. That's it." error={errors.phone?.[0]}>
        <div className="flex gap-2">
          <span className="flex min-h-[48px] items-center rounded border border-line bg-surface-2 px-3 font-mono text-sm">+91</span>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={13}
            required
            className={inputClass}
            placeholder="98765 43210"
          />
        </div>
      </Field>

      <Field label="Area" htmlFor="area" error={errors.area?.[0]}>
        <select id="area" name="area" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Choose your area
          </option>
          {AREAS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Pincode" htmlFor="pincode" hint="No house or flat number — we only need to plan the route." error={errors.pincode?.[0]}>
        <input id="pincode" name="pincode" inputMode="numeric" pattern="\d{6}" maxLength={6} required className={inputClass} placeholder="201012" />
      </Field>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">When would you order?</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              ['launch_week', 'Launch week'],
              ['within_month', 'Within a month'],
              ['exploring', 'Just exploring'],
            ] as const
          ).map(([value, label], i) => (
            <label key={value} className="flex min-h-[48px] cursor-pointer items-center gap-2 rounded border border-line bg-surface px-3 text-sm has-[:checked]:border-accent">
              <input type="radio" name="intent" value={value} defaultChecked={i === 0} className="h-4 w-4 accent-[var(--c-accent)]" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      {outcome && (
        <p className="rounded border border-line bg-surface-2 p-3 text-sm">
          Your plan: <strong>{PLANS.find((p) => p.id === outcome.planId)?.name}</strong> — {outcome.packsPerWeek} packs a
          week. You can change it any time.
        </p>
      )}

      {/* Unticked, unbundled, and never a condition of using the calculator.
          DPDP consent has to be free, specific, informed and unambiguous. */}
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" required className="mt-1 h-5 w-5 shrink-0 accent-[var(--c-accent)]" />
        <span>{CONSENT_TEXT}</span>
      </label>
      {errors.consent?.[0] && (
        <p role="alert" className="text-sm text-accent">
          {errors.consent[0]}
        </p>
      )}

      {formError && (
        <p role="alert" className="rounded border border-accent bg-surface p-3 text-sm text-accent">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Bhej rahe hain…' : 'Get my early-bird coupon'}
      </Button>
      <p className="text-xs text-muted">
        We never share your number, and &ldquo;STOP&rdquo; removes you at any time. See our{' '}
        <a href="/privacy" className="underline">
          privacy page
        </a>
        .
      </p>
    </form>
  )
}
