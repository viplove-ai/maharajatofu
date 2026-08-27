'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { Dishes, Eaters } from './calculator'

/**
 * One store, one localStorage key. A returning visitor re-enters nothing: the
 * calculator inputs, the pincode, the chosen area and the resolved plan all come
 * back on mount, and so does the ad attribution captured on the first visit.
 */
export const STORAGE_KEY = 'mt.pilot.v1'

export type Mode = 'swap' | 'week'
export type Pct = 25 | 50 | 100
export type PinState = 'idle' | 'short' | 'loading' | 'ok' | 'out'
export type SubmitState = 'idle' | 'loading' | 'error' | 'done'
export type Intent = 'launch' | 'month' | 'explore' | ''

export interface FormState {
  name: string
  phone: string
  area: string
  pin: string
  intent: Intent
  consent: boolean
}

export interface Signup {
  rank: number
  code: string
  plan: string
  name: string
  area: string
  pincode: string
}

export interface PilotState {
  mode: Mode
  paneerG: number
  pct: Pct
  match: boolean
  eaters: Eaters
  dishes: Dishes
  trains: boolean
  pin: string
  pinState: PinState
  form: FormState
  submitState: SubmitState
  attribution: Record<string, string>
  signup?: Signup
}

const INITIAL: PilotState = {
  mode: 'swap',
  paneerG: 1000,
  pct: 50,
  match: false,
  eaters: { adult: 2, teen: 0, c1012: 1, c49: 0 },
  dishes: { gravy: 2, bhurji: 1, tikka: 1, addon: 1 },
  trains: false,
  pin: '',
  pinState: 'idle',
  form: { name: '', phone: '', area: '', pin: '', intent: 'launch', consent: false },
  submitState: 'idle',
  attribution: {},
}

/** Only these survive a reload. Transient UI state deliberately does not. */
type Persisted = Pick<
  PilotState,
  'mode' | 'paneerG' | 'pct' | 'match' | 'eaters' | 'dishes' | 'trains' | 'pin' | 'attribution' | 'signup'
> & { area: string }

const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'ad_id', 'fbclid'] as const

interface Ctx {
  state: PilotState
  set: (patch: Partial<PilotState>) => void
  setForm: (patch: Partial<FormState>) => void
  /** True until the first read from localStorage completes. */
  hydrating: boolean
}

const PilotContext = createContext<Ctx | null>(null)

export function PilotProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PilotState>(INITIAL)
  const [hydrating, setHydrating] = useState(true)
  const loaded = useRef(false)

  const set = useCallback((patch: Partial<PilotState>) => {
    setState((s) => ({ ...s, ...patch }))
  }, [])

  const setForm = useCallback((patch: Partial<FormState>) => {
    setState((s) => ({ ...s, form: { ...s.form, ...patch } }))
  }, [])

  // Rehydrate, then capture attribution if this is a first visit. Private mode
  // throws on both read and write, so every access is wrapped — the site has to
  // keep working with no storage at all, just without memory.
  useEffect(() => {
    let restored: Partial<Persisted> = {}
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) restored = JSON.parse(raw) as Partial<Persisted>
    } catch {
      /* private mode, or corrupt JSON — start fresh rather than throw */
    }

    // First touch wins: the ad that earned the visit keeps the credit even if
    // the visitor comes back later through a direct link.
    let attribution = restored.attribution ?? {}
    if (Object.keys(attribution).length === 0) {
      const q = new URLSearchParams(window.location.search)
      const found: Record<string, string> = {}
      for (const k of ATTRIBUTION_KEYS) {
        const v = q.get(k)
        if (v) found[k] = v.slice(0, 200)
      }
      if (Object.keys(found).length) attribution = found
    }

    setState((s) => ({
      ...s,
      ...restored,
      attribution,
      form: { ...s.form, area: restored.area ?? s.form.area, pin: restored.pin ?? s.form.pin },
      // pinState is derived, never restored — a stored 'ok' would claim we
      // deliver somewhere before the pincode has been checked this visit.
      pinState: 'idle',
      submitState: 'idle',
    }))
    loaded.current = true
    setHydrating(false)
  }, [])

  // Persist only the fields listed above. Never clear keys we did not write.
  useEffect(() => {
    if (!loaded.current) return
    const payload: Persisted = {
      mode: state.mode,
      paneerG: state.paneerG,
      pct: state.pct,
      match: state.match,
      eaters: state.eaters,
      dishes: state.dishes,
      trains: state.trains,
      pin: state.pin,
      area: state.form.area,
      attribution: state.attribution,
      signup: state.signup,
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      /* storage full or unavailable — the session still works, it just forgets */
    }
  }, [state])

  const value = useMemo(() => ({ state, set, setForm, hydrating }), [state, set, setForm, hydrating])
  return <PilotContext.Provider value={value}>{children}</PilotContext.Provider>
}

export function usePilot(): Ctx {
  const ctx = useContext(PilotContext)
  if (!ctx) throw new Error('usePilot must be used inside <PilotProvider>')
  return ctx
}

/** Smooth scroll with the 60px offset the handoff specifies. Never scrollIntoView. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - 60
  window.scrollTo({ top, behavior: 'smooth' })
}
