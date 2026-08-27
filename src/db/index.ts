import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

/**
 * Neon over HTTP rather than a TCP pool: this app writes a handful of rows a day
 * from short-lived route handlers, so a persistent pool would be idle almost all
 * of the time and would stop the Fly machine suspending to zero.
 *
 * Use the POOLED endpoint here — unlike nirman's Hikari pool, there is no
 * prepared-statement state to conflict with PgBouncer.
 */
let cached: ReturnType<typeof drizzle<typeof schema>> | null = null

export function db() {
  if (cached) return cached
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')
  cached = drizzle(neon(url), { schema })
  return cached
}

export { schema }
