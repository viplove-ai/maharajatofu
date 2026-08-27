'use client'

import { usePilot } from '@/lib/store'
import { AlreadyIn } from './AlreadyIn'
import { SignupForm } from './SignupForm'
import { Heading } from './ui'

/** Never show the form to someone already in. */
export function SignupBlock({ referredBy }: { referredBy?: string }) {
  const { state, hydrating } = usePilot()

  // Hold the height rather than flashing a form at a returning visitor for one
  // frame before localStorage comes back.
  if (hydrating) return <div className="min-h-[420px] bg-paper" aria-busy />

  if (state.signup) return <AlreadyIn />

  return (
    <div className="bg-paper p-5 text-ink">
      <Heading size="md" className="text-ink">
        Four things. That is all.
      </Heading>
      <p className="mb-5 mt-1.5 text-body-sm text-grey-warm-dark">
        No payment, no account. We message you once when we launch, with your coupon.
      </p>
      <SignupForm referredBy={referredBy} />
    </div>
  )
}
