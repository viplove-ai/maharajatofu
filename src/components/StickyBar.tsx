'use client'

import { usePathname, useRouter } from 'next/navigation'
import { brand } from '@/content'
import { scrollToId } from '@/lib/store'
import { WhatsAppIcon, WhatsAppLink } from './WhatsApp'

/**
 * Present on every page. Mobile only, 56px of controls, pinned to the bottom
 * third where a thumb reaches one-handed — which is how nearly all of this
 * traffic arrives.
 */
export function StickyBar() {
  const pathname = usePathname()
  const router = useRouter()

  function toForm() {
    if (pathname === '/') {
      scrollToId('form')
    } else {
      router.push('/#form')
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t-[3px] border-indigo bg-cream p-2 md:hidden">
      <button
        onClick={toForm}
        className="h-sticky flex-1 bg-vermilion px-4 font-headline text-[17px] font-extrabold text-white"
      >
        Early-bird coupon लें
      </button>
      <WhatsAppLink
        message={brand.whatsappPrefill}
        label="WhatsApp par poochhiye"
        className="flex h-sticky w-sticky shrink-0 items-center justify-center bg-green text-white"
      >
        <WhatsAppIcon className="h-6 w-6" />
      </WhatsAppLink>
    </div>
  )
}
