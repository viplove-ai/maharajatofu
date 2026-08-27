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

// Wrapped rather than a top-level await: tsx compiles this to CJS, which has no
// top-level await, and the failure only shows up when the script actually runs.
async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')

  await migrate(drizzle(neon(url)), { migrationsFolder: './drizzle' })
  console.log('migrations applied')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
