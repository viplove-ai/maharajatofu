'use client'

import { scrollToId } from '@/lib/store'

/** Scrolls to the calculator with the 60px offset. Never scrollIntoView. */
export function HeroCta() {
  return (
    <button
      onClick={() => scrollToId('calculator')}
      className="flex h-button w-full items-center justify-between bg-vermilion px-5 font-headline text-[19px] font-extrabold text-white"
    >
      <span lang="hi">कितना चाहिए? Calculate करें</span>
      <span aria-hidden>→</span>
    </button>
  )
}
