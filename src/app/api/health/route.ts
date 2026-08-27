import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/** Fly's http_service check hits this. Deliberately does not touch the database:
 *  a Neon hiccup should not cause Fly to cycle a machine that is serving pages fine. */
export function GET() {
  return NextResponse.json({ status: 'ok' })
}
