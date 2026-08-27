'use client'

import { brand, whatsappLink } from '@/content'

/**
 * Many people will message instead of filling the form. That is a success, not a
 * leak — an inbound WhatsApp message is a stronger signal than a form
 * submission, so the button is on every page rather than buried in a footer.
 */
export function WhatsAppLink({
  message = brand.whatsappPrefill,
  className = '',
  children,
  label = 'WhatsApp',
}: {
  message?: string
  className?: string
  children?: React.ReactNode
  label?: string
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={label}
    >
      {children ?? label}
    </a>
  )
}

export function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.2 1.28-1.96 1.4-.5.08-1.16.15-3.37-.72-2.84-1.1-4.66-3.97-4.8-4.16-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07 1-2.36.25-.28.55-.35.73-.35h.53c.17 0 .4-.06.62.48.24.57.8 1.97.87 2.11.07.14.12.31.02.5-.09.19-.14.31-.28.48l-.42.49c-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.93 1.93 1.22 2.2 1.36.28.14.44.12.6-.07.17-.19.7-.81.88-1.09.19-.28.37-.23.62-.14.25.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.68-.17 1.36Z" />
    </svg>
  )
}
