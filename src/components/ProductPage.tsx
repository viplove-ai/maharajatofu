import Link from 'next/link'
import { notFound } from 'next/navigation'
import { productBySlug } from '@/content/products'
import { recipeBySlug } from '@/content/recipes'
import { StickyBar } from '@/components/StickyBar'
import { Card, Eyebrow, H1, H2, Prose, Section, Wrap } from '@/components/ui'
import { SITE } from '@/lib/site'
import { TOFU_PROTEIN_PER_100G, TOFU_KCAL_PER_G } from '@/lib/nutrition'

export function ProductPage({ slug }: { slug: 'classic-tofu' | 'masala-tofu' }) {
  const product = productBySlug(slug)
  if (!product) notFound()
  const recipes = product.recipes.map(recipeBySlug).filter((r) => r !== undefined)

  return (
    <>
      <Section className="pt-12">
        <Wrap>
          <Eyebrow>
            {product.grams} g · ₹{product.pricePerKg}/kg
          </Eyebrow>
          <H1>{product.name}</H1>
          <p className="mt-4 max-w-measure text-lg text-muted">{product.tagline}</p>
          <p className="mt-5 font-mono text-4xl font-semibold text-accent">₹{product.price}</p>
        </Wrap>
      </Section>

      <Section>
        <Wrap className="grid gap-8 md:grid-cols-2">
          <div>
            <H2>What&rsquo;s in it</H2>
            <ul className="mt-4 space-y-2">
              {product.ingredients.map((i) => (
                <li key={i} className="border-b border-line pb-2 text-[17px]">
                  {i}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Allergen: contains soy. Keep refrigerated at 0–4 °C. Best within five days of the make date printed on the
              tub.
            </p>
          </div>
          <div>
            <H2>Per 100 g</H2>
            <Card className="mt-4">
              <dl className="space-y-2 text-[15px]">
                <div className="flex justify-between border-b border-line pb-2">
                  <dt>Protein</dt>
                  <dd className="font-mono tabular-nums">{TOFU_PROTEIN_PER_100G} g</dd>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <dt>Energy</dt>
                  <dd className="font-mono tabular-nums">{Math.round(TOFU_KCAL_PER_G * 100)} kcal</dd>
                </div>
                <div className="flex justify-between border-b border-line pb-2">
                  <dt>Cholesterol</dt>
                  <dd className="font-mono tabular-nums">0 mg</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Lactose</dt>
                  <dd className="font-mono tabular-nums">None</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted">
                Placeholder values pending our NABL lab analysis. The panel on the pack and the calculator will both
                quote that report, not these.
              </p>
            </Card>
          </div>
        </Wrap>
      </Section>

      <Section>
        <Wrap>
          <Prose>
            <p className="text-muted">{product.description}</p>
            <p className="text-muted">
              Made in our Sector 10 kitchen every {SITE.batchDays} morning and delivered the same afternoon. We never
              carry stock, which is why the shelf life is short and why we print the make date as prominently as the
              best-before.
            </p>
          </Prose>
        </Wrap>
      </Section>

      <Section className="border-b-0">
        <Wrap>
          <H2>Cook it like this</H2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recipes.map((r) => (
              <Link key={r.slug} href={`/recipes/${r.slug}`} className="rounded border border-line bg-surface p-4 hover:border-accent">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-plant">{r.time}</p>
                <h3 className="mt-1 font-display text-base font-semibold">{r.title}</h3>
              </Link>
            ))}
          </div>
          <Link href="/protein-calculator" className="mt-6 inline-block font-semibold underline">
            Work out how much you need →
          </Link>
        </Wrap>
      </Section>
      <StickyBar />
    </>
  )
}
