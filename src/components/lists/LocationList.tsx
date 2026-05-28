'use client'

import { SectionHeader, SkeletonCard, EmptyState } from '@/components/ui'
import { LocationCard } from '@/components/cards'
import type { LocationItem } from '@/lib/types'

interface LocationListProps {
  items: LocationItem[]
  isLoading: boolean
}

export function LocationList({ items, isLoading }: LocationListProps) {
  return (
    <section className="transition-opacity duration-200">
      <SectionHeader title="Localizações" href="/locations" />
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} type="location" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {items.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </div>
      )}
    </section>
  )
}
