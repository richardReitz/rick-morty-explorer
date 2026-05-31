'use client'

import { SectionHeader, SkeletonCard, EmptyState } from '@/components/ui'
import { CharacterCard } from '@/components/cards'
import type { Character } from '@/lib/types'

interface CharacterListProps {
  items: Character[]
  isLoading: boolean
  emptyMessage?: string
  showViewAll?: boolean
}

export function CharacterList({ items, isLoading, emptyMessage, showViewAll = true }: CharacterListProps) {
  return (
    <section className="transition-opacity duration-200">
      <SectionHeader title="Personagens" href={showViewAll ? '/characters' : undefined} />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} type="character" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((char) => (
            <CharacterCard key={char.id} character={char} />
          ))}
        </div>
      )}
    </section>
  )
}
