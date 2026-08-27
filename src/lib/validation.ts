import { z } from 'zod'
import { AREAS } from './areas'

/**
 * Indian mobile numbers are ten digits starting 6-9. We accept the shapes people
 * actually paste — +91, 0091, a leading 0, spaces, dashes — and store one.
 */
export function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  const ten = digits.length > 10 ? digits.slice(-10) : digits
  return /^[6-9]\d{9}$/.test(ten) ? ten : null
}

const phone = z.string().transform((v, ctx) => {
  const n = normalisePhone(v)
  if (!n) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a 10-digit mobile number' })
    return z.NEVER
  }
  return n
})

const areaIds = AREAS.map((a) => a.id) as [string, ...string[]]

export const utmSchema = z
  .object({
    source: z.string().max(120).optional(),
    medium: z.string().max(120).optional(),
    campaign: z.string().max(200).optional(),
    content: z.string().max(200).optional(),
    adId: z.string().max(64).optional(),
    placement: z.string().max(64).optional(),
    fbclid: z.string().max(255).optional(),
  })
  .partial()

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Aapka naam?').max(60),
  phone,
  area: z.enum(areaIds),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a 6-digit pincode'),
  plan: z.enum(['weekender', 'thrice', 'daily', 'parivaar']).nullable().optional(),
  intent: z.enum(['launch_week', 'within_month', 'exploring']),
  // Refused rather than defaulted: DPDP consent has to be affirmative, and a
  // request that arrives without it is a bug worth failing loudly on.
  consent: z.literal(true, { errorMap: () => ({ message: 'We need your permission to message you' }) }),
  calculatorSnapshot: z.record(z.unknown()).nullable().optional(),
  utm: utmSchema.nullable().optional(),
})

export const bulkLeadSchema = z.object({
  businessName: z.string().trim().min(1).max(120),
  contactName: z.string().trim().min(1).max(60),
  phone,
  businessType: z.enum(['gym', 'restaurant', 'cafe', 'cloud_kitchen', 'other']),
  kgPerWeek: z.coerce.number().int().min(1).max(500).nullable().optional(),
  currentPaneerPricePerKg: z.coerce.number().int().min(50).max(2000).nullable().optional(),
  area: z.string().max(80).nullable().optional(),
  pincode: z.string().regex(/^\d{6}$/).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  utm: utmSchema.nullable().optional(),
})

export type SignupInput = z.infer<typeof signupSchema>
export type BulkLeadInput = z.infer<typeof bulkLeadSchema>
