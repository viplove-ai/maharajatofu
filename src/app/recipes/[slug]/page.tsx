import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { brand, recipeBySlug, recipes } from '@/content'
import { Photo } from '@/components/Photo'
import { Body, Eyebrow, HeadingHi, Meta, Num, Section } from '@/components/ui'

/** Statically generated — these pages are the long-tail search entry points and
 *  the asset that keeps working after the ad budget stops. */
export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = recipeBySlug((await params).slug)
  if (!r) return {}
  return {
    title: `${r.name} — ${r.minutes} min`,
    description: `${r.name}: a paneer recipe with the paneer swapped 1:1 for tofu. ${r.minutes} minutes, ${r.packs} ${r.packs === 1 ? 'pack' : 'packs'}.`,
    alternates: { canonical: `/recipes/${r.slug}` },
  }
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const r = recipeBySlug((await params).slug)
  if (!r) notFound()
  const others = recipes.filter((o) => o.slug !== r.slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: r.name,
    recipeYield: r.serves ? `${r.serves} servings` : undefined,
    totalTime: `PT${r.minutes}M`,
    recipeCuisine: 'Indian',
    recipeInstructions: (r.steps ?? []).map((text) => ({ '@type': 'HowToStep', text })),
    author: { '@type': 'Organization', name: brand.name },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Section ground="indigo" className="pt-8">
        <Eyebrow tone="marigold">
          {r.minutes} MIN · {r.packs} {r.packs === 1 ? 'PACK' : 'PACKS'}
          {r.serves ? ` · SERVES ${r.serves}` : ''}
        </Eyebrow>
        <HeadingHi as="h1" size="lg" className="mt-2">
          {r.name}
        </HeadingHi>
        <Photo caption={`${r.name} — HARD SIDE LIGHT, HANDS IN FRAME`} className="mt-5" />
      </Section>

      {/* Every recipe shows the paneer version's calories for contrast — the
          whole point is that the dish is unchanged and the number is not. */}
      {r.kcalPerPortion && r.paneerKcalPerPortion && (
        <Section ground="cream">
          <Eyebrow tone="vermilion">PER PORTION</Eyebrow>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-indigo p-4 text-cream">
              <Meta className="text-marigold">WITH TOFU</Meta>
              <p className="mt-1 font-display text-[34px] leading-none">
                <Num>{r.kcalPerPortion}</Num>
                <span className="ml-1 font-mono text-[12px]">KCAL</span>
              </p>
              {r.proteinPerPortion && <Meta className="mt-1 text-cream/60">{r.proteinPerPortion} G PROTEIN</Meta>}
            </div>
            <div className="border-2 border-stone bg-paper p-4">
              <Meta className="text-grey-warm">WITH PANEER</Meta>
              <p className="mt-1 font-display text-[34px] leading-none text-ink">
                <Num>{r.paneerKcalPerPortion}</Num>
                <span className="ml-1 font-mono text-[12px]">KCAL</span>
              </p>
              <Meta className="mt-1 text-grey-warm">SAME MASALA, SAME PAN</Meta>
            </div>
          </div>
        </Section>
      )}

      <Section ground="paper">
        <Eyebrow tone="vermilion">TAREEKA</Eyebrow>
        {r.steps?.length ? (
          <ol className="mt-4 space-y-4">
            {r.steps.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="font-mono text-[13px] text-vermilion">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[16px] leading-[1.55] text-ink">{s}</span>
              </li>
            ))}
          </ol>
        ) : (
          <Body className="mt-3 text-grey-warm-dark">
            Cook it exactly the way you cook this dish with paneer — same masala, same pan, same timing. Add the tofu in
            the last three or four minutes rather than boiling it in the gravy, and press it for ten minutes first if you
            want a firmer bite. Full method lands here before launch.
          </Body>
        )}

        <div className="mt-6 border-l-4 border-indigo pl-4">
          <Meta className="text-vermilion">MAHARAJA METHOD</Meta>
          <p className="mt-2 text-body-sm text-slate">
            Press 10–20 minutes under something heavy. Blanch two minutes in hot salted water for a softer, paneer-like
            bite. Marinate fifteen minutes — tofu is porous and takes flavour faster than paneer. Add it in the last
            three minutes; it does not need longer and it will crumble.
          </p>
        </div>
      </Section>

      <Section ground="cream">
        <Eyebrow tone="vermilion">AUR BHI</Eyebrow>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/recipes/${o.slug}`} className="bg-paper p-3">
              <Meta className="text-grey-warm">{o.minutes} MIN</Meta>
              <h3 lang="hi" className="mt-1 font-headline text-[14px] font-bold text-ink">
                {o.name}
              </h3>
            </Link>
          ))}
        </div>
      </Section>
    </>
  )
}
