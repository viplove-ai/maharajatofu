/** The circular म mark. One of the few round things in an otherwise square system. */
export function Mark({ size = 34 }: { size?: number }) {
  return (
    <span
      className="is-round inline-flex shrink-0 items-center justify-center bg-cream"
      style={{ width: size, height: size, boxShadow: `inset 0 0 0 2px var(--c-marigold)` }}
      aria-hidden
    >
      <span className="font-devanagari leading-none text-indigo" style={{ fontSize: size * 0.58 }}>
        म
      </span>
    </span>
  )
}
