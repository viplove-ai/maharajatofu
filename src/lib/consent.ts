/**
 * The exact consent wording, versioned. Every signup row stores the string that
 * was on screen when it was created — reword this and old rows still prove what
 * their owner actually agreed to, which is the point of "specific and informed".
 */
export const CONSENT_VERSION = 'v1-2026-08'

export const CONSENT_TEXT =
  'Haan, mujhe WhatsApp par launch update aur early-bird coupon bhejiye. ' +
  'We will message you once at launch and send your coupon. Nothing else, ' +
  'never shared with anyone, and "STOP" removes you.'

export const CONSENT_RECORD = `${CONSENT_VERSION}: ${CONSENT_TEXT}`
