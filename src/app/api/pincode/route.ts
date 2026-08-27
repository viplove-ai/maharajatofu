import { NextResponse } from 'next/server'
import { db, schema } from '@/db'
import { isServed } from '@/lib/areas'

export const dynamic = 'force-dynamic'

/**
 * Out-of-zone is a conversion opportunity, not an error. We record the pincode
 * either way — it maps demand outside the circle for free and tells us where to
 * open next. A pincode alone is not personal data, so nothing here needs consent.
 */
export async function POST(request: Request) {
  const { pincode } = (await request.json().catch(() => ({}))) as { pincode?: string }

  if (typeof pincode !== 'string' || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ error: 'Enter a 6-digit pincode' }, { status: 400 })
  }

  const served = isServed(pincode)
  if (!served) {
    try {
      await db().insert(schema.pincodeMisses).values({ pincode })
    } catch (error) {
      console.error('could not record pincode miss', error)
    }
  }
  return NextResponse.json({ served })
}
