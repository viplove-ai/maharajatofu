/**
 * Applies drizzle/*.sql against DATABASE_URL. Run from CI before a deploy, or by
 * hand — it is deliberately not wired into app startup, so a bad migration takes
 * down a one-off job rather than every request the machine is serving.
 */
import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

config({ path: ['.env.local', '.env'] })

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set')
  process.exit(1)
}

await migrate(drizzle(neon(url)), { migrationsFolder: './drizzle' })
console.log('migrations applied')
