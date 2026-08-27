import type { Config } from 'tailwindcss'

/**
 * Colours and type are declared as CSS custom properties in globals.css and
 * referenced here by name. The design work lands in that one file — nothing in
 * the component tree hard-codes a hex value, so a new palette is a single edit.
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
        muted: 'var(--c-muted)',
        line: 'var(--c-line)',
        accent: 'var(--c-accent)',
        gold: 'var(--c-gold)',
        plant: 'var(--c-plant)',
      },
      fontFamily: {
        display: 'var(--f-display)',
        body: 'var(--f-body)',
        mono: 'var(--f-mono)',
      },
      maxWidth: { measure: '68ch' },
    },
  },
  plugins: [],
}

export default config
