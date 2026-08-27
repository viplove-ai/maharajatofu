import Link from 'next/link'
import { notFound } from 'next/navigation'
import { brand, productBySlug, recipes } from '@/content'
import { Photo } from './Photo'
import { Body, Eyebrow, Meta, Num, Section } from './ui'

const SKU_TEXT: Record<string, string> = { classic: 'text-marigold', masala: 'text-vermilion' }

export function ProductPage({ slug }: { slug: string }) {
  const p = productBySlug(slug)
  if (!p) notFound()
  const related = recipes.slice(0, 4)

  return (
    <>
      <Section ground="indigo" className="pt-8">
        <Eyebrow tone="marigold">
          {p.netQty.toUpperCase()} · ₹{p.perKg}/KG
        </Eyebrow>
        <h1 className={`mt-2 font-display text-[30px] uppercase leading-[1.05] ${SKU_TEXT[p.sku] ?? 'text-cream'}`}>
          {p.name}
        </h1>
        <Body className="mt-3 text-cream/80">{p.line}</Body>
        <p className="mt-5 font-display text-[44px] leading-none text-cream">
          <Num>₹{p.price}</Num>
        </p>
        <Photo
          caption={p.sku === 'masala' ? 'Masala tofu charring on a tawa' : 'A tub of Classic tofu in a home fridge'}
          src={p.sku === 'masala' ? '/img/masala-tawa.svg' : '/img/classic-tub.svg'}
          className="mt-6"
          priority
        />
      </Section>

      {/* The three-ingredient panel is the hero element on Classic. */}
      <Section ground="paper">
        <Eyebrow tone="vermilion">WHAT&rsquo;S IN IT</Eyebrow>
        <ol className="mt-3 font-mono text-[24px] font-semibold leading-[1.5] text-ink">
          {p.ingredients.map((ing, i) => (
            <li key={ing}>
              {i + 1} {ing.toUpperCase()}
            </li>
          ))}
        </ol>
        <hr className="mt-4 h-[2px] w-full border-0 bg-vermilion" />
        <div className="mt-4 flex items-center gap-3">
          <span
            className="flex h-5 w-5 items-center justify-center border-2 border-green"
            aria-label="Vegetarian"
            title="Vegetarian"
          >
            <span className="is-round block h-2.5 w-2.5 bg-green" />
          </span>
          <Meta className="text-grey-warm">{p.allergen.toUpperCase()}</Meta>
        </div>
      </Section>

      <Section ground="cream">
        <Eyebrow tone="vermilion">PER 100 G</Eyebrow>
        <dl className="mt-3 divide-y divide-stone font-mono text-[13px]">
          {[
            ['ENERGY', `${p.per100g.kcal} KCAL`],
            ['PROTEIN', `${p.per100g.protein} G`],
            ['TOTAL FAT', `${p.per100g.fat} G`],
            ['SATURATED FAT', `${p.per100g.satFat} G`],
            ['TRANS FAT', `${p.per100g.transFat} G`],
            ['CHOLESTEROL', `${p.per100g.cholesterol} MG`],
            ['CARBOHYDRATE', `${p.per100g.carb} G`],
            ['TOTAL SUGARS', `${p.per100g.sugars} G`],
            ['SODIUM', `${p.per100g.sodium} MG`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between py-2">
              <dt className="text-grey-warm-dark">{k}</dt>
              <dd className="tabular-nums text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5 space-y-0.5">
          <Meta className="text-grey-warm">DATE OF PACKING &amp; BEST BEFORE PRINTED AT THE SAME SIZE</Meta>
          <Meta className="text-grey-warm">KEEP REFRIGERATED 0–4 °C · BEST WITHIN 5 DAYS</Meta>
          <Meta className="text-grey-warm">BATCH CODE ON EVERY TUB</Meta>
          <Meta className="text-grey-warm">{brand.address.toUpperCase()}</Meta>
        </div>
      </Section>

      <Section ground="paper">
        <Eyebrow tone="vermilion">COOK IT LIKE THIS</Eyebrow>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {related.map((r) => (
            <Link key={r.slug} href={`/recipes/${r.slug}`} className="bg-cream">
              <Photo caption={r.name} src={`/img/recipes/${r.slug}.svg`} ratio="aspect-[4/3]" />
              <div className="p-3">
                <h3 className="font-headline text-[14.5px] font-bold text-ink">
                  {r.name}
                </h3>
                <Meta className="mt-1 text-grey-warm">
                  {r.minutes} MIN · {r.packs} {r.packs === 1 ? 'PACK' : 'PACKS'}
                </Meta>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/protein-calculator" className="mt-5 inline-block font-mono text-[12px] uppercase tracking-[0.12em] text-indigo underline">
          Work out how much you need →
        </Link>
      </Section>
    </>
  )
}
