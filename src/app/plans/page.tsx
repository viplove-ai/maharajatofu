import type { Metadata } from 'next'
import Link from 'next/link'
import { PLANS } from '@/lib/plans'
import { COHORTS, FOUNDING_LIMIT } from '@/lib/coupon'
import { StickyBar } from '@/components/StickyBar'
import { Card, Eyebrow, H1, H2, Prose, Section, Wrap } from '@/components/ui'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Plans — pause any week, cancel any time',
  description: 'Four weekly tofu plans from ₹155, delivered Tuesday and Friday in Noida 62 and Vasundhara. No lock-in.',
}

export default function PlansPage() {
  return (
    <>
      <Section className="pt-12">
        <Wrap>
          <Eyebrow>Plans</Eyebrow>
          <H1>Pick a plan. Change it whenever.</H1>
          <Prose>
            <p className="mt-4 text-muted">
              Every plan pauses any week, skips any delivery and cancels any time. There is no lock-in and no joining fee
              — we&rsquo;re asking strangers to trust a brand that doesn&rsquo;t exist yet, so the least we can do is make
              leaving easy.
            </p>
          </Prose>
        </Wrap>
      </Section>

      <Section>
        <Wrap className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <Card key={p.id} className={p.id === 'thrice' ? 'border-accent' : ''}>
              <p className="font-mono text-[11px] uppercase tracking-[0.11em] text-muted">
                {p.deliveriesPerWeek} {p.deliveriesPerWeek === 1 ? 'delivery' : 'deliveries'} a week
                {p.id === 'thrice' && ' · most common'}
              </p>
              <h3 className="mt-1 font-display text-xl font-semibold">{p.name}</h3>
              <p className="mt-3 font-mono text-2xl font-semibold">₹{p.pricePerWeek}</p>
              <p className="font-mono text-xs text-muted">{p.packsPerWeek} packs a week</p>
              <p className="mt-3 text-sm text-muted">{p.blurb}</p>
            </Card>
          ))}
        </Wrap>
        <Wrap>
          <p className="mt-4 text-sm text-muted">
            Mixed Classic and Masala basket, with the 10% subscriber discount already applied. Delivered every{' '}
            {SITE.batchDays}.
          </p>
        </Wrap>
      </Section>

      <Section className="border-b-0">
        <Wrap>
          <Eyebrow>Before we launch</Eyebrow>
          <H2>The early-bird ladder</H2>
          <p className="mb-6 mt-2 max-w-measure text-muted">
            We&rsquo;re not taking any money yet. Sign up now and we&rsquo;ll message you once, on launch day, with a
            coupon. Our batch capacity really is limited, so the first {FOUNDING_LIMIT} places really do run out.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="border-accent">
              <p className="font-mono text-[11px] uppercase tracking-[0.11em] text-accent">Signups 1–{FOUNDING_LIMIT}</p>
              <h3 className="mt-1 font-display text-lg font-semibold">Founding Member</h3>
              <p className="mt-2 text-sm text-muted">
                A coupon for your first order, a free Masala Tofu pack, and your subscription price locked for three
                months.
              </p>
            </Card>
            <Card>
              <p className="font-mono text-[11px] uppercase tracking-[0.11em] text-muted">Signups {FOUNDING_LIMIT + 1}+</p>
              <h3 className="mt-1 font-display text-lg font-semibold">Early Bird</h3>
              <p className="mt-2 text-sm text-muted">{COHORTS.b.label}. Still worth having, and clearly second.</p>
            </Card>
            <Card>
              <p className="font-mono text-[11px] uppercase tracking-[0.11em] text-muted">Anyone who refers</p>
              <h3 className="mt-1 font-display text-lg font-semibold">Padosi Bonus</h3>
              <p className="mt-2 text-sm text-muted">
                A free pack when a neighbour from your society signs up too. Deliveries to one society cost us far less,
                so we&rsquo;d rather share that than keep it.
              </p>
            </Card>
          </div>
          <Link href="/protein-calculator" className="mt-6 inline-block font-semibold underline">
            Work out your plan and claim a coupon →
          </Link>
        </Wrap>
      </Section>
      <StickyBar href="/protein-calculator" label="Get early-bird coupon" />
    </>
  )
}
