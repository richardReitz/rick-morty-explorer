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
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 pb-2 sm:pb-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-72 sm:w-auto">
              <SkeletonCard type="episode" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 pb-2 sm:pb-0">
          {items.map((ep) => (
            <div key={ep.id} className="flex-shrink-0 w-72 sm:w-auto">
              <EpisodeCard episode={ep} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
