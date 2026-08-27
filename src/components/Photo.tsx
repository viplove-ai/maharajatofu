/**
 * No production photography exists yet. Every image is a striped placeholder
 * carrying a mono caption naming the shot required, so an empty frame reads as
 * a brief for the photographer rather than as a broken asset.
 */
export function Photo({
  caption,
  on = 'indigo',
  ratio = 'aspect-[4/3]',
  className = '',
}: {
  caption: string
  on?: 'indigo' | 'cream'
  ratio?: string
  className?: string
}) {
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
