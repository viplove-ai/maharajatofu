'use client'

import { useState } from 'react'
import { storedUtm, track } from '@/lib/attribution'
import { Button, Field, inputClass } from './ui'

/**
 * The one place on the site where asking about price outright is right: a gym or
 * café owner recalling what they pay for paneer today is remembering a real
 * transaction, not guessing at a hypothetical.
 */
export function BulkForm() {
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const f = new FormData(e.currentTarget)
    const payload = {
      businessName: String(f.get('businessName') ?? ''),
      contactName: String(f.get('contactName') ?? ''),
      phone: String(f.get('phone') ?? ''),
      businessType: String(f.get('businessType') ?? 'other'),
      kgPerWeek: f.get('kgPerWeek') ? Number(f.get('kgPerWeek')) : null,
      currentPaneerPricePerKg: f.get('paneerPrice') ? Number(f.get('paneerPrice')) : null,
      area: String(f.get('area') ?? '') || null,
      pincode: String(f.get('pincode') ?? '') || null,
      notes: String(f.get('notes') ?? '') || null,
      utm: storedUtm(),
    }
    try {
      const res = await fetch('/api/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Please check the form')
        return
      }
      track('bulk_lead_submitted', { businessType: payload.businessType, kgPerWeek: payload.kgPerWeek })
      setDone(true)
    } catch {
      setError('Network issue — please WhatsApp us instead.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="rounded border border-plant bg-surface p-5">
        <p className="font-display text-lg font-semibold">Thanks — we&rsquo;ll call you this week.</p>
        <p className="mt-1 text-sm text-muted">
          We&rsquo;ll bring a sample pack so you can taste it before committing to anything.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Business name" htmlFor="businessName">
        <input id="businessName" name="businessName" required className={inputClass} />
      </Field>
      <Field label="Your name" htmlFor="contactName">
        <input id="contactName" name="contactName" required className={inputClass} />
      </Field>
      <Field label="Phone" htmlFor="bphone">
        <input id="bphone" name="phone" type="tel" inputMode="numeric" required className={inputClass} placeholder="98765 43210" />
      </Field>
      <Field label="What kind of business?" htmlFor="businessType">
        <select id="businessType" name="businessType" required defaultValue="gym" className={inputClass}>
          <option value="gym">Gym or fitness studio</option>
          <option value="restaurant">Restaurant</option>
          <option value="cafe">Café</option>
          <option value="cloud_kitchen">Cloud kitchen</option>
          <option value="other">Something else</option>
        </select>
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Roughly how many kg a week?" htmlFor="kgPerWeek">
          <input id="kgPerWeek" name="kgPerWeek" inputMode="numeric" className={inputClass} placeholder="5" />
        </Field>
        <Field
          label="What do you pay per kg for paneer today?"
          hint="Helps us price the 1 kg block honestly."
          htmlFor="paneerPrice"
        >
          <input id="paneerPrice" name="paneerPrice" inputMode="numeric" className={inputClass} placeholder="₹ per kg" />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Area" htmlFor="barea">
          <input id="barea" name="area" className={inputClass} placeholder="Sector 62" />
        </Field>
        <Field label="Pincode" htmlFor="bpincode">
          <input id="bpincode" name="pincode" inputMode="numeric" maxLength={6} className={inputClass} placeholder="201309" />
        </Field>
      </div>
      <Field label="Anything else?" htmlFor="notes">
        <textarea id="notes" name="notes" rows={3} className={`${inputClass} py-2`} />
      </Field>
      {error && (
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy} className="w-full sm:w-auto">
        {busy ? 'Sending…' : 'Send enquiry'}
      </Button>
    </form>
  )
}
