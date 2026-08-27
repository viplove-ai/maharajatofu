import type { Metadata } from 'next'
import { ProductPage } from '@/components/ProductPage'

export const metadata: Metadata = {
  title: 'Classic Firm Tofu — ₹79 for 200 g',
  description: 'Plain, firm, pressed tofu. Three ingredients, and it drops into any paneer recipe unchanged.',
}

export default function Page() {
  return <ProductPage slug="classic-tofu" />
}
