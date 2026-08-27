import type { Metadata } from 'next'
import { ProductPage } from '@/components/ProductPage'

export const metadata: Metadata = {
  title: 'Classic Firm Tofu — ₹79 / 200 g',
  description: 'Soybean, water, coagulant. That is the whole list. Swaps into any paneer recipe 1:1.',
}

export default function Page() {
  return <ProductPage slug="classic-tofu" />
}
