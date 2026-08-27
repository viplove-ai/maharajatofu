export const SITE = {
  name: 'Maharaja Tofu',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://maharajatofu.com',
  tagline: 'Wahi sabzi. Aadhi calories.',
  description:
    'Fresh soya tofu, made in Ghaziabad and delivered every Tuesday and Friday in Noida Sector 62 and Vasundhara. Three ingredients. Same protein as paneer, half the calories.',
  /** Replace with the real number before the site goes live. */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? '910000000000',
  /** Displayed in the footer and on every pack once registration comes through. */
  fssai: process.env.NEXT_PUBLIC_FSSAI ?? 'FSSAI registration in progress',
  batchDays: 'Tuesday & Friday',
} as const

export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`
}
