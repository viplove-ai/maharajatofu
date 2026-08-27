import { form } from '@/content'

/**
 * The exact consent wording, versioned. Every signup row stores the string that
 * was on screen when it was created — reword the checkbox later and old rows
 * still prove what their owner actually agreed to, which is what "specific and
 * informed" means in practice.
 */
export const CONSENT_VERSION = 'v1-2026-08'

export const CONSENT_TEXT = form.consent.label
export const CONSENT_SUB = form.consent.sub

export const CONSENT_RECORD = `${CONSENT_VERSION}: ${CONSENT_TEXT} — ${CONSENT_SUB}`
