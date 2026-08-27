import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db, schema } from '@/db'
import { planById } from '@/lib/plans'
import { areaById } from '@/lib/areas'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { Card, Eyebrow, H1, Prose, Section, Wrap } from '@/components/ui'

export const metadata: Metadata = { title: 'Your Maharaja Tofu link', robots: { index: false } }
export const dynamic = 'force-dynamic'

/**
 * The version of "don't ask twice" that actually works. Instagram never pushes
 * a visitor's identity to the site — so instead we carry a token back to it.
 * Anyone who came through a WhatsApp chat or a Meta Instant Form gets a personal
 * link, and this page recognises them rather than showing a form again.
 */
export default async function PersonalLinkPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  let row
  try {
    ;[row] = await db()
      .select()
      .from(schema.signups)
      .where(eq(schema.signups.couponCode, code.toUpperCase()))
      .limit(1)
  } catch {
    notFound()
  }
  if (!row || row.deletedAt) notFound()

  const plan = row.plan ? planById(row.plan) : undefined
  const area = areaById(row.area)

  return (
    <Section className="border-b-0 pt-12">
      <Wrap className="max-w-2xl">
        <Eyebrow>{row.tier === 'founding' ? 'Founding Member' : 'Early Bird'}</Eyebrow>
        <H1>Namaste, {row.name}.</H1>
        <Prose>
          <p className="mt-4 text-muted">
            You&rsquo;re on the list — nothing to fill in again. We&rsquo;ll message you the day we start delivering to{' '}
            {area?.label ?? row.area}.
          </p>
        </Prose>

        <Card className="mt-6 border-accent">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Your coupon</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-accent">{row.couponCode}</p>
          {plan && (
            <p className="mt-3 text-sm text-muted">
              Your plan: <strong className="text-ink">{plan.name}</strong> — {plan.packsPerWeek} packs a week, ₹
              {plan.pricePerWeek}. Change it any time by messaging us.
            </p>
          )}
        </Card>

        {!row.confirmedAt && (
          <Card className="mt-4 border-plant">
            <p className="font-display text-lg font-semibold">Save our number so we can reach you</p>
            <p className="mt-2 text-sm text-muted">
              WhatsApp only lets us message people who have saved us. Ten seconds now means you actually hear from us on
              launch day.
            </p>
            <WhatsAppButton
              message={`Hi! Coupon ${row.couponCode}. Meri society hai: `}
              className="mt-4 inline-flex min-h-[48px] items-center rounded bg-plant px-6 font-semibold text-white"
            >
              Message us
            </WhatsAppButton>
          </Card>
        )}

        <p className="mt-6 text-sm text-muted">
          Meanwhile:{' '}
          <Link href="/recipes" className="underline">
            sixteen recipes
          </Link>
          , starting with the five-minute bhurji.
        </p>
      </Wrap>
    </Section>
  )
}
