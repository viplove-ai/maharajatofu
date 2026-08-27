/**
 * Every nutrition constant the site quotes lives here, once.
 *
 * TOFU_PROTEIN_PER_100G is a PLACEHOLDER using the typical published range for
 * firm tofu. Replace it with the figure from our own NABL lab report before
 * launch — the pack label, the calculator and the ad copy must all quote the
 * same number, and the only way to guarantee that is for there to be one.
 */

/** grams of protein per 100 g of our firm tofu */
export const TOFU_PROTEIN_PER_100G = 10
/** kcal per gram */
export const TOFU_KCAL_PER_G = 0.76
export const PANEER_KCAL_PER_G = 2.65
/** grams of saturated fat per gram */
export const TOFU_SATFAT_PER_G = 0.015
export const PANEER_SATFAT_PER_G = 0.055
/** grams of protein per 100 g of full-fat paneer */
export const PANEER_PROTEIN_PER_100G = 18

/**
 * Grams of tofu carrying the same protein as one gram of paneer: 180 g of tofu
 * and 100 g of paneer both give 18 g. This ratio is what makes "utna hi protein,
 * aadhi calories" arithmetic rather than marketing, so it is derived from the two
 * constants above rather than written as a literal 1.8.
 */
export const PROTEIN_MATCH_RATIO = PANEER_PROTEIN_PER_100G / TOFU_PROTEIN_PER_100G

export const PACK_GRAMS = 200

/**
 * Pressing and searing take weight off, so the raw grams you buy exceed the
 * cooked grams you eat. A multiplier, matching the handoff spec — not 1/0.88,
 * which is a slightly different number and would drift from the design.
 */
export const PREP_LOSS = 1.12

/**
 * ICMR-NIN RDA 2020: 0.83 g of protein per kg of body weight per day for a
 * healthy adult. The higher figures are sports-nutrition convention, not ICMR —
 * label them as such anywhere they are shown.
 */
export const PROTEIN_FACTOR = { desk: 0.83, active: 1.0, trains: 1.4 } as const
export type Activity = keyof typeof PROTEIN_FACTOR

/** Approximate daily protein RDA in grams, by age band. */
export const KID_PROTEIN_RDA = { '4-9': 23, '10-12': 32, '13-19': 45 } as const
