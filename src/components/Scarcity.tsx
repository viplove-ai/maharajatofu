'use client'

import { useEffect, useState } from 'react'
import { scarcity } from '@/content'
import { FOUNDING_LIMIT } from '@/lib/ladder'
import { Meta, Num } from './ui'

/**
 * Honest scarcity. The number is served from the backend — a real count of rows
 * — and moves only when a batch is counted. Never a ticking clock, a midnight
 * reset, a client-side decrement or red flashing: the constraint is real, so it
 * does not need to be dramatised.
 */
export function Scarcity() {
  const [left, setLeft] = useState<number | null>(null)
  const [taken, setTaken] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/slots')
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.left === 'number') setLeft(d.left)
        if (typeof d.taken === 'number') setTaken(d.taken)
      })
      .catch(() => {
        /* the counter is not worth an error state on the landing page */
      })
  }, [])

  return (
    <div className="border border-marigold/50 bg-indigo-raise p-4">
      <p className="font-display text-[30px] leading-none text-marigold">
        <Num>{left ?? '—'}</Num>
      </p>
      <Meta className="mt-1 text-cream/70">FOUNDING SLOTS LEFT</Meta>

      <div className="mt-3 h-2 w-full bg-cream/20" role="presentation">
        <div
          className="h-2 bg-marigold"
          style={{ width: `${Math.min(100, ((taken ?? 0) / FOUNDING_LIMIT) * 100)}%` }}
        />
      </div>
      <Meta className="mt-1.5 text-cream/50">
        {taken ?? 0} OF {FOUNDING_LIMIT} CONFIRMED · {scarcity.updatedLine}
      </Meta>

      <p className="mt-3 text-body-sm text-cream/75">
        The constraint is real: {scarcity.capacity}. When 100 founding tubs are committed the ladder closes.
      </p>
    </div>
  )
}
