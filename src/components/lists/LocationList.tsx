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
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 pb-2 sm:pb-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 sm:w-auto">
              <SkeletonCard type="location" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 pb-2 sm:pb-0">
          {items.map((loc) => (
            <div key={loc.id} className="flex-shrink-0 w-48 sm:w-auto">
              <LocationCard location={loc} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
