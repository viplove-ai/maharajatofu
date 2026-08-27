import { ladder } from '@/content'
import { Meta } from './ui'

/** Founding Member / Early Bird / Padosi Bonus. Rank is assigned server-side. */
export function Ladder() {
  const border = ['border-2 border-marigold', 'border border-cream/40', 'border border-cream/40']
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {ladder.map((tier, i) => (
        <div key={tier.name} className={`${border[i]} p-4`}>
          <Meta className="text-marigold">CONFIRMED {tier.rank.toUpperCase()}</Meta>
          <h3 className="mt-1 font-display text-sku uppercase text-cream">{tier.name}</h3>
          <ul className="mt-3 space-y-1.5">
            {tier.perks.map((p) => (
              <li key={p} className="font-mono text-[11px] leading-[1.7] text-cream/70">
                — {p}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
