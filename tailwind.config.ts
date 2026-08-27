import type { Config } from 'tailwindcss'

/**
 * Colours, type and control sizes are declared as CSS custom properties in
 * globals.css from the "Enamel Board" handoff, and referenced here by name.
 * The design lands in that one file — nothing in the component tree holds a hex.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        'surface-2': 'var(--c-surface-2)',
        ink: 'var(--c-ink)',
        'ink-deep': 'var(--c-ink-deep)',
        'indigo-raise': 'var(--c-indigo-raise)',
        slate: 'var(--c-slate)',
        muted: 'var(--c-muted)',
        'muted-dark': 'var(--c-muted-dark)',
        line: 'var(--c-line)',
        'line-strong': 'var(--c-line-strong)',
        accent: 'var(--c-accent)',
        gold: 'var(--c-gold)',
        chilli: 'var(--c-chilli)',
        plant: 'var(--c-plant)',
        'sku-classic': 'var(--c-sku-classic)',
        'sku-masala': 'var(--c-sku-masala)',
      },
      fontFamily: {
        display: 'var(--f-display)',
        headline: 'var(--f-headline)',
        devanagari: 'var(--f-devanagari)',
        body: 'var(--f-body)',
        mono: 'var(--f-mono)',
      },
      height: {
        input: 'var(--h-input)',
        button: 'var(--h-button)',
        chip: 'var(--h-chip)',
        sticky: 'var(--h-sticky)',
      },
      minHeight: {
        input: 'var(--h-input)',
        button: 'var(--h-button)',
        chip: 'var(--h-chip)',
        target: '44px',
      },
      maxWidth: { measure: '68ch' },
    },
  },
  plugins: [],
}

export default config
