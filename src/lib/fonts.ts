import { Archivo, Archivo_Black, IBM_Plex_Mono, Mukta, Yatra_One } from 'next/font/google'

/**
 * Four families, self-hosted by next/font so there is no render-blocking round
 * trip to Google and no FOIT — `display: swap` on every one. The CSS variables
 * are consumed by tailwind.config.ts, never by a component directly.
 */

/** Devanagari wordmark and the circular म mark only. Never body copy. */
export const yatraOne = Yatra_One({
  weight: '400',
  subsets: ['devanagari', 'latin'],
  display: 'swap',
  variable: '--f-devanagari',
})

/** Devanagari and Latin headlines, buttons, labels. Headlines are always 800. */
export const mukta = Mukta({
  weight: ['400', '600', '700', '800'],
  subsets: ['devanagari', 'latin'],
  display: 'swap',
  variable: '--f-headline',
})

/** English body copy. */
export const archivo = Archivo({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--f-body',
})

/** Latin display: numbers, SKU names, eyebrow caps. */
export const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--f-display',
})

/** Every number that is data — batch codes, dates, pincodes, nutrition, prices. */
export const plexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--f-mono',
})

export const fontVariables = [
  yatraOne.variable,
  mukta.variable,
  archivo.variable,
  archivoBlack.variable,
  plexMono.variable,
].join(' ')
