import type { Metadata } from 'next'
import { BulkForm } from '@/components/BulkForm'
import { Card, Eyebrow, H1, H2, Prose, Section, Wrap } from '@/components/ui'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Bulk tofu for gyms, cafés and cloud kitchens',
  description: 'One kilo blocks of fresh tofu, delivered twice a week on a standing order in Noida and Ghaziabad.',
}

export default function BulkPage() {
  return (
    <>
      <Section className="pt-12">
        <Wrap>
          <Eyebrow>For gyms, cafés and cloud kitchens</Eyebrow>
          <H1>One kilo blocks. Standing order. Twice a week.</H1>
          <Prose>
            <p className="mt-4 text-muted">
              Fresh tofu delivered every {SITE.batchDays} morning, made the same day. No cold-chain gap, no packaging you
              have to unwrap forty times, and a batch code on every block so your own food-safety records stay clean.
            </p>
          </Prose>
        </Wrap>
      </Section>

      <Section>
        <Wrap className="grid gap-4 sm:grid-cols-3">
          <Card>
            <h2 className="font-display text-lg font-semibold">₹240–260 a kilo</h2>
            <p className="mt-2 text-sm text-muted">
              Depending on volume and how often. Tell us what you pay for paneer today and we&rsquo;ll be straight with
              you about whether we can beat it.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-lg font-semibold">Taste it first</h2>
            <p className="mt-2 text-sm text-muted">
              We bring a sample block to every first meeting. Nobody should sign a standing order for something they have
              not cooked with.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-lg font-semibold">A high-protein menu line</h2>
            <p className="mt-2 text-sm text-muted">
              For a gym café, tofu is the item members ask for and nobody local stocks fresh. We&rsquo;ll share the
              recipes that sell.
            </p>
          </Card>
        </Wrap>
      </Section>

      <Section className="border-b-0">
        <Wrap className="max-w-2xl">
          <H2>Tell us what you need</H2>
          <p className="mb-6 mt-2 text-muted">We call back within a day, usually the same one.</p>
          <BulkForm />
        </Wrap>
      </Section>
    </>
  )
}
