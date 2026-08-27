import type { Config } from 'tailwindcss'

/**
 * Tokens come from globals.css (colours, control heights) and next/font (type).
 * Nothing in the component tree holds a hex or a font stack.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: 'var(--c-indigo)',
        'indigo-raise': 'var(--c-indigo-raise)',
        ink: 'var(--c-ink)',
        cream: 'var(--c-cream)',
        paper: 'var(--c-paper)',
        stone: 'var(--c-stone)',
        'stone-edge': 'var(--c-stone-edge)',
        'grey-warm': 'var(--c-grey-warm)',
        'grey-warm-dark': 'var(--c-grey-warm-dark)',
        slate: 'var(--c-slate)',
        vermilion: 'var(--c-vermilion)',
        marigold: 'var(--c-marigold)',
        chilli: 'var(--c-chilli)',
        green: 'var(--c-green)',
        placeholder: 'var(--c-placeholder)',
        'track-off': 'var(--c-track-off)',
      },
      fontFamily: {
        devanagari: ['var(--f-devanagari)', 'serif'],
        headline: ['var(--f-headline)', 'system-ui', 'sans-serif'],
        display: ['var(--f-display)', 'Helvetica', 'sans-serif'],
        body: ['var(--f-body)', 'Helvetica', 'sans-serif'],
        mono: ['var(--f-mono)', 'ui-monospace', 'monospace'],
      },
      minHeight: {
        target: 'var(--h-target)',
        chip: 'var(--h-chip)',
        input: 'var(--h-input)',
        button: 'var(--h-button)',
      },
      height: {
        chip: 'var(--h-chip)',
        input: 'var(--h-input)',
        button: 'var(--h-button)',
        sticky: 'var(--h-sticky)',
      },
      fontSize: {
        // The mobile scale from the handoff, named by role rather than size so
        // a component cannot quietly drift off it.
        eyebrow: ['10px', { lineHeight: '1.6', letterSpacing: '0.20em' }],
        legal: ['9.5px', { lineHeight: '1.8', letterSpacing: '0.08em' }],
        meta: ['11px', { lineHeight: '1.7', letterSpacing: '0.12em' }],
        body: ['14.5px', { lineHeight: '1.55' }],
        'body-sm': ['13.5px', { lineHeight: '1.55' }],
        sku: ['17px', { lineHeight: '1.15', letterSpacing: '0.03em' }],
        'headline-sm': ['18px', { lineHeight: '1.25' }],
        headline: ['22px', { lineHeight: '1.25' }],
        'headline-lg': ['26px', { lineHeight: '1.2' }],
        hero: ['40px', { lineHeight: '1.1' }],
        'hero-lg': ['68px', { lineHeight: '1.05' }],
        num: ['54px', { lineHeight: '1' }],
        'num-lg': ['60px', { lineHeight: '0.9' }],
      },
      maxWidth: { measure: '68ch', shell: '1440px' },
    },
  },
  plugins: [],
}

export default config
