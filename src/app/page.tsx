import Link from 'next/link'
import { CalculatorSignup } from '@/components/CalculatorSignup'
import { PincodeCheck } from '@/components/PincodeCheck'
import { StickyBar } from '@/components/StickyBar'
import { Button, Card, Eyebrow, H1, H2, Prose, Section, Stat, Wrap } from '@/components/ui'
import { PRODUCTS, BRANDED_PANEER_PRICE_PER_KG } from '@/content/products'
import { RECIPES } from '@/content/recipes'
import { SITE } from '@/lib/site'

export default function Home() {
  const featured = [...RECIPES.filter((r) => r.lane === 'quick').slice(0, 3), ...RECIPES.filter((r) => r.lane === 'family').slice(0, 3)]

  return (
    <>
      {/* Hero — one line, one button. No price here: quality first, price at
          the plans block, after somebody already wants it. */}
      <Section className="border-b-0 pt-12">
        <Wrap>
          <Eyebrow>Noida Sector 62 &amp; Vasundhara · launching soon</Eyebrow>
          <H1>
            Wahi sabzi.
            <br />
            <span className="text-accent">Aadhi calories.</span>
          </H1>
          <p className="mt-5 max-w-measure text-lg text-muted">
            Fresh soya tofu, made in Ghaziabad and delivered every {SITE.batchDays}. Three ingredients, a batch number on
            every tub, and it swaps straight into the paneer recipes you already cook.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/protein-calculator">Kitna chahiye? Calculate karein</Button>
            <Button href="/recipes" variant="ghost">
              See the recipes
            </Button>
          </div>
        </Wrap>
      </Section>

      <Section className="py-8">
        <Wrap>
          <PincodeCheck />
        </Wrap>
      </Section>

      <Section>
        <Wrap className="grid gap-4 sm:grid-cols-2">
          {PRODUCTS.map((p) => (
            <Card key={p.slug}>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
                {p.grams} g · ₹{p.pricePerKg}/kg
              </p>
              <h3 className="mt-1 font-display text-2xl font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted">{p.tagline}</p>
              <p className="mt-3 font-mono text-2xl font-semibold text-accent">₹{p.price}</p>
              <Link href={`/${p.slug}`} className="mt-3 inline-block text-sm font-semibold underline">
                What&rsquo;s in it →
              </Link>
            </Card>
          ))}
        </Wrap>
      </Section>

      {/* The credibility moment: we admit paneer wins on protein per 100 g. */}
      <Section>
        <Wrap>
          <H2>Same protein. Half the calories. Here&rsquo;s the arithmetic.</H2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="border-plant">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">18 g of protein from tofu</p>
              <p className="mt-1 font-mono text-3xl font-semibold text-plant">180 g</p>
              <p className="mt-1 text-sm text-muted">137 kcal · 0 mg cholesterol · ~2.7 g saturated fat</p>
            </Card>
            <Card>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">18 g of protein from paneer</p>
              <p className="mt-1 font-mono text-3xl font-semibold text-muted">100 g</p>
              <p className="mt-1 text-sm text-muted">265 kcal · cholesterol present · ~5–6 g saturated fat</p>
            </Card>
          </div>
          <Prose>
            <p className="mt-5 text-muted">
              Paneer has more protein per 100 g — we&rsquo;re not going to pretend otherwise. Matched on protein, tofu
              delivers it in roughly half the calories and half the saturated fat, with no cholesterol at all. That
              sentence is arithmetic, not marketing, which is why we&rsquo;re happy to show the working.
            </p>
          </Prose>
        </Wrap>
      </Section>

      {/* Teen cheezein — the trust argument, made entirely about ourselves. */}
      <Section>
        <Wrap>
          <Eyebrow>Teen cheezein</Eyebrow>
          <H2>Soybean. Water. Coagulant.</H2>
          <Prose>
            <p className="mt-4 text-muted">
              That is the whole ingredient list for Classic Firm Tofu. There is no expensive fat in tofu to quietly swap
              out for something cheaper, which is most of why we can print the list this short and mean it.
            </p>
            <p className="text-muted">
              Every tub carries a batch number and the date we made it — not just a best-before. And if you ever want to
              see the kitchen, ask. We&rsquo;ll show you.
            </p>
          </Prose>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <Stat value="3" label="Ingredients in Classic" />
            <Stat value="2×" label="Batches a week, made fresh" />
            <Stat value="0 mg" label="Cholesterol, structurally" />
            <Stat value="5 km" label="From our kitchen to your door" />
          </div>
        </Wrap>
      </Section>

      <Section id="calculator">
        <Wrap>
          <Eyebrow>The calculator</Eyebrow>
          <H2>How much do you actually need?</H2>
          <p className="mb-6 mt-2 max-w-measure text-muted">
            Not people × meals × 100 g — that&rsquo;s nonsense in an Indian kitchen, where a shared sabzi for four uses
            about 60 g a head. Tell us what you already buy, or how you cook, and we&rsquo;ll work it out properly.
          </p>
          <CalculatorSignup />
        </Wrap>
      </Section>

      <Section>
        <Wrap>
          <H2>&ldquo;Main ise banaungi kaise?&rdquo;</H2>
          <p className="mb-6 mt-2 text-muted">Sixteen recipes. Half of them take under five minutes.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => (
              <Link key={r.slug} href={`/recipes/${r.slug}`} className="rounded border border-line bg-surface p-4 hover:border-accent">
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-plant">{r.time}</p>
                <h3 className="mt-1 font-display text-lg font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted">{r.hook}</p>
              </Link>
            ))}
          </div>
          <Button href="/recipes" variant="ghost" className="mt-6">
            All sixteen recipes
          </Button>
        </Wrap>
      </Section>

      <Section className="border-b-0">
        <Wrap>
          <H2>Cheaper than the branded paneer you&rsquo;re buying</H2>
          <Prose>
            <p className="mt-3 text-muted">
              Branded paneer in NCR typically runs ₹{BRANDED_PANEER_PRICE_PER_KG.low}–{BRANDED_PANEER_PRICE_PER_KG.high} a
              kilo. Classic Firm Tofu is ₹395. On a straight recipe swap you spend a little less, eat around half the
              calories, and know exactly what is in it.
            </p>
          </Prose>
          <Button href="/plans" className="mt-5">
            See the plans
          </Button>
        </Wrap>
      </Section>

      <StickyBar href="/#signup" />
    </>
  )
}
