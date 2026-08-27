import type { Metadata } from 'next'
import { ThanksView } from '@/components/ThanksView'

export const metadata: Metadata = { title: 'हो गया', robots: { index: false } }

export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; rank?: string; tier?: string }>
}) {
  const { code, rank, tier } = await searchParams
  return <ThanksView code={code} rank={rank ? Number(rank) : undefined} tier={tier} />
}
