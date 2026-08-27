import type { Metadata } from 'next'
import Link from 'next/link'
import { MAHARAJA_METHOD, recipesByLane } from '@/content/recipes'
import { StickyBar } from '@/components/StickyBar'
import { Card, Eyebrow, H1, H2, Prose, Section, Wrap } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Tofu recipes — from 2-minute Maggi to Sunday butter masala',
  description:
    'Sixteen tofu recipes for Indian kitchens: eight that take under five minutes, and eight family dinners where tofu simply replaces paneer.',
}

function Lane({ title, blurb, slugLane }: { title: string; blurb: string; slugLane: 'quick' | 'family' }) {
  const recipes = recipesByLane(slugLane)
  return (
    <Section>
      <Wrap>
        <H2>{title}</H2>
        <p className="mb-6 mt-2 max-w-measure text-muted">{blurb}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <Link key={r.slug} href={`/recipes/${r.slug}`} className="rounded border border-line bg-surface p-4 hover:border-accent">
              <p className={`font-mono text-[11px] uppercase tracking-[0.1em] ${slugLane === 'quick' ? 'text-plant' : 'text-gold'}`}>
                {r.time} · serves {r.serves}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold">{r.title}</h3>
              <p className="mt-1 text-sm text-muted">{r.hook}</p>
            </Link>
          ))}
        </div>
      </Wrap>
    </Section>
  )
}

export default function RecipesPage() {
  return (
    <>
      <Section className="pt-12">
        <Wrap>
          <Eyebrow>Recipes</Eyebrow>
          <H1>Main ise banaungi kaise?</H1>
          <Prose>
            <p className="mt-4 text-muted">
              The question that stops most people buying tofu. Sixteen answers below — eight of them under five minutes,
              eight of them the dinners you already cook with paneer.
            </p>
          </Prose>
        </Wrap>
      </Section>

      <Lane
        slugLane="quick"
        title="Under five minutes"
        blurb="No pressing, no marinating, no planning. Every one of these uses Masala Tofu straight from the pack."
      />
      <Lane
        slugLane="family"
        title="The family dinner"
        blurb="Same recipe, same masala, same taste — one ingredient swapped. Uses Classic Firm Tofu."
      />

      <Section className="border-b-0">
        <Wrap>
          <Eyebrow>The Maharaja Method</Eyebrow>
          <H2>Five things that fix tofu&rsquo;s texture</H2>
          <p className="mb-6 mt-2 max-w-measure text-muted">
            Tofu fails in Indian kitchens for texture reasons, not taste reasons. These five fix it.
          </p>
          <ol className="grid gap-3 sm:grid-cols-2">
            {MAHARAJA_METHOD.map((m, i) => (
              <Card key={m.title}>
                <p className="font-mono text-[11px] text-accent">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-1 font-display text-lg font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm text-muted">{m.body}</p>
              </Card>
            ))}
          </ol>
        </Wrap>
      </Section>
      <StickyBar />
    </>
  )
}
