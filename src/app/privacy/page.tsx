import type { Metadata } from 'next'
import { CONSENT_TEXT } from '@/lib/consent'
import { H1, H2, Prose, Section, Wrap } from '@/components/ui'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What we collect, why, how long we keep it, and how to be removed.',
}

/**
 * Short and readable on purpose. DPDP consent has to be informed, and a page
 * nobody can read does not inform anybody. Meta also requires a reachable
 * privacy policy URL before it will run lead ads.
 */
export default function PrivacyPage() {
  return (
    <Section className="border-b-0 pt-12">
      <Wrap className="max-w-2xl">
        <H1>Privacy</H1>
        <Prose>
          <p className="mt-5 text-muted">
            We are {SITE.name}, two people making tofu in Sector 10, Ghaziabad. This page says exactly what we do with
            your details. It is short because what we do is small.
          </p>

          <H2>What we collect</H2>
          <p className="text-muted">
            Your first name, your phone number, your area and your pincode. If you use the calculator, we also store what
            it worked out, so we don&rsquo;t have to ask you again. That is everything.
          </p>
          <p className="text-muted">
            <strong>We deliberately do not ask for your house or flat number.</strong> Area and pincode are enough to
            plan a delivery route, and we would rather not hold an address we don&rsquo;t need.
          </p>

          <H2>Why</H2>
          <p className="text-muted">
            To message you once when we launch, with your early-bird coupon, and to work out which areas to deliver to
            first. That is the entire purpose. You agreed to this when you ticked the box, which said:
          </p>
          <p className="rounded border border-line bg-surface p-4 text-[15px]">{CONSENT_TEXT}</p>

          <H2>Who we share it with</H2>
          <p className="text-muted">
            Nobody. We do not sell, rent, swap or share your number with anyone, and we do not send anything on behalf of
            another business.
          </p>

          <H2>How long we keep it</H2>
          <p className="text-muted">
            Until you ask us to delete it, or until six months after launch if you never order — whichever comes first.
            If we decide not to launch at all, we delete the whole list.
          </p>

          <H2>Getting removed</H2>
          <p className="text-muted">
            Reply &ldquo;STOP&rdquo; to any WhatsApp message from us, or message us asking to be deleted. We remove you
            the same day and confirm that we have.
          </p>

          <H2>Cookies</H2>
          <p className="text-muted">
            We record which advertisement brought you here so we know which ones are worth paying for. We do not use that
            to identify you, and it is never linked to anything you didn&rsquo;t type in yourself.
          </p>
        </Prose>
      </Wrap>
    </Section>
  )
}
