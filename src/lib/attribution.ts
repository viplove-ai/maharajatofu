import type { Utm } from '@/db/schema'

const KEY = 'mt.utm'

/**
 * Instagram never tells the site who the visitor is — only which ad they came
 * from. This reads that much off the landing URL and keeps it, so every signup
 * row can be scored back to a creative. Without it, rotating six creatives
 * teaches you nothing.
 *
 * Read the `.id` parameters for anything you join on: `{{campaign.name}}`
 * returns whatever the campaign is called right now, so renaming one in week
 * four silently desyncs every historical row.
 */
export function captureUtm(search: string): Utm {
  const q = new URLSearchParams(search)
  const utm: Utm = {
    source: q.get('utm_source') ?? undefined,
    medium: q.get('utm_medium') ?? undefined,
    campaign: q.get('utm_campaign') ?? undefined,
    content: q.get('utm_content') ?? undefined,
    adId: q.get('ad_id') ?? undefined,
    placement: q.get('placement') ?? undefined,
    fbclid: q.get('fbclid') ?? undefined,
  }
  const present = Object.fromEntries(Object.entries(utm).filter(([, v]) => v)) as Utm

  if (typeof window === 'undefined') return present
  // First touch wins: the ad that earned the visit should keep the credit even
  // if the person wanders back later through a direct link.
  const stored = window.localStorage.getItem(KEY)
  if (stored) return JSON.parse(stored) as Utm
  if (Object.keys(present).length) window.localStorage.setItem(KEY, JSON.stringify(present))
  return present
}

export function storedUtm(): Utm {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? '{}') as Utm
  } catch {
    return {}
  }
}

/** Analytics events, named once so the site and the dashboards agree. */
export type EventName =
  | 'pincode_checked'
  | 'pincode_out_of_zone'
  | 'calculator_started'
  | 'calculator_completed'
  | 'plan_selected'
  | 'recipe_viewed'
  | 'whatsapp_clicked'
  | 'signup_submitted'
  | 'bulk_lead_submitted'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function track(event: EventName, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return
  window.gtag?.('event', event, params)
  window.fbq?.('trackCustom', event, params)
}
