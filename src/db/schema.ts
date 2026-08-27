import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

/**
 * Ad attribution carried off the landing URL. Instagram passes no user identity
 * — only which creative was tapped — so this is the whole of what a click gives
 * us, and it is why six rotating creatives can be scored separately.
 */
export type Attribution = Record<string, string>

export const signups = pgTable(
  'signups',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    /**
     * Rank on the ladder, and the number inside the coupon. Assigned by the
     * database, never by the browser — a client-side rank would be a guess and
     * the scarcity counter is meant to be true.
     */
    seq: serial('seq').notNull(),

    name: text('name').notNull(),
    /** Normalised to ten digits: no country code, no spaces. */
    phone: text('phone').notNull(),
    area: text('area').notNull(),
    pincode: text('pincode').notNull(),

    plan: text('plan'),
    packs: integer('packs'),
    intent: text('intent').notNull(), // launch | month | explore

    consent: boolean('consent').notNull(),
    /**
     * The exact wording agreed to, stored with the row. DPDP consent has to be
     * specific and informed; rewording the checkbox later must not rewrite what
     * an existing signup actually agreed to.
     */
    consentText: text('consent_text').notNull(),
    consentAt: timestamp('consent_at', { withTimezone: true }).notNull().defaultNow(),

    couponCode: text('coupon_code').notNull(), // MT-{NAME}-{RANK}
    /** a = 25% off, b = 15% off, c = free Masala pack. Measures price sensitivity. */
    couponCohort: text('coupon_cohort').notNull(),
    tier: text('tier').notNull(), // founding | early_bird

    /** Opaque token behind /r/[token] — this row's own share link. */
    referralToken: text('referral_token').notNull(),
    /** The referralToken of whoever sent them, when they arrived through one. */
    referredBy: text('referred_by'),
    society: text('society'),

    /**
     * Set by hand when they save our number and reply on WhatsApp. This is the
     * pilot's substitute for a payment, so deliberately not something the
     * website can set on its own.
     */
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),

    calculatorSnapshot: jsonb('calculator_snapshot'),
    attribution: jsonb('attribution').$type<Attribution>(),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    /** Erasure request: tombstoned, so a rank and coupon are never reissued. */
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    phoneIdx: uniqueIndex('signups_phone_key').on(t.phone),
    couponIdx: uniqueIndex('signups_coupon_key').on(t.couponCode),
    tokenIdx: uniqueIndex('signups_referral_token_key').on(t.referralToken),
    // Delivery planning reads by cluster; the slots endpoint counts by pincode.
    areaIdx: index('signups_area_idx').on(t.area, t.pincode),
    confirmedIdx: index('signups_confirmed_idx').on(t.confirmedAt),
    referredIdx: index('signups_referred_by_idx').on(t.referredBy),
  }),
)

export const bulkLeads = pgTable('bulk_leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessName: text('business_name').notNull(),
  contactName: text('contact_name').notNull(),
  phone: text('phone').notNull(),
  businessType: text('business_type').notNull(),
  kgPerWeek: integer('kg_per_week'),
  /** What they pay for paneer today — a real transaction, not a hypothetical. */
  currentPaneerPricePerKg: integer('current_paneer_price_per_kg'),
  area: text('area'),
  pincode: text('pincode'),
  notes: text('notes'),
  attribution: jsonb('attribution').$type<Attribution>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

/**
 * Pincodes outside the pilot circle. A new route opens once 25 people from one
 * pincode ask, so this table is both the demand map and the progress bar the
 * out-of-zone card shows.
 */
export const pincodeRequests = pgTable(
  'pincode_requests',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    pincode: text('pincode').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ pincodeIdx: index('pincode_requests_pincode_idx').on(t.pincode) }),
)

export type Signup = typeof signups.$inferSelect
export type NewSignup = typeof signups.$inferInsert
