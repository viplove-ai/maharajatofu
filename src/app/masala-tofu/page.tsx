import type { Metadata } from 'next'
import { ProductPage } from '@/components/ProductPage'

export const metadata: Metadata = {
  title: 'Masala Tofu — ₹99 for 200 g, ready to eat',
  description: 'Pre-marinated achaari-tandoori tofu. Open the lid and eat it — hot, cold, or straight into your Maggi.',
}

export default function Page() {
  return <ProductPage slug="masala-tofu" />
}
