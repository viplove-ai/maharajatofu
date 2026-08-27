CREATE TABLE "bulk_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" text NOT NULL,
	"contact_name" text NOT NULL,
	"phone" text NOT NULL,
	"business_type" text NOT NULL,
	"kg_per_week" integer,
	"current_paneer_price_per_kg" integer,
	"area" text,
	"pincode" text,
	"notes" text,
	"utm" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pincode_misses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pincode" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seq" serial NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"area" text NOT NULL,
	"pincode" text NOT NULL,
	"plan" text,
	"intent" text NOT NULL,
	"consent" boolean NOT NULL,
	"consent_text" text NOT NULL,
	"consent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"coupon_code" text NOT NULL,
	"coupon_cohort" text NOT NULL,
	"tier" text NOT NULL,
	"confirmed_at" timestamp with time zone,
	"calculator_snapshot" jsonb,
	"utm" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "signups_phone_key" ON "signups" USING btree ("phone");--> statement-breakpoint
CREATE UNIQUE INDEX "signups_coupon_key" ON "signups" USING btree ("coupon_code");--> statement-breakpoint
CREATE INDEX "signups_area_idx" ON "signups" USING btree ("area","pincode");--> statement-breakpoint
CREATE INDEX "signups_confirmed_idx" ON "signups" USING btree ("confirmed_at");