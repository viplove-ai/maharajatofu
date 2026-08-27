import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MAHARAJA_METHOD, RECIPES, recipeBySlug } from '@/content/recipes'
import { productBySlug } from '@/content/products'
import { StickyBar } from '@/components/StickyBar'
import { Card, Eyebrow, H1, Section, Wrap } from '@/components/ui'
import { SITE } from '@/lib/site'

/** Statically generated, one URL each — these pages are the long-tail search
 *  entry points, and the asset that keeps working after the ad budget stops. */
export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const recipe = recipeBySlug((await params).slug)
  if (!recipe) return {}
  return {
    title: `${recipe.title} — ${recipe.time}`,
    description: recipe.hook,
    alternates: { canonical: `/recipes/${recipe.slug}` },
  }
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const recipe = recipeBySlug((await params).slug)
  if (!recipe) notFound()

  const product = productBySlug(recipe.sku)
  const related = RECIPES.filter((r) => r.lane === recipe.lane && r.slug !== recipe.slug).slice(0, 3)

  // Recipe structured data: these pages exist to be found, and rich results are
  // most of the reason a recipe URL outranks a blog post.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.hook,
    recipeYield: `${recipe.serves} servings`,
    totalTime: `PT${recipe.minutes}M`,
    recipeCuisine: 'Indian',
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps.map((text) => ({ '@type': 'HowToStep', text })),
    author: { '@type': 'Organization', name: SITE.name },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Section className="pt-12">
        <Wrap>
          <Eyebrow>
            {recipe.time} · serves {recipe.serves} · {recipe.tofuGrams} g tofu
          </Eyebrow>
          <H1>{recipe.title}</H1>
          <p className="mt-4 max-w-measure text-lg text-muted">{recipe.hook}</p>
          {product && (
            <p className="mt-4 text-sm">
              Uses{' '}
              <Link href={`/${product.slug}`} className="font-semibold underline">
                {product.name}
              </Link>{' '}
              — ₹{product.price} for {product.grams} g.
            </p>
          )}
        </Wrap>
      </Section>

      <Section>
        <Wrap className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Ingredients</h2>
            <ul className="mt-3 space-y-2 text-[15px]">
              {recipe.ingredients.map((i) => (
                <li key={i} className="border-b border-line pb-2">
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Method</h2>
            <ol className="mt-3 space-y-4">
              {recipe.steps.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-[17px] leading-relaxed">{s}</span>
                </li>
              ))}
            </ol>
            {recipe.note && (
              <Card className="mt-6 border-l-4 border-l-accent">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">Worth knowing</p>
                <p className="mt-1 text-[15px]">{recipe.note}</p>
              </Card>
            )}
          </div>
        </Wrap>
      </Section>

      <Section>
        <Wrap>
          <h2 className="font-display text-xl font-semibold">The Maharaja Method</h2>
          <p className="mt-1 text-sm text-muted">Five techniques that fix tofu&rsquo;s texture in an Indian kitchen.</p>
          <ul className="mt-4 space-y-2 text-[15px]">
            {MAHARAJA_METHOD.map((m) => (
              <li key={m.title} className="border-b border-line pb-2">
                <strong>{m.title}.</strong> <span className="text-muted">{m.body}</span>
              </li>
            ))}
          </ul>
        </Wrap>
      </Section>

      <Section className="border-b-0">
        <Wrap>
          <h2 className="font-display text-xl font-semibold">Try next</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/recipes/${r.slug}`} className="rounded border border-line bg-surface p-4 hover:border-accent">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{r.time}</p>
                <h3 className="mt-1 font-display text-base font-semibold">{r.title}</h3>
              </Link>
            ))}
          </div>
        </Wrap>
      </Section>
      <StickyBar />
    </>
  )
}
