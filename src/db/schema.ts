import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'

/**
 * Attribution carried off the landing URL. Meta never tells us who the visitor
 * is — only which ad they came from — so this is the whole of what the click
 * gives us, and it is why every creative can be scored separately.
 */
export type Utm = {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  adId?: string
  placement?: string
  fbclid?: string
}

export const signups = pgTable(
  'signups',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    /** Sequential, and what the coupon number and Founding-100 cut-off are drawn from. */
    seq: serial('seq').notNull(),

    name: text('name').notNull(),
    /** Normalised to ten digits, no country code, no spaces. */
    phone: text('phone').notNull(),
    area: text('area').notNull(),
    pincode: text('pincode').notNull(),

    plan: text('plan'),
    intent: text('intent').notNull(), // launch_week | within_month | exploring

    consent: boolean('consent').notNull(),
    /**
     * The exact wording the person agreed to, stored with the row. DPDP consent
     * has to be specific and informed; if we later reword the checkbox, an old
     * row must still be able to show what its owner actually agreed to.
     */
    consentText: text('consent_text').notNull(),
    consentAt: timestamp('consent_at', { withTimezone: true }).notNull().defaultNow(),

    couponCode: text('coupon_code').notNull(),
    /** a = 25% off, b = 15% off, c = free Masala pack. Measures price sensitivity. */
    couponCohort: text('coupon_cohort').notNull(),
    tier: text('tier').notNull(), // founding | early_bird

    /**
     * Set by hand when they save our number and reply on WhatsApp. This is the
     * pilot's substitute for a payment, so it is deliberately not something the
     * website can set on its own.
     */
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),

    calculatorSnapshot: jsonb('calculator_snapshot'),
    utm: jsonb('utm').$type<Utm>(),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    /** Erasure request: the row is tombstoned so the coupon number is never reissued. */
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (t) => ({
    phoneIdx: uniqueIndex('signups_phone_key').on(t.phone),
    couponIdx: uniqueIndex('signups_coupon_key').on(t.couponCode),
    // Delivery planning reads by cluster, and the clustering gate counts by area.
    areaIdx: index('signups_area_idx').on(t.area, t.pincode),
    confirmedIdx: index('signups_confirmed_idx').on(t.confirmedAt),
  }),
)

export const bulkLeads = pgTable('bulk_leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessName: text('business_name').notNull(),
  contactName: text('contact_name').notNull(),
  phone: text('phone').notNull(),
  businessType: text('business_type').notNull(), // gym | restaurant | cafe | cloud_kitchen | other
  kgPerWeek: integer('kg_per_week'),
  /**
   * What they pay for paneer today. A recall of a real transaction rather than a
   * hypothetical, which makes it the lowest-bias pricing question we can ask.
   */
  currentPaneerPricePerKg: integer('current_paneer_price_per_kg'),
  area: text('area'),
  pincode: text('pincode'),
  notes: text('notes'),
  utm: jsonb('utm').$type<Utm>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

/**
 * Pincodes we do not deliver to yet. Free demand mapping: it tells us where to
 * open next, and costs one insert on a page we were showing anyway.
 */
export const pincodeMisses = pgTable('pincode_misses', {
  id: uuid('id').defaultRandom().primaryKey(),
  pincode: text('pincode').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Signup = typeof signups.$inferSelect
export type NewSignup = typeof signups.$inferInsert
