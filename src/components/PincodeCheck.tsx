'use client'

import { useState } from 'react'
import { outOfZone, zoneForPincode } from '@/content'
import { digitsOnly } from '@/lib/validation'
import { scrollToId, usePilot } from '@/lib/store'
import { Eyebrow, HeadingHi, INPUT_MONO, Meta, Spinner } from './ui'

interface Slots {
  served: boolean | null
  zone?: string | null
  left: number | null
  requests?: number | null
  threshold: number
}

/**
 * Qualifies traffic in one tap and maps demand outside the circle for free.
 *
 * Out of zone is a conversion state, not an error: we capture the pincode, show
 * how close that pincode is to opening a route, and keep talking.
 */
export function PincodeCheck() {
  const { state, set, setForm } = usePilot()
  const [slots, setSlots] = useState<Slots | null>(null)

  const pin = state.pin
  const status = state.pinState

  async function check() {
    if (pin.length < 6) {
      set({ pinState: 'short' })
      return
    }
    set({ pinState: 'loading' })

    // The zone map ships in the bundle, so the answer is already known. The
    // ~700ms beat is deliberate: an instant reply reads as guessed rather than
    // checked, and the round trip also records the ask when we cannot deliver.
    const [res] = await Promise.all([
      fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode: pin }),
      })
        .then((r) => r.json())
        .catch(() => ({ served: zoneForPincode(pin) !== null, threshold: outOfZone.threshold, left: null })),
      new Promise((r) => setTimeout(r, 700)),
    ])

    setSlots(res as Slots)
    set({ pinState: res.served ? 'ok' : 'out' })
    setForm({ pin })
  }

  return (
    <div>
      <Eyebrow tone="vermilion">02 — DELIVERY CHECK</Eyebrow>
      <HeadingHi size="md" className="mt-2 text-ink">
        आपके यहाँ पहुँचाते हैं?
      </HeadingHi>

      <div className="mt-3 flex gap-2">
        <label htmlFor="pincode-check" className="sr-only">
          Aapka pincode
        </label>
        <input
          id="pincode-check"
          value={pin}
          onChange={(e) => {
            set({ pin: digitsOnly(e.target.value, 6), pinState: 'idle' })
            setSlots(null)
          }}
          onKeyDown={(e) => e.key === 'Enter' && check()}
          inputMode="numeric"
          maxLength={6}
          placeholder="201012"
          aria-describedby="pincode-result"
          className={`${INPUT_MONO} tracking-[0.14em]`}
        />
        <button
          onClick={check}
          className="h-input w-[106px] shrink-0 bg-indigo px-2 font-headline text-[17px] font-extrabold text-cream"
        >
          Check
        </button>
      </div>

      <div id="pincode-result" aria-live="polite" className="mt-3">
        {status === 'idle' && (
          <p className="text-[12.5px] text-grey-warm">
            Pilot zone: Noida Sector 62 &amp; 63, Vasundhara, Indirapuram, Vaishali, Kaushambi, Rajendra Nagar.
          </p>
        )}

        {status === 'short' && (
          <div className="border-l-4 border-vermilion bg-paper p-3">
            <p className="text-body-sm text-slate">
              6 digits chahiye — Vasundhara is 201012, Sector 62 is 201309.
            </p>
          </div>
        )}

        {status === 'loading' && (
          <div className="flex items-center gap-2 border border-dashed border-stone-edge p-3">
            <Spinner className="text-vermilion" />
            <Meta className="text-grey-warm">CHECKING ROUTE…</Meta>
          </div>
        )}

        {status === 'ok' && (
          <div className="bg-indigo p-4 text-cream">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center bg-green text-[13px] text-white" aria-hidden>
                ✓
              </span>
              <div>
                <HeadingHi size="sm">{slots?.zone ?? zoneForPincode(pin)} — हाँ जी, पहुँचाते हैं</HeadingHi>
                <Meta className="mt-2 text-cream/60">DELIVERY DAYS · TUE &amp; FRI, 6–9 PM</Meta>
                {slots?.left != null && (
                  <Meta className="text-marigold">FOUNDING SLOTS LEFT HERE · {slots.left}</Meta>
                )}
              </div>
            </div>
          </div>
        )}

        {status === 'out' && (
          <div className="border-2 border-marigold bg-paper p-4">
            <HeadingHi size="sm" className="text-ink">
              {outOfZone.copy.headline}
            </HeadingHi>
            <p className="mt-2 text-body-sm text-slate">
              You are outside the 5 km pilot circle for now. {outOfZone.copy.body}
              {slots?.requests != null && <> Yours is #{slots.requests}.</>}
            </p>

            {slots?.requests != null && (
              <div className="mt-3">
                <div className="h-2 w-full bg-stone" role="presentation">
                  <div
                    className="h-2 bg-vermilion"
                    style={{ width: `${Math.min(100, (slots.requests / (slots.threshold || 25)) * 100)}%` }}
                  />
                </div>
                <Meta className="mt-1.5 text-grey-warm">
                  {slots.requests} / {slots.threshold || 25} IN {pin}
                </Meta>
              </div>
            )}

            <button
              onClick={() => scrollToId('form')}
              className="mt-3 flex h-[54px] w-full items-center justify-center bg-indigo px-4 font-headline text-[17px] font-extrabold text-cream"
            >
              {outOfZone.copy.cta}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
