import Link from 'next/link'
import { Body, Eyebrow, Heading, Section } from '@/components/ui'

export default function NotFound() {
  return (
    <Section ground="paper" className="pt-12">
      <Eyebrow tone="vermilion">404</Eyebrow>
      <Heading as="h1" size="lg" className="mt-2 text-ink">
        That page does not exist.
      </Heading>
      <Body className="mt-3 text-grey-warm-dark">
        The link is wrong, or we moved something. Most people are looking for{' '}
        <Link href="/protein-calculator" className="underline">
          the calculator
        </Link>{' '}
        or{' '}
        <Link href="/recipes" className="underline">
          the recipes
        </Link>
        .
      </Body>
    </Section>
  )
}
