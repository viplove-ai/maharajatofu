'use client'

import Link from 'next/link'
import { brand, planByPacks } from '@/content'
import { FOUNDING_LIMIT } from '@/lib/ladder'
import { usePilot } from '@/lib/store'
import { WhatsAppLink } from './WhatsApp'
import { Body, HeadingHi, Meta, Num } from './ui'

/**
 * Shown instead of the form to anyone already on the list — identified from the
 * store, or from a /r/ token. Never show the form to someone already in: asking
 * a person to fill in what you already know is the fastest way to look like you
 * were not paying attention.
 */
export function AlreadyIn() {
  const { state } = usePilot()
  const s = state.signup
  if (!s) return null

  const founding = s.rank <= FOUNDING_LIMIT
  const plan = planByPacks(0)

  return (
    <div className="bg-paper p-5 text-ink">
      <Meta className="text-green">
        CONFIRMED · {founding ? `FOUNDING MEMBER #${s.rank}` : `EARLY BIRD #${s.rank}`}
      </Meta>
      <HeadingHi size="lg" className="mt-2 text-ink">
        {s.name} ji, आप पहले से अंदर हैं।
      </HeadingHi>
      <Body className="mt-2 text-grey-warm-dark">No form again. We have everything we need.</Body>

      <div className="mt-5 border-2 border-dashed border-marigold bg-indigo p-4">
        <Meta className="text-cream/60">AAPKA COUPON</Meta>
        <p className="mt-1 font-mono text-[22px] font-semibold tracking-[0.1em] text-marigold">{s.code}</p>
      </div>

      <div className="mt-3 bg-cream p-4">
        <Meta className="text-grey-warm">AAPKA PLAN</Meta>
        <p className="mt-1 font-headline text-[17px] font-bold text-ink">{s.plan || plan.name}</p>
        <div className="mt-3 space-y-0.5">
          <Meta className="text-grey-warm">AREA · {s.area.toUpperCase()}</Meta>
          <Meta className="text-grey-warm">PINCODE · {s.pincode}</Meta>
          <Meta className="text-grey-warm">DELIVERY · {brand.deliveryDays.toUpperCase()}</Meta>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/protein-calculator"
            className="flex h-[52px] flex-1 items-center justify-center border-2 border-indigo px-4 font-headline text-[16px] font-extrabold text-indigo"
          >
            Plan बदलें
          </Link>
          <WhatsAppLink
            message={`Namaste! Coupon ${s.code}. `}
            className="flex h-[52px] flex-1 items-center justify-center bg-green px-4 font-headline text-[16px] font-extrabold text-white"
          >
            WhatsApp करें
          </WhatsAppLink>
        </div>
      </div>

      <div className="mt-3 border-2 border-marigold p-4">
        <Meta className="text-vermilion">PADOSI BONUS · 1 PACK PENDING</Meta>
        <Body className="mt-2 text-grey-warm-dark">
          Send your link to someone in your society. When they confirm, you both get a free pack — deliveries to one
          society cost us a fraction of scattered ones, so we would rather share that than keep it.
        </Body>
        <WhatsAppLink
          message={`${brand.name} — fresh tofu, Ghaziabad se. Wahi sabzi, aadhi calories. ${brand.domain}`}
          className="mt-3 inline-block font-mono text-[12px] uppercase tracking-[0.12em] text-indigo underline"
        >
          Forward your link →
        </WhatsAppLink>
      </div>

      <Meta className="mt-4 text-grey-warm">
        <Num>{s.rank}</Num> OF {FOUNDING_LIMIT} FOUNDING SLOTS
      </Meta>
    </div>
  )
}
