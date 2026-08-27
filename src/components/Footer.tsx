import Link from 'next/link'
import { FSSAI, brand } from '@/content'
import { Meta } from './ui'

export function Footer() {
  return (
    <footer className="bg-indigo px-5 py-10 text-cream md:px-10">
      <div className="mx-auto max-w-shell">
        <p lang="hi" className="font-devanagari text-[22px]">
          {brand.devanagari}
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <Meta className="text-cream/45">PAGES</Meta>
            <ul className="mt-2 space-y-1.5">
              {[
                ['/classic-tofu', 'Classic Tofu'],
                ['/masala-tofu', 'Masala Tofu'],
                ['/protein-calculator', 'Calculator'],
                ['/recipes', 'Recipes'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="font-mono text-[11px] uppercase tracking-[0.1em] text-cream/70">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Meta className="text-cream/45">MORE</Meta>
            <ul className="mt-2 space-y-1.5">
              {[
                ['/plans', 'Plans'],
                ['/kitchen', 'Our kitchen'],
                ['/bulk', 'For gyms & cafés'],
                ['/privacy', 'Privacy'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="font-mono text-[11px] uppercase tracking-[0.1em] text-cream/70">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Meta className="text-cream/45">KITCHEN</Meta>
            <p className="mt-2 text-[12px] leading-[1.7] text-cream/70">{brand.address}</p>
          </div>
        </div>

        <div className="mt-8 border-t border-cream/15 pt-4">
          <Meta className="text-cream/50">FSSAI LIC. NO. {FSSAI}</Meta>
          <Meta className="text-cream/50">BATCH DAYS · {brand.batchDays.toUpperCase()}</Meta>
          <Meta className="text-cream/50">DELIVERY · {brand.deliveryDays.toUpperCase()}</Meta>
          <Meta className="mt-2 text-cream/35">© 2026 · PILOT BATCH 01</Meta>
        </div>
      </div>
    </footer>
  )
}
