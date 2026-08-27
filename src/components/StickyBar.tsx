'use client'

import Link from 'next/link'
import { WhatsAppButton } from './WhatsAppButton'

/**
 * Mobile only, and always in the bottom third: that is where a thumb reaches
 * one-handed, which is how almost all of this traffic arrives.
 */
export function StickyBar({ href = '/#signup', label = 'Get early-bird coupon' }: { href?: string; label?: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-surface p-3 md:hidden">
      <Link
        href={href}
        className="flex min-h-[48px] flex-1 items-center justify-center rounded bg-accent px-4 font-semibold text-white"
      >
        {label}
      </Link>
      <WhatsAppButton
        message="Hi! Maharaja Tofu ke baare mein jaanna hai."
        className="flex min-h-[48px] w-[48px] items-center justify-center rounded border border-line font-semibold"
      >
        <span aria-hidden>💬</span>
      </WhatsAppButton>
    </div>
  )
}
