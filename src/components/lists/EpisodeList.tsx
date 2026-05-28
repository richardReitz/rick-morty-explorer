'use client'

import { SectionHeader, SkeletonCard, EmptyState } from '@/components/ui'
import { EpisodeCard } from '@/components/cards'
import type { Episode } from '@/lib/types'

interface EpisodeListProps {
  items: Episode[]
  isLoading: boolean
}

export function EpisodeList({ items, isLoading }: EpisodeListProps) {
  return (
    <section className="transition-opacity duration-200">
      <SectionHeader title="Episódios" href="/episodes" />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} type="episode" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {items.map((ep) => (
            <EpisodeCard key={ep.id} episode={ep} />
          ))}
        </div>
      )}
    </section>
  )
}
