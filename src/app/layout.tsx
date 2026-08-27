import type { Metadata, Viewport } from 'next'
import { brand } from '@/content'
import { fontVariables } from '@/lib/fonts'
import { PilotProvider } from '@/lib/store'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { StickyBar } from '@/components/StickyBar'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maharajatofu.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${brand.name} — ${brand.claim.latin}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.heroSub,
  openGraph: { type: 'website', siteName: brand.name, locale: 'en_IN' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#14224A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={fontVariables}>
      <body>
        <PilotProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
          <StickyBar />
        </PilotProvider>
      </body>
    </html>
  )
}
