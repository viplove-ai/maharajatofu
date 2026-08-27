import type { Metadata } from 'next'
import { brand, privacy } from '@/content'
import { CONSENT_SUB, CONSENT_TEXT } from '@/lib/consent'
import { Body, Eyebrow, HeadingHi, Meta, Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What we keep, why, how long, and how to be deleted. Short because what we do is small.',
}

/**
 * Short, human, first-person. DPDP consent has to be informed, and a page nobody
 * can read informs nobody. Meta also requires a reachable privacy policy URL
 * before it will run lead ads.
 */
export default function PrivacyPage() {
  return (
    <Section ground="paper" className="pt-8">
      <Eyebrow tone="vermilion">PRIVACY</Eyebrow>
      <HeadingHi as="h1" size="lg" className="mt-2 text-ink">
        आपका number, आपका है।
      </HeadingHi>
      <Body className="mt-3 text-grey-warm-dark">
        We are {brand.name} — two people making tofu in Sector 10, Ghaziabad. This page is short because what we do with
        your details is small.
      </Body>

      <div className="mt-8 space-y-8">
        <div>
          <Meta className="text-vermilion">WHAT WE KEEP</Meta>
          <ul className="mt-2 space-y-1">
            {privacy.keeps.map((k) => (
              <li key={k} className="font-mono text-[13px] text-ink">
                — {k}
              </li>
            ))}
          </ul>
          <Body className="mt-3 text-grey-warm-dark">
            No house number, no flat number, no full address. Area and pincode are enough to plan a delivery route, and
            we would rather not hold something we do not need.
          </Body>
        </div>

        <div>
          <Meta className="text-vermilion">WHAT WE USE IT FOR</Meta>
          <ul className="mt-2 space-y-1">
            {privacy.uses.map((u) => (
              <li key={u} className="font-mono text-[13px] text-ink">
                — {u}
              </li>
            ))}
          </ul>
          <div className="mt-3 border-l-4 border-indigo bg-cream p-3">
            <p lang="hi" className="font-headline text-[15px] font-bold text-ink">
              {CONSENT_TEXT}
            </p>
            <p className="mt-1 text-body-sm text-grey-warm-dark">{CONSENT_SUB}</p>
          </div>
        </div>

        <div>
          <Meta className="text-vermilion">THE RULES</Meta>
          <ul className="mt-2 space-y-1.5">
            {privacy.rules.map((r) => (
              <li key={r} className="text-body text-ink">
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Meta className="text-vermilion">ADS</Meta>
          <Body className="mt-2 text-grey-warm-dark">
            We record which advertisement brought you here so we know which ones are worth paying for. Instagram never
            tells us who you are — only which creative you tapped — and we never link that to anything you did not type
            in yourself.
          </Body>
        </div>
      </div>
    </Section>
  )
}
