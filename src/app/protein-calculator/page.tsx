import type { Metadata } from 'next'
import { Calculator } from '@/components/Calculator'
import { Body, Eyebrow, Heading, Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Protein calculator — how much tofu do you need?',
  description:
    'Tell us how much paneer you buy, or how you cook, and we work out the packs a week — using real Indian portions, not people times meals times 100 g.',
}

export default function CalculatorPage() {
  return (
    <Section ground="paper" id="calculator" className="pt-8">
      <Eyebrow tone="vermilion">THE CALCULATOR</Eyebrow>
      <Heading as="h1" size="lg" className="mt-2 text-ink">
        Work out what you need.
      </Heading>
      <Body className="mb-6 mt-3 text-grey-warm-dark">
        Most calculators multiply people by meals by 100 g. That is wrong for an Indian kitchen: a shared sabzi for four
        uses 250–300 g in total, about 60 g a head, while a tikka plate is a personal 110 g portion and an eight-year-old
        eats under half of what an adult does. This one accounts for all of that — and rounds down rather than up,
        because thrown-away tofu is why people quit tofu.
      </Body>
      <Calculator standalone />
    </Section>
  )
}
