'use client'

import { useState } from 'react'
import { digitsOnly } from '@/lib/validation'
import { usePilot } from '@/lib/store'
import { ErrorText, FieldLabel, INPUT, INPUT_MONO, Meta, Spinner } from './ui'

/**
 * The only place on the site where asking about price outright is right: a gym
 * or café owner recalling what they pay for paneer today is remembering a real
 * transaction, not guessing at a hypothetical. It is the field that prices the
 * deal, so the design gives it its own vermilion box.
 */
export function BulkForm() {
  const { state } = usePilot()
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [phone, setPhone] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const f = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: String(f.get('businessName') ?? ''),
          contactName: String(f.get('contactName') ?? ''),
          phone,
          businessType: String(f.get('businessType') ?? 'other'),
          kgPerWeek: f.get('kgPerWeek') ? Number(f.get('kgPerWeek')) : null,
          currentPaneerPricePerKg: f.get('paneerPrice') ? Number(f.get('paneerPrice')) : null,
          area: String(f.get('area') ?? '') || null,
          pincode: String(f.get('pincode') ?? '') || null,
          notes: String(f.get('notes') ?? '') || null,
          attribution: state.attribution,
        }),
      })
      if (!res.ok) {
        setError('Kuch gadbad — please WhatsApp us instead.')
        return
      }
      setDone(true)
    } catch {
      setError('Network issue — please WhatsApp us instead.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="border-2 border-green bg-paper p-5">
        <p lang="hi" className="font-headline text-[19px] font-extrabold text-ink">
          मिल गया — इस हफ़्ते call करेंगे।
        </p>
        <p className="mt-2 text-body-sm text-grey-warm-dark">
          We bring a sample block to every first meeting. Nobody should sign a standing order for something they have
          not cooked with.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <FieldLabel htmlFor="b-business">BUSINESS NAME</FieldLabel>
        <input id="b-business" name="businessName" required className={INPUT} />
      </div>
      <div>
        <FieldLabel htmlFor="b-contact">AAPKA NAAM</FieldLabel>
        <input id="b-contact" name="contactName" required className={INPUT} />
      </div>
      <div>
        <FieldLabel htmlFor="b-phone">PHONE</FieldLabel>
        <div className="flex">
          <span className="flex h-input w-[62px] shrink-0 items-center justify-center border-2 border-r-0 border-indigo bg-cream font-mono text-[16px]">
            +91
          </span>
          <input
            id="b-phone"
            value={phone}
            onChange={(e) => setPhone(digitsOnly(e.target.value, 10))}
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel-national"
            required
            className={INPUT_MONO}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="b-type">TYPE</FieldLabel>
          <select id="b-type" name="businessType" defaultValue="gym" className={INPUT}>
            <option value="gym">Gym / fitness studio</option>
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Café</option>
            <option value="cloud_kitchen">Cloud kitchen</option>
            <option value="pg_mess">PG mess</option>
            <option value="other">Something else</option>
          </select>
        </div>
        <div>
          <FieldLabel htmlFor="b-kg">KG PER WEEK</FieldLabel>
          <select id="b-kg" name="kgPerWeek" defaultValue="10" className={INPUT}>
            {[5, 10, 15, 25, 40].map((n) => (
              <option key={n} value={n}>
                {n} kg
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="b-area">AREA</FieldLabel>
          <input id="b-area" name="area" className={INPUT} placeholder="Sector 62" />
        </div>
        <div>
          <FieldLabel htmlFor="b-pin">PINCODE</FieldLabel>
          <input id="b-pin" name="pincode" inputMode="numeric" maxLength={6} className={INPUT_MONO} placeholder="201309" />
        </div>
      </div>

      {/* The field that prices the deal. */}
      <div className="border-2 border-vermilion bg-cream p-4">
        <label htmlFor="b-paneer" className="block font-headline text-[16px] font-bold text-ink">
          What do you currently pay per kg for paneer?
        </label>
        <p className="mb-2 mt-1 text-body-sm text-grey-warm-dark">
          Tell us and we will be straight with you about whether we can beat it.
        </p>
        <div className="flex">
          <span className="flex h-input w-[48px] shrink-0 items-center justify-center border-2 border-r-0 border-indigo bg-paper font-mono text-[16px]">
            ₹
          </span>
          <input id="b-paneer" name="paneerPrice" inputMode="numeric" placeholder="per kg" className={INPUT_MONO} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="b-notes">AUR KUCH?</FieldLabel>
        <textarea id="b-notes" name="notes" rows={3} className={`${INPUT} h-auto py-3`} />
      </div>

      {error && <ErrorText>{error}</ErrorText>}

      <button
        type="submit"
        className="flex h-button w-full items-center justify-center gap-2 bg-vermilion px-4 font-headline text-[19px] font-extrabold text-white"
      >
        {busy && <Spinner className="text-white" />}
        Enquiry भेजिए
      </button>
      <Meta className="text-grey-warm">FSSAI LICENCE &amp; LAB REPORT ATTACHED TO EVERY QUOTE</Meta>
    </form>
  )
}
