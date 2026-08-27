'use client'

import { brand, launchDateLabel, planByPacks } from '@/content'
import { FOUNDING_LIMIT } from '@/lib/ladder'
import { usePilot } from '@/lib/store'
import { WhatsAppLink } from './WhatsApp'
import { Body, Eyebrow, Heading, Meta, Section } from './ui'

export function ThanksView({ code, rank, tier }: { code?: string; rank?: number; tier?: string }) {
  const { state } = usePilot()
  const s = state.signup

  const shownCode = code ?? s?.code
  const shownRank = rank ?? s?.rank
  const name = s?.name ?? 'ji'
  const founding = tier ? tier === 'founding' : (shownRank ?? 999) <= FOUNDING_LIMIT
  const plan = s?.plan ?? planByPacks(0).name

  return (
    <Section ground="indigo" className="pt-10">
      <Eyebrow tone="marigold">{founding ? 'FOUNDING MEMBER' : 'EARLY BIRD'}</Eyebrow>
      <Heading as="h1" size="lg" className="mt-2">
        Done, {name}. Save our number.
      </Heading>
      <Body className="mt-3 text-cream/80">
        We will WhatsApp you in about two minutes from our number. Save it, or the message lands in Unknown and you will
        never see it.
      </Body>

      {shownCode && (
        <div className="mt-6 border-2 border-dashed border-marigold p-5">
          <Meta className="text-cream/60">YOUR COUPON</Meta>
          <p className="mt-1.5 font-mono text-[22px] font-semibold tracking-[0.1em] text-marigold">{shownCode}</p>
        </div>
      )}

      <div className="mt-4 space-y-0.5">
        {shownRank != null && (
          <Meta className="text-cream/60">
            {founding ? `FOUNDING MEMBER #${shownRank} OF ${FOUNDING_LIMIT}` : `EARLY BIRD #${shownRank}`}
          </Meta>
        )}
        <Meta className="text-cream/60">PLAN · {plan.toUpperCase()}</Meta>
        <Meta className="text-cream/60">FIRST DELIVERY · {launchDateLabel().toUpperCase()}, 6–9 PM</Meta>
      </div>

      <div className="mt-6 space-y-2">
        <WhatsAppLink
          message={`Namaste! Main list par hoon${shownCode ? ` — coupon ${shownCode}` : ''}. Meri society hai: `}
          className="flex h-button w-full items-center justify-center bg-green px-4 font-headline text-[18px] font-extrabold text-white"
        >
          Save our number
        </WhatsAppLink>
        <WhatsAppLink
          message={`${brand.name} — fresh tofu, Ghaziabad se, ${brand.deliveryDays} delivery. Wahi sabzi, aadhi calories. ${brand.domain}`}
          className="flex h-button w-full items-center justify-center border-2 border-cream/40 px-4 font-headline text-[18px] font-extrabold text-cream"
        >
          Send to a neighbour — free pack
        </WhatsAppLink>
      </div>

      <Meta className="mt-6 text-cream/40">
        WE MESSAGE ONCE AT LAUNCH AND SEND YOUR COUPON · REPLY STOP AND THE NUMBER IS DELETED THE SAME DAY
      </Meta>
    </Section>
  )
}
