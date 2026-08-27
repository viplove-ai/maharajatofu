import type { MetadataRoute } from 'next'
import { RECIPES } from '@/content/recipes'
import { SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/classic-tofu', '/masala-tofu', '/protein-calculator', '/plans', '/recipes', '/bulk', '/kitchen', '/privacy']
  return [
    ...pages.map((p) => ({
      url: `${SITE.url}${p}`,
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 1 : 0.8,
    })),
    ...RECIPES.map((r) => ({
      url: `${SITE.url}/recipes/${r.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
