import { NextResponse } from 'next/server'
import { and, count, eq, isNull } from 'drizzle-orm'
import { db, schema } from '@/db'
import { isServed, zoneForPincode, outOfZone, scarcity } from '@/content'
import { FOUNDING_LIMIT, foundingSlotsLeft } from '@/lib/ladder'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The scarcity counter and the out-of-zone progress both come from here rather
 * than from the browser. The number of founding slots left is a real count of
 * rows; a client-side decrement would be a lie dressed as urgency.
 */
async function payload(pincode: string | null) {
  const conn = db()
  const [all] = await conn
    .select({ n: count() })
    .from(schema.signups)
    .where(isNull(schema.signups.deletedAt))

  const taken = Math.min(all?.n ?? 0, FOUNDING_LIMIT)
  const base = {
    taken,
    left: foundingSlotsLeft(all?.n ?? 0),
    limit: FOUNDING_LIMIT,
    updatedLine: scarcity.updatedLine,
    threshold: outOfZone.threshold,
  }

  if (!pincode) return { ...base, served: null as boolean | null }

  const served = isServed(pincode)
  if (served) {
    // Slots left in this pincode specifically — what the in-zone card shows.
    const [here] = await conn
      .select({ n: count() })
      .from(schema.signups)
      .where(and(eq(schema.signups.pincode, pincode), isNull(schema.signups.deletedAt)))
    return { ...base, served: true, zone: zoneForPincode(pincode), hereTaken: here?.n ?? 0 }
  }

  const [asked] = await conn
    .select({ n: count() })
    .from(schema.pincodeRequests)
    .where(eq(schema.pincodeRequests.pincode, pincode))
  return { ...base, served: false, zone: null, requests: asked?.n ?? 0 }
}

export async function GET(request: Request) {
  const pincode = new URL(request.url).searchParams.get('pincode')
  const clean = pincode && /^\d{6}$/.test(pincode) ? pincode : null
  try {
    return NextResponse.json(await payload(clean))
  } catch (error) {
    console.error('slots lookup failed', error)
    // Degrade to the static answer rather than failing the page: the zone map
    // ships in the bundle, so we can still tell them whether we deliver.
    return NextResponse.json({
      served: clean ? isServed(clean) : null,
      zone: clean ? zoneForPincode(clean) : null,
      left: null,
      taken: null,
      limit: FOUNDING_LIMIT,
      threshold: outOfZone.threshold,
      updatedLine: scarcity.updatedLine,
    })
  }
}

/**
 * Records an out-of-zone ask and returns this person's place in the queue for
 * that pincode. Out of zone is a conversion state, not an error — we capture
 * the pincode regardless, because it is how we decide where to open next.
 */
export async function POST(request: Request) {
  const { pincode } = (await request.json().catch(() => ({}))) as { pincode?: string }
  if (typeof pincode !== 'string' || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ error: '6 digits chahiye' }, { status: 400 })
  }

  try {
    if (!isServed(pincode)) {
      await db().insert(schema.pincodeRequests).values({ pincode })
    }
    return NextResponse.json(await payload(pincode))
  } catch (error) {
    console.error('could not record pincode request', error)
    return NextResponse.json({
      served: isServed(pincode),
      zone: zoneForPincode(pincode),
      requests: null,
      threshold: outOfZone.threshold,
      left: null,
      taken: null,
      limit: FOUNDING_LIMIT,
      updatedLine: scarcity.updatedLine,
    })
  }
}
