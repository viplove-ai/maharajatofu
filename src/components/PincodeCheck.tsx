'use client'

import { useState } from 'react'
import { track } from '@/lib/attribution'
import { Button, inputClass } from './ui'

type State = { status: 'idle' } | { status: 'served' } | { status: 'missed'; pincode: string }

/**
 * Qualifies traffic in one tap and maps demand outside the circle for free.
 * Out of zone is a conversion opportunity, not an error — we keep the pincode
 * and keep talking.
 */
export function PincodeCheck() {
  const [state, setState] = useState<State>({ status: 'idle' })
  const [busy, setBusy] = useState(false)

  async function check(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const pincode = String(new FormData(e.currentTarget).get('pincode') ?? '')
    if (!/^\d{6}$/.test(pincode)) return
    setBusy(true)
    try {
      const res = await fetch('/api/pincode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode }),
      })
      const { served } = await res.json()
      track('pincode_checked', { pincode, served })
      if (!served) track('pincode_out_of_zone', { pincode })
      setState(served ? { status: 'served' } : { status: 'missed', pincode })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded border border-line bg-surface p-5">
      <form onSubmit={check} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="pin" className="sr-only">
          Your pincode
        </label>
        <input id="pin" name="pincode" inputMode="numeric" pattern="\d{6}" maxLength={6} required placeholder="Aapka pincode" className={inputClass} />
        <Button type="submit" disabled={busy}>
          {busy ? 'Checking…' : 'Do we deliver?'}
        </Button>
      </form>

      {state.status === 'served' && (
        <p className="mt-3 text-sm font-semibold text-plant">
          Haan! We deliver there every Tuesday and Friday. Sign up below for your early-bird coupon.
        </p>
      )}
      {state.status === 'missed' && (
        <p className="mt-3 text-sm">
          <strong>Abhi nahi</strong> — {state.pincode} is outside our first delivery circle. We&rsquo;ve noted it, and
          we&rsquo;re opening the next area based on where people ask from. Sign up anyway and we&rsquo;ll tell you the
          day we reach you.
        </p>
      )}
    </div>
  )
}
