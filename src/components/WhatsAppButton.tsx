'use client'

import { SITE, whatsappLink } from '@/lib/site'
import { track } from '@/lib/attribution'

/**
 * Many people will skip the form entirely and message instead. That is fine —
 * an inbound WhatsApp message is a stronger signal than a form submission, so
 * the button is on every page rather than tucked into a contact section.
 */
export function WhatsAppButton({ message, className = '', children }: { message: string; className?: string; children?: React.ReactNode }) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_clicked')}
      className={className}
      aria-label={`Message ${SITE.name} on WhatsApp`}
    >
      {children ?? 'WhatsApp'}
    </a>
  )
}
