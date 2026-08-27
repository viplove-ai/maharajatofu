import type { MetadataRoute } from 'next'
import { recipes } from '@/content'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maharajatofu.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/classic-tofu', '/masala-tofu', '/protein-calculator', '/plans', '/recipes', '/bulk', '/kitchen', '/privacy']
  return [
    ...pages.map((p) => ({ url: `${SITE}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8 })),
    ...recipes.map((r) => ({ url: `${SITE}/recipes/${r.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
