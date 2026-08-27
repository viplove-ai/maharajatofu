import type { Metadata } from 'next'
import { recipes, recipesNote } from '@/content'
import { RecipeGrid } from '@/components/RecipeGrid'
import { Body, Eyebrow, Heading, Meta, Section } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Recipes — every recipe the same, tofu instead of paneer',
  description:
    'Tofu recipes for Indian kitchens: under five minutes, or a family dinner. Every one is a paneer recipe with the paneer swapped 1:1.',
}

export default function RecipesPage() {
  return (
    <>
      <Section ground="indigo" className="pt-8">
        <Eyebrow tone="marigold">RECIPES</Eyebrow>
        <Heading as="h1" size="lg" className="mt-2">
          How do I cook it?
        </Heading>
        <Body className="mt-3 text-cream/80">
          The question that stops most people buying tofu. Every recipe here is one you already cook — the masala dabba
          stays exactly as it is.
        </Body>
      </Section>

      <Section ground="cream">
        <RecipeGrid recipes={recipes} />
        <Meta className="mt-5 text-grey-warm">{recipesNote.toUpperCase()}</Meta>
      </Section>
    </>
  )
}
