import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/site'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: { type: 'website', siteName: SITE.name, locale: 'en_IN' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2f3ee' },
    { media: '(prefers-color-scheme: dark)', color: '#131725' },
  ],
}

const NAV = [
  { href: '/classic-tofu', label: 'Classic' },
  { href: '/masala-tofu', label: 'Masala' },
  { href: '/protein-calculator', label: 'Calculator' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/plans', label: 'Plans' },
  { href: '/kitchen', label: 'Our kitchen' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>
        <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
          <nav className="mx-auto flex h-14 max-w-5xl items-center gap-5 overflow-x-auto px-5">
            <Link href="/" className="whitespace-nowrap font-display text-lg font-bold tracking-tight">
              Maharaja <span className="text-accent">Tofu</span>
            </Link>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap text-sm text-muted hover:text-ink">
                {n.label}
              </Link>
            ))}
          </nav>
        </header>

        <main>{children}</main>

        <footer className="border-t border-line py-10 text-sm text-muted">
          <div className="mx-auto max-w-5xl space-y-3 px-5">
            <p className="font-display text-base font-semibold text-ink">Maharaja Tofu</p>
            <p>
              Made fresh in Sector 10, Ghaziabad, every {SITE.batchDays}. Delivered in Noida Sector 62, Vasundhara,
              Indirapuram and nearby.
            </p>
            <p>{SITE.fssai}</p>
            <p className="flex flex-wrap gap-4">
              <Link href="/privacy" className="underline">
                Privacy
              </Link>
              <Link href="/bulk" className="underline">
                For gyms &amp; kitchens
              </Link>
              <WhatsAppButton message="Hi! Maharaja Tofu ke baare mein jaanna hai." className="underline">
                WhatsApp us
              </WhatsAppButton>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
