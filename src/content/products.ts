export interface Product {
  slug: 'classic-tofu' | 'masala-tofu'
  name: string
  tagline: string
  price: number
  grams: number
  pricePerKg: number
  ingredients: string[]
  description: string
  /** Recipe slugs that lead with this SKU. */
  recipes: string[]
}

export const PRODUCTS: readonly Product[] = [
  {
    slug: 'classic-tofu',
    name: 'Classic Firm Tofu',
    tagline: 'Drops into any paneer recipe, unchanged',
    price: 79,
    grams: 200,
    pricePerKg: 395,
    ingredients: ['Soybean', 'Water', 'Coagulant'],
    description:
      'Plain, firm and pressed. Cube it, cook it exactly the way you cook paneer, and nobody at the table asks questions. Three ingredients, a batch number on every tub, and made the morning it reaches you.',
    recipes: ['tofu-butter-masala', 'palak-tofu', 'matar-tofu', 'tofu-tikka'],
  },
  {
    slug: 'masala-tofu',
    name: 'Masala Tofu',
    tagline: 'Open the lid. That is the whole recipe.',
    price: 99,
    grams: 200,
    pricePerKg: 495,
    ingredients: ['Soybean', 'Water', 'Coagulant', 'Achaari-tandoori masala', 'Cold-pressed mustard oil', 'Salt'],
    description:
      'Pressed harder and marinated in an achaari-tandoori masala, so it is ready to eat straight from the tub — hot or cold. Built for the people who are never going to press, marinate or plan.',
    recipes: ['protein-maggi', 'chatpata-tofu-chaat', 'leftover-roti-roll', 'peanut-chilli-tofu'],
  },
] as const

export function productBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

/** Typical NCR shelf price for branded paneer. Verify at two kirana shops and a
 *  supermarket before this appears anywhere in print. */
export const BRANDED_PANEER_PRICE_PER_KG = { low: 475, high: 500 }
