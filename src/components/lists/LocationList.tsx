'use client'

import { SectionHeader, SkeletonCard, EmptyState } from '@/components/ui'
import { LocationCard } from '@/components/cards'
import type { LocationItem } from '@/lib/types'

interface LocationListProps {
  items: LocationItem[]
  isLoading: boolean
  emptyMessage?: string
}

export function LocationList({ items, isLoading, emptyMessage }: LocationListProps) {
  return (
    <section className="transition-opacity duration-200">
      <SectionHeader title="Localizações" href="/locations" />
      {isLoading ? (
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2 pb-2 sm:pb-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48 sm:w-auto">
              <SkeletonCard type="location" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-2 pb-2 sm:pb-0">
            {items.map((loc) => (
              <div key={loc.id} className="flex-shrink-0 w-48 snap-start sm:w-auto">
                <LocationCard location={loc} />
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--bg-primary)] to-transparent sm:hidden" />
        </div>
      )}
    </section>
  )
}
