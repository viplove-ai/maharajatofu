import { NextResponse } from 'next/server'
import { count, eq, isNull } from 'drizzle-orm'
import { db, schema } from '@/db'
import { signupSchema } from '@/lib/validation'
import { CONSENT_RECORD } from '@/lib/consent'
import { cohortForPhone, couponCode, tierForSeq } from '@/lib/coupon'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Expected JSON' }, { status: 400 })
  }

  const parsed = signupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the form', fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }
  const input = parsed.data

  try {
    const conn = db()

    // Someone signing up twice is a returning visitor, not an error. Give them
    // the coupon they already have rather than a duplicate-key page.
    const [existing] = await conn
      .select()
      .from(schema.signups)
      .where(eq(schema.signups.phone, input.phone))
      .limit(1)

    if (existing && !existing.deletedAt) {
      return NextResponse.json(
        { alreadySignedUp: true, couponCode: existing.couponCode, tier: existing.tier, plan: existing.plan },
        { status: 200 },
      )
    }

    const cohort = cohortForPhone(input.phone)

    // seq is a serial, so the coupon number is only knowable after the insert.
    // Insert with a placeholder, then stamp the real code from the assigned seq.
    const [row] = await conn
      .insert(schema.signups)
      .values({
        name: input.name,
        phone: input.phone,
        area: input.area,
        pincode: input.pincode,
        plan: input.plan ?? null,
        intent: input.intent,
        consent: true,
        consentText: CONSENT_RECORD,
        couponCode: `pending-${input.phone}`,
        couponCohort: cohort,
        tier: 'early_bird',
        calculatorSnapshot: input.calculatorSnapshot ?? null,
        utm: input.utm ?? null,
      })
      .returning()

    const tier = tierForSeq(row.seq)
    const code = couponCode(row.seq, tier)

    const [finalRow] = await conn
      .update(schema.signups)
      .set({ couponCode: code, tier })
      .where(eq(schema.signups.id, row.id))
      .returning()

    return NextResponse.json(
      { couponCode: finalRow.couponCode, tier: finalRow.tier, cohort, plan: finalRow.plan },
      { status: 201 },
    )
  } catch (error) {
    console.error('signup failed', error)
    return NextResponse.json(
      { error: 'Kuch gadbad ho gayi. WhatsApp par message kar dijiye, hum add kar denge.' },
      { status: 500 },
    )
  }
}

/** Founding slots remaining — the scarcity counter on the site is real, so it
 *  is served from the table rather than hard-coded. */
export async function GET() {
  try {
    const [row] = await db()
      .select({ n: count() })
      .from(schema.signups)
      .where(isNull(schema.signups.deletedAt))
    return NextResponse.json({ signups: row?.n ?? 0 }, { headers: { 'Cache-Control': 'public, max-age=60' } })
  } catch {
    // A counter is not worth a 500 on the landing page.
    return NextResponse.json({ signups: null }, { status: 200 })
  }
}

export const runtime = 'nodejs'
