import raw from './content.json'

/**
 * content.json is the source of truth for copy, areas, pincode zones, plans,
 * FAQs and recipes — it ships from the design handoff and the Hinglish in it is
 * final. Nothing here rewrites a string; this module only types it and adds the
 * lookups the app needs.
 */

export interface Product {
  slug: string
  name: string
  sku: 'classic' | 'masala' | 'block'
  price: number
  netQty: string
  perKg: number
  ingredients: string[]
  allergen: string
  per100g: {
    kcal: number
    protein: number
    fat: number
    satFat: number
    transFat: number
    cholesterol: number
    carb: number
    sugars: number
    sodium: number
  }
  line: string
  [k: string]: unknown
}

export interface PlanTier {
  packs: number
  name: string
  price: number
  who: string
}

export interface Recipe {
  slug: string
  name: string
  minutes: number
  packs: number
  tag: 'quick' | 'family'
  serves?: number
  proteinPerPortion?: number
  kcalPerPortion?: number
  paneerKcalPerPortion?: number
  steps?: string[]
}

export interface Faq {
  q: string
  a: string
}

export const content = raw as unknown as {
  brand: {
    name: string
    devanagari: string
    domain: string
    claim: { hi: string; latin: string }
    heroHeadline: { line1: string; line2: string }
    heroSub: string
    address: string
    fssai: string
    whatsapp: string
    whatsappPrefill: string
    founders: { name: string; role: string }[]
    batchDays: string
    deliveryDays: string
    launchDate: string
    visitSlots: string
  }
  products: Product[]
  comparison: {
    tofu: { serving: string; kcal: number; protein: number; satFat: number; cholesterol: number }
    paneer: { serving: string; kcal: number; protein: number; satFat: number; cholesterol: number }
    paneerRetailPerKg: string
    honesty: string
    source: string
  }
  plans: PlanTier[]
  areas: string[]
  pincodeZone: Record<string, string>
  outOfZone: { threshold: number; copy: { headline: string; body: string; cta: string } }
  form: {
    headline: string
    sub: string
    labels: Record<string, string>
    intents: { key: string; label: string }[]
    consent: { ticked: boolean; label: string; sub: string }
    submit: { idle: string; loading: string; done: string }
    errors: { phone: string; consent: string }
  }
  ladder: { rank: string; name: string; perks: string[] }[]
  scarcity: { capacity: string; updatedLine: string; forbidden: string[] }
  faqs: Faq[]
  recipes: Recipe[]
  recipesNote: string
  privacy: { keeps: string[]; uses: string[]; rules: string[] }
}

export const { brand, products, comparison, plans, areas, pincodeZone, outOfZone, form, ladder, scarcity, faqs, recipes, recipesNote, privacy } = content

/** Environment wins over the placeholder strings in content.json. */
export const FSSAI = process.env.NEXT_PUBLIC_FSSAI || brand.fssai
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || brand.whatsapp

export function whatsappLink(message: string = brand.whatsappPrefill): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`
}

/** Static zone lookup — no round trip needed, the map ships with the bundle. */
export function zoneForPincode(pincode: string): string | null {
  return pincodeZone[pincode] ?? null
}

export function isServed(pincode: string): boolean {
  return zoneForPincode(pincode) !== null
}

export function productBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function recipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug)
}

export function planByPacks(packs: number): PlanTier {
  let plan = plans[0]
  for (const p of plans) if (packs >= p.packs) plan = p
  return plan
}

export const LAUNCH_DATE = new Date(brand.launchDate)

export function launchDateLabel(): string {
  return LAUNCH_DATE.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}
