'use client'

import Link from 'next/link'
import { useState } from 'react'
import { brand } from '@/content'
import { Mark } from './Mark'
import { Meta } from './ui'

const LINKS = [
  { href: '/classic-tofu', label: 'Classic' },
  { href: '/masala-tofu', label: 'Masala' },
  { href: '/protein-calculator', label: 'Calculator' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/plans', label: 'Plans' },
  { href: '/kitchen', label: 'Kitchen' },
  { href: '/bulk', label: 'Bulk' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 bg-indigo text-cream">
      <div className="mx-auto flex h-[62px] max-w-shell items-center gap-3 px-5 md:px-10">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Mark />
          <span>
            <span className="block font-display text-[15px] uppercase leading-none tracking-[0.02em]">
              {brand.name}
            </span>
            <Meta className="mt-0.5 text-marigold">GHAZIABAD · 5 KM</Meta>
          </span>
        </Link>

        <nav className="ml-auto hidden gap-5 md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-[13.5px] text-cream/75 hover:text-cream">
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Menu"
          className="ml-auto flex h-target w-target flex-col items-center justify-center gap-[4px] md:hidden"
        >
          <span className="h-[2px] w-[22px] bg-cream" />
          <span className="h-[2px] w-[22px] bg-cream" />
          <span className="h-[2px] w-[22px] bg-cream" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-cream/20 px-5 pb-3 md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex min-h-target items-center border-b border-cream/10 text-[15px] text-cream/85"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
