import type { Metadata } from 'next'
import Link from 'next/link'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Card, Eyebrow, H1, H2, Prose, Section, Wrap } from '@/components/ui'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'You’re on the list',
  robots: { index: false },
}

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; tier?: string; again?: string }>
}) {
  const { code, tier, again } = await searchParams
  const founding = tier === 'founding'

  return (
    <Section className="border-b-0 pt-12">
      <Wrap className="max-w-2xl">
        <Eyebrow>{again ? 'You were already on the list' : 'Done'}</Eyebrow>
        <H1>{founding ? 'You’re a Founding Member.' : 'You’re on the list.'}</H1>

        {code && (
          <Card className="mt-6 border-accent">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Your coupon code</p>
            <p className="mt-1 font-mono text-3xl font-semibold text-accent">{code}</p>
            <p className="mt-2 text-sm text-muted">
              Screenshot this. We&rsquo;ll message it to you as well, and it applies to your first order on launch day.
            </p>
          </Card>
        )}

        {/* The confirmation step: two tiny actions that cost effort, which is
            exactly what separates real intent from an idle tap. */}
        <Card className="mt-4 border-plant">
          <H2>One more thing — it takes ten seconds</H2>
          <Prose>
            <p className="mt-3 text-muted">
              We&rsquo;re about to WhatsApp you. <strong>Save our number</strong> and{' '}
              <strong>reply with your society name</strong> — we can only message people who have saved us, and knowing
              your society is how we group deliveries so they arrive on time.
            </p>
          </Prose>
          <WhatsAppButton
            message={`Hi! Main list par hoon${code ? ` — coupon ${code}` : ''}. Meri society hai: `}
            className="mt-4 inline-flex min-h-[48px] items-center rounded bg-plant px-6 font-semibold text-white"
          >
            Message us on WhatsApp
          </WhatsAppButton>
        </Card>

        <Card className="mt-4">
          <H2>Know a neighbour who&rsquo;d want this?</H2>
          <Prose>
            <p className="mt-3 text-muted">
              If someone from your society signs up too, you both get a free pack. Deliveries to one society cost us a
              fraction of scattered ones — we&rsquo;d rather pass that on than keep it.
            </p>
          </Prose>
          <WhatsAppButton
            message={`Maharaja Tofu — fresh tofu, Ghaziabad se, ${SITE.batchDays} delivery. Wahi sabzi, aadhi calories. maharajatofu.com`}
            className="mt-4 inline-flex min-h-[48px] items-center rounded border border-line px-6 font-semibold"
          >
            Share with a neighbour
          </WhatsAppButton>
        </Card>

        <p className="mt-6 text-sm text-muted">
          While you wait, have a look at{' '}
          <Link href="/recipes" className="underline">
            the sixteen recipes
          </Link>{' '}
          — the five-minute bhurji is the one everybody makes first.
        </p>
      </Wrap>
    </Section>
  )
}
