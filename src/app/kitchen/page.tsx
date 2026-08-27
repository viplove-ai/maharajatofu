import type { Metadata } from 'next'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { StickyBar } from '@/components/StickyBar'
import { Card, Eyebrow, H1, H2, Prose, Section, Wrap } from '@/components/ui'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Our kitchen in Sector 10, Ghaziabad',
  description: 'Two people, one kitchen, two batches a week. Come and see it if you like — we mean that.',
}

export default function KitchenPage() {
  return (
    <>
      <Section className="pt-12">
        <Wrap>
          <Eyebrow>Our kitchen</Eyebrow>
          <H1>Sector 10, Ghaziabad. Five in the morning, twice a week.</H1>
          <Prose>
            <p className="mt-4 text-muted">
              We are two people making tofu in a house and driving it to your door. Not a factory, not a brand with a
              marketing department — which is exactly why we can tell you what is in it and when it was made.
            </p>
            <p className="text-muted">
              Soybeans soak overnight. We grind and boil them in the morning, set the curd, press it, and it is in an
              insulated bag by the afternoon. Nothing is stored. Nothing is frozen. What you get on {SITE.batchDays} was
              made that morning.
            </p>
          </Prose>
        </Wrap>
      </Section>

      <Section>
        <Wrap className="grid gap-4 sm:grid-cols-3">
          <Card>
            <h2 className="font-display text-lg font-semibold">Every batch is logged</h2>
            <p className="mt-2 text-sm text-muted">
              Soak time, soy-milk temperature, coagulant, press weight, yield and a taste note. It is how batch forty
              tastes like batch four.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-lg font-semibold">Every tub is dated</h2>
            <p className="mt-2 text-sm text-muted">
              The make date is printed as prominently as the best-before, with a batch code. If something is ever wrong,
              we can trace it to the morning it happened.
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-lg font-semibold">You can visit</h2>
            <p className="mt-2 text-sm text-muted">
              This is a standing invitation, not a figure of speech. Message us and come and look at where your food is
              made.
            </p>
          </Card>
        </Wrap>
      </Section>

      <Section className="border-b-0">
        <Wrap>
          <H2>Licences and paperwork</H2>
          <Prose>
            <p className="mt-3 text-muted">
              {SITE.fssai}. Our licence number appears on every pack and in the footer of this site. Ask us for the water
              test report or the medical fitness certificates and we will send them — it is a fair thing to ask of anyone
              making your food.
            </p>
          </Prose>
          <WhatsAppButton
            message="Hi! Main kitchen dekhna chahta/chahti hoon."
            className="mt-5 inline-flex min-h-[48px] items-center rounded bg-accent px-6 font-semibold text-white"
          >
            Ask to visit the kitchen
          </WhatsAppButton>
        </Wrap>
      </Section>
      <StickyBar href="/protein-calculator" />
    </>
  )
}
