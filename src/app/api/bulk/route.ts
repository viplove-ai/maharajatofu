import { NextResponse } from 'next/server'
import { db, schema } from '@/db'
import { bulkLeadSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Expected JSON' }, { status: 400 })
  }

  const parsed = bulkLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check the form', fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  try {
    await db().insert(schema.bulkLeads).values({
      businessName: parsed.data.businessName,
      contactName: parsed.data.contactName,
      phone: parsed.data.phone,
      businessType: parsed.data.businessType,
      kgPerWeek: parsed.data.kgPerWeek ?? null,
      currentPaneerPricePerKg: parsed.data.currentPaneerPricePerKg ?? null,
      area: parsed.data.area ?? null,
      pincode: parsed.data.pincode ?? null,
      notes: parsed.data.notes ?? null,
      utm: parsed.data.utm ?? null,
    })
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('bulk lead failed', error)
    return NextResponse.json({ error: 'Could not save that. Please WhatsApp us instead.' }, { status: 500 })
  }
}
