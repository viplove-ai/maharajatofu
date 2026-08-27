'use client'

import { useState } from 'react'
import { faqs } from '@/content'

/** Six accordion rows. Native details/summary would not let the + turn vermilion. */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="border-t-2 border-indigo">
      {faqs.map((f, i) => (
        <div key={f.q} className="border-b border-stone">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            aria-controls={`faq-${i}`}
            className="flex min-h-target w-full items-center justify-between gap-4 py-3.5 text-left"
          >
            <span lang="hi" className="font-headline text-[16px] font-bold text-ink">
              {f.q}
            </span>
            <span className="font-mono text-[18px] leading-none text-vermilion" aria-hidden>
              {open === i ? '−' : '+'}
            </span>
          </button>
          {open === i && (
            <p id={`faq-${i}`} className="pb-4 text-body-sm text-slate">
              {f.a}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
