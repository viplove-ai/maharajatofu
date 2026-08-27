/**
 * Every image frame on the site.
 *
 * With a `src` it renders the illustration; without one it falls back to the
 * striped placeholder carrying a mono caption naming the shot required, so an
 * unfilled frame reads as a brief for the photographer rather than a bug.
 *
 * The illustrations are SVG in the enamel-board system — flat fills, hard
 * edges, fixed palette — because that is what an enamel signboard uses, and
 * because 1–2 KB apiece leaves the LCP budget almost untouched. When the real
 * shoot lands (hard side light at 45°, cut faces, hands in frame) this is the
 * one component that changes.
 */
export function Photo({
  caption,
  src,
  on = 'indigo',
  ratio = 'aspect-[4/3]',
  className = '',
  priority = false,
}: {
  caption: string
  src?: string
  on?: 'indigo' | 'cream'
  ratio?: string
  className?: string
  /** Set on the hero only — it is the LCP element. */
  priority?: boolean
}) {
  if (src) {
    return (
      <div className={`${ratio} relative overflow-hidden ${className}`}>
        {/* Plain <img>: these are vector, so there is nothing for an image
            optimiser to resize, and next/image would add a wrapper and a
            client runtime for no gain. Revisit if raster photography lands. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={caption}
          className="h-full w-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
        />
      </div>
    )
  }

  return (
    <div
      className={`${on === 'indigo' ? 'ph-indigo' : 'ph-cream'} ${ratio} relative flex items-end ${className}`}
      role="img"
      aria-label={caption}
    >
      <p
        className={`w-full p-2 font-mono text-legal uppercase ${on === 'indigo' ? 'text-cream/60' : 'text-grey-warm'}`}
      >
        {caption}
      </p>
    </div>
  )
}
