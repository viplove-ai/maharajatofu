import type { Metadata } from 'next'
import Link from 'next/link'
import { plans } from '@/content'
import { Ladder } from '@/components/Ladder'
import { Body, Eyebrow, Heading, Meta, Num, Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Plans — ₹155 to ₹765 a week',
  description: 'Four weekly tofu plans, delivered Tuesday and Friday. No payment during the pilot, and no lock-in ever.',
}

export default function PlansPage() {
  return (
    <>
      <Section ground="indigo" className="pt-8">
        <Eyebrow tone="marigold">PLANS</Eyebrow>
        <Heading as="h1" size="lg" className="mt-2">
          Only as much as you need.
        </Heading>
        <Body className="mt-3 text-cream/80">
          Every plan pauses any week, skips any delivery and cancels any time. No joining fee and no lock-in — we are
          asking strangers to trust a brand that does not exist yet, so the least we can do is make leaving easy.
        </Body>
      </Section>

      <Section ground="paper">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <div key={p.name} className={`border-2 p-4 ${p.packs === 4 ? 'border-vermilion' : 'border-stone'}`}>
              <Meta className="text-grey-warm">
                {p.packs} PACKS / WEEK{p.packs === 4 ? '  · MOST COMMON' : ''}
              </Meta>
              <h2 className="mt-1 font-display text-sku uppercase text-ink">{p.name}</h2>
              <p className="mt-3 font-display text-[26px] leading-none text-vermilion">
                <Num>₹{p.price}</Num>
                <span className="ml-1 font-mono text-[11px] text-grey-warm">/ WEEK</span>
              </p>
              <p className="mt-3 text-body-sm text-grey-warm-dark">{p.who}</p>
            </div>
          ))}
        </div>
        <Meta className="mt-4 text-grey-warm">
          MIXED BASKET · 10% SUBSCRIBER DISCOUNT APPLIED · DELIVERED TUE &amp; FRI, 6–9 PM
        </Meta>
      </Section>

      <Section ground="indigo">
        <Eyebrow tone="marigold">BEFORE WE LAUNCH</Eyebrow>
        <Heading size="md" className="mt-2">
          The first 100 people are Founding Members
        </Heading>
        <Body className="mb-5 mt-2 text-cream/75">
          We are not taking any money yet. Sign up now and we message you once, on launch day, with your coupon.
        </Body>
        <Ladder />
        <Link href="/#form" className="mt-6 inline-block font-mono text-[12px] uppercase tracking-[0.12em] text-marigold underline">
          Get your coupon →
        </Link>
      </Section>
    </>
  )
}
