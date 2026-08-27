import { z } from 'zod'
import { areas, form as formCopy } from '@/content'

/**
 * Indian mobile numbers are ten digits starting 6-9. We accept the shapes people
 * paste — +91, 0091, a leading zero, spaces, dashes — and store exactly one.
 */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  const ten = digits.length > 10 ? digits.slice(-10) : digits
  return /^[6-9]\d{9}$/.test(ten) ? ten : null
}

/** Strip everything that is not a digit, as the field is typed into. */
export function digitsOnly(raw: string, max: number): string {
  return raw.replace(/\D/g, '').slice(0, max)
}

const phone = z.string().transform((v, ctx) => {
  const n = normalisePhone(v)
  if (!n) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: formCopy.errors.phone })
    return z.NEVER
  }
  return n
})

/**
 * The area list is fixed and never free text: free text gives you two hundred
 * spellings of Vasundhara and no way to count a society cluster, and clustering
 * is what makes a delivery run affordable.
 */
const areaEnum = z.enum(areas as [string, ...string[]])

export const attributionSchema = z.record(z.string().max(200)).default({})

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Naam likh dijiye').max(60),
  phone,
  area: areaEnum,
  pincode: z.string().regex(/^\d{6}$/, '6 digits chahiye'),
  intent: z.enum(['launch', 'month', 'explore']),
  plan: z.string().max(60).nullable().optional(),
  packs: z.coerce.number().int().min(1).max(60).nullable().optional(),
  // Refused rather than defaulted. DPDP consent has to be affirmative, so a
  // request arriving without it is a bug worth failing loudly on.
  consent: z.literal(true, { errorMap: () => ({ message: formCopy.errors.consent }) }),
  calculatorSnapshot: z.record(z.unknown()).nullable().optional(),
  attribution: attributionSchema.nullable().optional(),
  referredBy: z.string().max(40).nullable().optional(),
})

export const bulkLeadSchema = z.object({
  businessName: z.string().trim().min(1).max(120),
  contactName: z.string().trim().min(1).max(60),
  phone,
  businessType: z.enum(['gym', 'restaurant', 'cafe', 'cloud_kitchen', 'pg_mess', 'other']),
  kgPerWeek: z.coerce.number().int().min(1).max(500).nullable().optional(),
  /**
   * The field that prices the deal. A recall of a real transaction rather than a
   * hypothetical, which makes it the lowest-bias pricing question available.
   */
  currentPaneerPricePerKg: z.coerce.number().int().min(50).max(2000).nullable().optional(),
  area: z.string().max(80).nullable().optional(),
  pincode: z.string().regex(/^\d{6}$/).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  attribution: attributionSchema.nullable().optional(),
})

export type SignupInput = z.infer<typeof signupSchema>
export type BulkLeadInput = z.infer<typeof bulkLeadSchema>
