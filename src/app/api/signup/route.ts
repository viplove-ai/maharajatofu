import { NextResponse } from 'next/server'
import { count, eq, isNull } from 'drizzle-orm'
import { db, schema } from '@/db'
import { signupSchema } from '@/lib/validation'
import { CONSENT_RECORD } from '@/lib/consent'
import { cohortForPhone, couponCode, referralToken, tierForRank } from '@/lib/ladder'

export const runtime = 'nodejs'
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

    // Signing up twice is a returning visitor, not an error. Hand back the rank
    // and coupon they already hold — never a duplicate-key page, and never a
    // second row that would push everybody else down the ladder.
    const [existing] = await conn
      .select()
      .from(schema.signups)
      .where(eq(schema.signups.phone, input.phone))
      .limit(1)

    if (existing && !existing.deletedAt) {
      return NextResponse.json({
        alreadySignedUp: true,
        rank: existing.seq,
        code: existing.couponCode,
        tier: existing.tier,
        plan: existing.plan,
        token: existing.referralToken,
      })
    }

    // seq is a serial, so the rank is only knowable after the insert. Write with
    // a unique placeholder, then stamp the real coupon from the assigned rank.
    const [row] = await conn
      .insert(schema.signups)
      .values({
        name: input.name,
        phone: input.phone,
        area: input.area,
        pincode: input.pincode,
        plan: input.plan ?? null,
        packs: input.packs ?? null,
        intent: input.intent,
        consent: true,
        consentText: CONSENT_RECORD,
        couponCode: `pending-${input.phone}`,
        couponCohort: cohortForPhone(input.phone),
        tier: 'early_bird',
        referralToken: referralToken(),
        referredBy: input.referredBy ?? null,
        calculatorSnapshot: input.calculatorSnapshot ?? null,
        attribution: input.attribution ?? null,
      })
      .returning()

    const rank = row.seq
    const tier = tierForRank(rank)
    const code = couponCode(input.name, rank)

    const [final] = await conn
      .update(schema.signups)
      .set({ couponCode: code, tier })
      .where(eq(schema.signups.id, row.id))
      .returning()

    return NextResponse.json(
      { rank, code: final.couponCode, tier: final.tier, plan: final.plan, token: final.referralToken },
      { status: 201 },
    )
  } catch (error) {
    console.error('signup failed', error)
    return NextResponse.json(
      { error: 'नहीं गया — पर आपका data सुरक्षित है' },
      { status: 500 },
    )
  }
}

/** Total signups, for the honest scarcity counter. Never generated client-side. */
export async function GET() {
  try {
    const [row] = await db()
      .select({ n: count() })
      .from(schema.signups)
      .where(isNull(schema.signups.deletedAt))
    return NextResponse.json({ signups: row?.n ?? 0 })
  } catch {
    // A counter is not worth a 500 on the landing page.
    return NextResponse.json({ signups: null })
  }
}
