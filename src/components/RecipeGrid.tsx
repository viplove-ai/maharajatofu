'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Recipe } from '@/content'
import { Photo } from './Photo'
import { Meta } from './ui'

const FILTERS = [
  { key: 'all', label: 'सब' },
  { key: 'quick', label: 'Under 5 minutes' },
  { key: 'family', label: 'Family dinner' },
] as const

export function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  const [filter, setFilter] = useState<'all' | 'quick' | 'family'>('all')
  const shown = filter === 'all' ? recipes : recipes.filter((r) => r.tag === filter)

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            aria-pressed={filter === f.key}
            className={`h-target border-2 border-indigo px-4 text-[13.5px] font-semibold ${
              filter === f.key ? 'bg-indigo text-cream' : 'bg-transparent text-indigo'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {shown.map((r) => (
          <Link key={r.slug} href={`/recipes/${r.slug}`} className="bg-paper">
            <Photo caption={r.name} on="cream" ratio="aspect-[4/3]" />
            <div className="p-3">
              <h3 lang="hi" className="font-headline text-[14.5px] font-bold text-ink">
                {r.name}
              </h3>
              <Meta className="mt-1 text-grey-warm">
                {r.minutes} MIN · {r.packs} {r.packs === 1 ? 'PACK' : 'PACKS'}
              </Meta>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
