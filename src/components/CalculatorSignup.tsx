'use client'

import { useState } from 'react'
import { Calculator, type CalculatorOutcome } from './Calculator'
import { SignupForm } from './SignupForm'

/** The calculator hands its result to the form so nobody re-enters anything. */
export function CalculatorSignup() {
  const [outcome, setOutcome] = useState<CalculatorOutcome | null>(null)
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Calculator
        onResult={(o) => {
          setOutcome(o)
          document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />
      <div id="signup" className="scroll-mt-6 rounded border border-line bg-surface p-5">
        <h3 className="font-display text-xl font-semibold">Get your early-bird coupon</h3>
        <p className="mb-4 mt-1 text-sm text-muted">
          No payment. We message you once when we launch, with your coupon.
        </p>
        <SignupForm outcome={outcome} />
      </div>
    </div>
  )
}
