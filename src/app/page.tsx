import Link from 'next/link'
import { brand, comparison, faqs, products, recipes, FSSAI } from '@/content'
import { Calculator } from '@/components/Calculator'
import { Faq } from '@/components/Faq'
import { Ladder } from '@/components/Ladder'
import { Photo } from '@/components/Photo'
import { PincodeCheck } from '@/components/PincodeCheck'
import { Scarcity } from '@/components/Scarcity'
import { SignupBlock } from '@/components/SignupBlock'
import { HeroCta } from '@/components/HeroCta'
import { Body, Eyebrow, Heading, Meta, Num, PullQuote, Section } from '@/components/ui'

const SKU_BAR: Record<string, string> = { classic: 'bg-marigold', masala: 'bg-chilli' }
const SKU_TEXT: Record<string, string> = { classic: 'text-marigold', masala: 'text-vermilion' }

export default function Home() {
  const shelf = products.filter((p) => p.sku !== 'block')
  const six = recipes.slice(0, 6)

  return (
    <>
      {/* 1 — Hero. No price here: the hero sells the swap, prices appear on the
          product cards, in every calculator result, and framed at block 8. */}
      <Section ground="indigo" className="pt-8 md:pt-14">
        <div className="md:grid md:grid-cols-2 md:items-center md:gap-10">
          <div>
            <Heading as="h1" size="hero">
              <span className="block">{brand.heroHeadline.line1}</span>
              <span className="block text-marigold">{brand.heroHeadline.line2}</span>
            </Heading>
            <Body className="mt-4 text-cream/80">{brand.heroSub}</Body>
            <div className="mt-6 hidden md:block">
              <PincodeCheckPanel />
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <Photo
              caption="Freshly cut tofu on a steel plate, a hand reaching in"
              src="/img/hero.svg"
              priority
            />
            <div className="mt-5">
              <HeroCta />
              <Meta className="mt-2 text-center text-cream/50">40 SECONDS · NO PAYMENT · NO ACCOUNT</Meta>
            </div>
          </div>
        </div>
      </Section>

      {/* 2 — Pincode check */}
      <Section ground="cream" rule className="md:hidden">
        <PincodeCheck />
      </Section>

      {/* 3 — Two products */}
      <Section ground="paper">
        <Eyebrow tone="vermilion">03 — TWO PRODUCTS</Eyebrow>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {shelf.map((p) => (
            <Link key={p.slug} href={`/${p.slug}`} className="flex bg-indigo text-cream">
              <div className={`w-[118px] shrink-0 border-r-[6px] ${SKU_BAR[p.sku]}`}>
                <Photo
                  caption={p.sku === 'classic' ? 'A tub of Classic tofu in a home fridge' : 'Masala tofu charring on a tawa'}
                  src={p.sku === 'classic' ? '/img/classic-tub.svg' : '/img/masala-tawa.svg'}
                  ratio="h-full min-h-[150px]"
                />
              </div>
              <div className="flex-1 p-4">
                <h3 className={`font-display text-sku uppercase ${SKU_TEXT[p.sku]}`}>{p.name}</h3>
                <p className="mt-1.5 text-body-sm text-cream/75">{p.line}</p>
                <p className="mt-3 font-display text-[20px] text-cream">
                  <Num>₹{p.price}</Num>
                  <span className="ml-1.5 font-mono text-[11px] tracking-[0.1em] text-cream/60">/ {p.netQty.toUpperCase()}</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* 4 — The honest comparison. The admission is the point of the block. */}
      <Section ground="cream">
        <Eyebrow tone="vermilion">04 — THE ARITHMETIC</Eyebrow>
        <Heading size="lg" className="mt-2 text-ink">
          Same protein, half the calories. Here is the arithmetic.
        </Heading>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="bg-indigo p-4 text-cream">
            <Meta className="text-marigold">{comparison.tofu.serving.toUpperCase()} TOFU</Meta>
            <p className="mt-1 font-display text-[40px] leading-none">
              <Num>{comparison.tofu.kcal}</Num>
              <span className="ml-1 font-mono text-[13px]">KCAL</span>
            </p>
            <dl className="mt-3 space-y-1 font-mono text-[11px] text-cream/70">
              <div className="flex justify-between"><dt>PROTEIN</dt><dd>{comparison.tofu.protein} G</dd></div>
              <div className="flex justify-between"><dt>SAT FAT</dt><dd>{comparison.tofu.satFat} G</dd></div>
              <div className="flex justify-between"><dt>CHOLESTEROL</dt><dd>{comparison.tofu.cholesterol} MG</dd></div>
            </dl>
          </div>
          <div className="border-2 border-stone bg-paper p-4">
            <Meta className="text-grey-warm">{comparison.paneer.serving.toUpperCase()} PANEER</Meta>
            <p className="mt-1 font-display text-[40px] leading-none text-ink">
              <Num>{comparison.paneer.kcal}</Num>
              <span className="ml-1 font-mono text-[13px]">KCAL</span>
            </p>
            <dl className="mt-3 space-y-1 font-mono text-[11px] text-grey-warm-dark">
              <div className="flex justify-between"><dt>PROTEIN</dt><dd>{comparison.paneer.protein} G</dd></div>
              <div className="flex justify-between"><dt>SAT FAT</dt><dd>{comparison.paneer.satFat} G</dd></div>
              <div className="flex justify-between"><dt>CHOLESTEROL</dt><dd>{comparison.paneer.cholesterol} MG</dd></div>
            </dl>
          </div>
        </div>

        <div className="mt-5">
          <PullQuote heading="WHERE PANEER WINS">{comparison.honesty}</PullQuote>
        </div>
        <Meta className="mt-4 text-grey-warm">SOURCE — {comparison.source.toUpperCase()}</Meta>
      </Section>

      {/* 5 — Teen cheezein. The ingredient list IS the hero element. */}
      <Section ground="indigo">
        <Eyebrow tone="marigold">05 — THREE THINGS</Eyebrow>
        <Photo
          caption="Soybeans in a steel bowl, water, muslin and the press"
          src="/img/ingredients.svg"
          className="mt-4"
        />

        <ol className="mt-6 font-mono text-[27px] font-semibold leading-[1.5] text-cream">
          <li>1 SOYBEAN</li>
          <li>2 WATER</li>
          <li>3 COAGULANT</li>
        </ol>
        <hr className="mt-4 h-[2px] w-full border-0 bg-vermilion" />

        <Heading size="sm" className="mt-4">
          That is the whole list.
        </Heading>
        <Body className="mt-2 text-cream/75">
          No starch, no preservative, no colour. Every tub carries its batch number and the date it was pressed. Saturday
          visits welcome — {brand.visitSlots}.
        </Body>
        <Link href="/kitchen" className="mt-4 inline-block font-mono text-[12px] uppercase tracking-[0.12em] text-marigold underline">
          See the kitchen →
        </Link>
      </Section>

      {/* 6 — The calculator */}
      <Section ground="paper" id="calculator">
        <Eyebrow tone="vermilion">06 — HOW MUCH</Eyebrow>
        <Heading size="lg" className="mt-2 text-ink">
          Work out what you need.
        </Heading>
        <Body className="mb-5 mt-2 text-grey-warm-dark">
          Not people × meals × 100 g — that is nonsense in an Indian kitchen, where a shared sabzi for four uses about
          60 g a head. Tell us what you already buy, or how you cook.
        </Body>
        <Calculator />
      </Section>

      {/* 7 — Recipes */}
      <Section ground="cream">
        <Eyebrow tone="vermilion">07 — HOW TO COOK IT</Eyebrow>
        <Heading size="md" className="mt-2 text-ink">
          Every recipe stays the same — tofu instead of paneer.
        </Heading>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {six.map((r) => (
            <Link key={r.slug} href={`/recipes/${r.slug}`} className="bg-paper">
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
        <Link href="/recipes" className="mt-4 inline-block font-mono text-[12px] uppercase tracking-[0.12em] text-indigo underline">
          All the recipes →
        </Link>
      </Section>

      {/* 8 — Kitchen, price and trust */}
      <Section ground="paper">
        <Eyebrow tone="vermilion">08 — THE KITCHEN</Eyebrow>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Photo caption="Hands at the press, half past six in the morning" src="/img/press.svg" ratio="h-[128px]" />
          <Photo caption="Tubs going into the insulated delivery bag" src="/img/delivery-bag.svg" ratio="h-[128px]" />
        </div>
        <Heading size="md" className="mt-5 text-ink">
          Two people, one kitchen, twice a week.
        </Heading>
        <Body className="mt-2 text-grey-warm-dark">
          {brand.founders.map((f) => `${f.name} ${f.role}`).join('; ')}. Come and see it — {brand.visitSlots}.
        </Body>

        <div className="mt-4">
          <Meta className="text-grey-warm">FSSAI LIC. NO. {FSSAI}</Meta>
          <Meta className="text-grey-warm">BATCH DAYS · {brand.batchDays.toUpperCase()}</Meta>
          <Meta className="text-grey-warm">DELIVERY · {brand.deliveryDays.toUpperCase()}</Meta>
        </div>

        {/* The price frame — prices arrive here, after the visitor wants it. */}
        <div className="mt-5 bg-cream p-4">
          <Meta className="text-grey-warm">BRANDED PANEER · 1 KG</Meta>
          <p className="font-mono text-[17px] text-grey-warm-dark line-through">{comparison.paneerRetailPerKg}</p>
          <Meta className="mt-3 text-grey-warm">MAHARAJA CLASSIC · 1 KG / 5 TUBS</Meta>
          <p className="font-display text-sku uppercase text-vermilion">₹395</p>
          <p className="mt-3 text-body-sm text-slate">
            Cheaper per kilo, half the calories, and the whole ingredient list fits on one line. Plans start at ₹155 a
            week.
          </p>
        </div>
      </Section>

      {/* 9 — Signup + ladder */}
      <Section ground="indigo" id="form">
        <Eyebrow tone="marigold">09 — FOUNDING 100</Eyebrow>
        <Heading size="lg" className="mt-2">
          The first 100 people are Founding Members
        </Heading>

        <div className="mt-5">
          <Scarcity />
        </div>
        <div className="mt-4">
          <Ladder />
        </div>

        <div className="mt-8">
          <SignupBlock />
        </div>
      </Section>

      {/* 10 — FAQ */}
      <Section ground="paper">
        <Eyebrow tone="vermilion">10 — QUESTIONS</Eyebrow>
        <div className="mt-4">
          <Faq />
        </div>
        <Meta className="mt-4 text-grey-warm">{faqs.length} QUESTIONS · ASK US ANYTHING ELSE ON WHATSAPP</Meta>
      </Section>
    </>
  )
}

/** Desktop keeps the pincode check inline in the hero; mobile gets block 2. */
function PincodeCheckPanel() {
  return (
    <div className="bg-cream p-4 text-ink">
      <PincodeCheck />
    </div>
  )
}
