import type { Metadata } from 'next'
import { ProductPage } from '@/components/ProductPage'

export const metadata: Metadata = {
  title: 'Masala Tofu — ₹99 / 200 g',
  description: 'Pre-marinated achaari-tandoori tofu. Lid off, fork in — hot or cold, straight from the tub.',
}

export default function Page() {
  return <ProductPage slug="masala-tofu" />
}
