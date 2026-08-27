import type { Metadata } from 'next'
import { FSSAI, brand } from '@/content'
import { Photo } from '@/components/Photo'
import { WhatsAppLink } from '@/components/WhatsApp'
import { Body, Eyebrow, Heading, Meta, Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Our kitchen — Sector 10, Ghaziabad',
  description: 'Two people, one kitchen, two batches a week. Saturday visits welcome — we mean that literally.',
}

export default function KitchenPage() {
  return (
    <>
      <Section ground="indigo" className="pt-8">
        <Eyebrow tone="marigold">THE KITCHEN</Eyebrow>
        <Heading as="h1" size="lg" className="mt-2">
          Two people, one kitchen, twice a week.
        </Heading>
        <Body className="mt-3 text-cream/80">
          {brand.founders.map((f) => `${f.name} ${f.role}`).join('; ')}. Not a factory and not a brand with a marketing
          department — which is exactly why we can tell you what is in it and when it was made.
        </Body>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Photo caption="Hands at the press, half past six in the morning" src="/img/press.svg" ratio="h-[168px]" priority />
          <Photo caption="Tubs going into the insulated delivery bag" src="/img/delivery-bag.svg" ratio="h-[168px]" />
        </div>
      </Section>

      <Section ground="paper">
        <Eyebrow tone="vermilion">HOW A BATCH RUNS</Eyebrow>
        <Body className="mt-3 text-grey-warm-dark">
          Soybeans soak overnight. We grind and boil them at 05:30, set the curd, press it, and it is in an insulated bag
          by the afternoon. Nothing is stored, nothing is frozen. What arrives on {brand.deliveryDays} was pressed that
          morning.
        </Body>
        <div className="mt-5 space-y-0.5">
          <Meta className="text-grey-warm">FSSAI LIC. NO. {FSSAI}</Meta>
          <Meta className="text-grey-warm">BATCH DAYS · {brand.batchDays.toUpperCase()}</Meta>
          <Meta className="text-grey-warm">DELIVERY · {brand.deliveryDays.toUpperCase()}</Meta>
          <Meta className="text-grey-warm">{brand.address.toUpperCase()}</Meta>
        </div>
      </Section>

      <Section ground="cream">
        <Eyebrow tone="vermilion">COME AND SEE IT</Eyebrow>
        <Heading size="md" className="mt-2 text-ink">
          The door is open on Saturdays.
        </Heading>
        <Body className="mt-2 text-grey-warm-dark">
          A standing invitation, not a figure of speech: {brand.visitSlots}. Ask for the water test report or the medical
          fitness certificates and we will send them — it is a fair thing to ask of anyone making your food.
        </Body>
        <WhatsAppLink
          message="Hello! I would like to see the kitchen — is a Saturday slot available?"
          className="mt-5 flex h-button w-full max-w-sm items-center justify-center bg-green px-5 font-headline text-[18px] font-extrabold text-white"
        >
          Ask for a Saturday slot
        </WhatsAppLink>
      </Section>
    </>
  )
}
