import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db, schema } from '@/db'
import { RecognisedArrival } from '@/components/RecognisedArrival'

export const metadata: Metadata = { title: 'For you', robots: { index: false } }
export const dynamic = 'force-dynamic'

/**
 * The recognised arrival. Instagram never pushes a visitor's identity to the
 * site — so instead we carry a token back to it. Whoever taps a forwarded link
 * arrives with their neighbour's area and plan already loaded, and nothing to
 * type but a single consent tick.
 */
export default async function ReferralPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  let referrer
  try {
    ;[referrer] = await db()
      .select()
      .from(schema.signups)
      .where(eq(schema.signups.referralToken, token))
      .limit(1)
  } catch {
    notFound()
  }
  if (!referrer || referrer.deletedAt) notFound()

  return (
    <RecognisedArrival
      token={token}
      referrer={referrer.name}
      society={referrer.society}
      area={referrer.area}
      pincode={referrer.pincode}
      plan={referrer.plan}
    />
  )
}
