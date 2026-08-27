'use client'

import { useEffect } from 'react'
import { track, type EventName } from '@/lib/attribution'

/** Fires a page-view event for the named analytics events the pilot reports on. */
export function TrackView({ event, params }: { event: EventName; params?: Record<string, unknown> }) {
  useEffect(() => {
    track(event, params)
    // Fire once per mount; params is a fresh object each render and would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event])
  return null
}
