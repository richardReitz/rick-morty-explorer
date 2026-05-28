'use client'

import { SectionHeader, SkeletonCard, EmptyState } from '@/components/ui'
import { CharacterCard } from '@/components/cards'
import type { Character } from '@/lib/types'

interface CharacterListProps {
  items: Character[]
  isLoading: boolean
}

export function CharacterList({ items, isLoading }: CharacterListProps) {
  return (
    <section className="transition-opacity duration-200">
      <SectionHeader title="Personagens" href="/characters" />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} type="character" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
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
