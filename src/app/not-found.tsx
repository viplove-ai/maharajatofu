import Link from 'next/link'
import { H1, Prose, Section, Wrap } from '@/components/ui'

export default function NotFound() {
  return (
    <Section className="border-b-0 pt-16">
      <Wrap className="max-w-2xl">
        <H1>Yeh page nahi mila.</H1>
        <Prose>
          <p className="mt-4 text-muted">
            The link is wrong, or we moved something. The{' '}
            <Link href="/recipes" className="underline">
              recipes
            </Link>{' '}
            and the{' '}
            <Link href="/protein-calculator" className="underline">
              calculator
            </Link>{' '}
            are the two things most people are looking for.
          </p>
        </Prose>
      </Wrap>
    </Section>
  )
}
