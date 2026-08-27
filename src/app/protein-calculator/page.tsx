import type { Metadata } from 'next'
import { CalculatorSignup } from '@/components/CalculatorSignup'
import { StickyBar } from '@/components/StickyBar'
import { Eyebrow, H1, Prose, Section, Wrap } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Protein calculator — how much tofu does your house need?',
  description:
    'Tell us how much paneer you buy, or how you cook, and we work out the packs per week — using real Indian portions, not people times meals times 100 g.',
}

export default function CalculatorPage() {
  return (
    <>
      <Section className="pt-12">
        <Wrap>
          <Eyebrow>The calculator</Eyebrow>
          <H1>How much tofu does your house actually need?</H1>
          <Prose>
            <p className="mt-4 text-muted">
              Most calculators multiply people by meals by 100 g. That is wrong for an Indian kitchen: a shared sabzi for
              four uses 250–300 g in total, about 60 g a head, while a tikka plate is a personal 110 g portion and an
              eight-year-old eats under half of what an adult does. This one accounts for all of that — and rounds down
              rather than up, because thrown-away tofu is why people quit tofu.
            </p>
          </Prose>
        </Wrap>
      </Section>
      <Section className="border-b-0">
        <Wrap>
          <CalculatorSignup />
        </Wrap>
      </Section>
      <StickyBar href="#signup" />
    </>
  )
}
