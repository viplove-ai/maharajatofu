ALTER TABLE "pincode_misses" RENAME TO "pincode_requests";--> statement-breakpoint
ALTER TABLE "bulk_leads" RENAME COLUMN "utm" TO "attribution";--> statement-breakpoint

--> `utm` (jsonb) and `packs` (integer) are different columns with different
--> types. drizzle-kit offered this as a rename and it is not one — renaming
--> would leave a jsonb column called `packs` and break every insert.
ALTER TABLE "signups" DROP COLUMN IF EXISTS "utm";--> statement-breakpoint
ALTER TABLE "signups" ADD COLUMN "packs" integer;--> statement-breakpoint
ALTER TABLE "signups" ADD COLUMN "attribution" jsonb;--> statement-breakpoint

--> Nullable, backfill, then enforce. An unconditional ADD COLUMN ... NOT NULL
--> with no default fails the moment the table has a single row, which is a
--> deploy that dies against production and not against CI.
ALTER TABLE "signups" ADD COLUMN "referral_token" text;--> statement-breakpoint
UPDATE "signups"
   SET "referral_token" = substr(md5(random()::text || clock_timestamp()::text || "id"::text), 1, 18)
 WHERE "referral_token" IS NULL;--> statement-breakpoint
ALTER TABLE "signups" ALTER COLUMN "referral_token" SET NOT NULL;--> statement-breakpoint

ALTER TABLE "signups" ADD COLUMN "referred_by" text;--> statement-breakpoint
ALTER TABLE "signups" ADD COLUMN "society" text;--> statement-breakpoint
CREATE INDEX "pincode_requests_pincode_idx" ON "pincode_requests" USING btree ("pincode");--> statement-breakpoint
CREATE UNIQUE INDEX "signups_referral_token_key" ON "signups" USING btree ("referral_token");--> statement-breakpoint
CREATE INDEX "signups_referred_by_idx" ON "signups" USING btree ("referred_by");
