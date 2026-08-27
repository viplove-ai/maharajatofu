import type { Metadata } from 'next'
import { FSSAI, brand } from '@/content'
import { BulkForm } from '@/components/BulkForm'
import { Photo } from '@/components/Photo'
import { Body, Eyebrow, Heading, Meta, Num, Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Bulk tofu for gyms, cafés & cloud kitchens',
  description: '1 kg blocks pressed to your delivery day. Slab pricing from ₹340/kg, monthly invoicing, lab report with every quote.',
}

const SLABS = [
  { range: '5–10 kg', price: '₹340 / kg' },
  { range: '10–25 kg', price: '₹315 / kg' },
  { range: '25 kg +', price: 'Talk to Ritu' },
]

/** The only page authored laptop-first: form left, proof right, no scrolling to compare. */
export default function BulkPage() {
  return (
    <>
      <Section ground="indigo" className="pt-8">
        <Eyebrow tone="marigold">FOR GYMS, CAFÉS &amp; CLOUD KITCHENS</Eyebrow>
        <Heading as="h1" size="lg" className="mt-2">
          1 kg blocks, pressed to your delivery day.
        </Heading>
        <Body className="mt-3 text-cream/80">
          One kilo yields about 34 portions of 30 g. It holds its cut in a gravy and on a griddle, arrives on two fixed
          batch days, and invoices monthly. The FSSAI licence and our lab report go out attached to every quote.
        </Body>
        <Meta className="mt-4 text-cream/50">FSSAI LIC. NO. {FSSAI} · {brand.batchDays.toUpperCase()}</Meta>
      </Section>

      <Section ground="paper">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Heading size="md" className="text-ink">
              Tell us what you need.
            </Heading>
            <p className="mb-5 mt-1.5 text-body-sm text-grey-warm-dark">We call back within a day, usually the same one.</p>
            <BulkForm />
          </div>

          <aside className="space-y-5">
            <div className="border-2 border-indigo">
              <div className="bg-indigo px-4 py-2">
                <Meta className="text-marigold">PUBLISHED SLAB PRICING</Meta>
              </div>
              <dl className="divide-y divide-stone">
                {SLABS.map((s) => (
                  <div key={s.range} className="flex items-center justify-between px-4 py-3">
                    <dt className="font-mono text-[13px] uppercase text-grey-warm-dark">{s.range}</dt>
                    <dd className="font-display text-[17px] text-ink">
                      <Num>{s.price}</Num>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <Photo caption="A 1 kg block being cut on a commercial board" src="/img/block-1kg.svg" />
            <Meta className="text-grey-warm">
              YIELD · ~34 PORTIONS OF 30 G PER KG · MONTHLY INVOICING · SAMPLE BLOCK AT EVERY FIRST MEETING
            </Meta>
          </aside>
        </div>
      </Section>
    </>
  )
}
