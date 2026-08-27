import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, schema } from '@/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Backs the recognised arrival at /r/[token]. Returns only what the page needs
 * to greet somebody and pre-fill a form — never the referrer's phone number.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  try {
    const [referrer] = await db()
      .select()
      .from(schema.signups)
      .where(eq(schema.signups.referralToken, token))
      .limit(1)

    if (!referrer || referrer.deletedAt) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    return NextResponse.json({
      referrer: referrer.name,
      society: referrer.society,
      area: referrer.area,
      pincode: referrer.pincode,
      plan: referrer.plan,
      packs: referrer.packs,
    })
  } catch (error) {
    console.error('referral lookup failed', error)
    return NextResponse.json({ error: 'lookup failed' }, { status: 500 })
  }
}
