'use client'

import { Suspense, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Disc } from 'lucide-react'
import { PlanetIcon, SmileyBlankIcon } from '@/components/icons'
import { MainLayout } from '@/components/layout'
import { LocationCard } from '@/components/cards'
import { FavoriteButton, Pagination, SkeletonCard } from '@/components/ui'
import { getLocation, getLocations } from '@/lib/api/locations'

function HeroSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse py-4">
      <div className="w-16 h-16 rounded-full bg-bg-surface" />
      <div className="h-10 bg-bg-surface rounded w-1/2" />
      <div className="flex gap-6">
        <div className="h-4 bg-bg-surface rounded w-24" />
        <div className="h-4 bg-bg-surface rounded w-32" />
      </div>
      <div className="h-4 bg-bg-surface rounded w-48" />
    </div>
  )
}

function LocationsPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedId = searchParams.get('id') ? Number(searchParams.get('id')) : null
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)

  const { data: location, isLoading: isLoadingLocation } = useQuery({
    queryKey: ['location', selectedId],
    queryFn: () => getLocation(selectedId!),
    enabled: !!selectedId,
    staleTime: 1000 * 60 * 5,
  })

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations', page],
    queryFn: () => getLocations(page),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  })

  function handleSelect(id: number) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    router.push(`/locations?id=${id}`, { scroll: false })
  }

  function changePage(next: number) {
    setPage(next)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const totalPages = locationsData?.info.pages ?? 1
  const locations = locationsData?.results ?? []

  const heroFavoriteItem = location
    ? { id: location.id, type: 'location' as const, name: location.name }
    : null

  return (
    <MainLayout>
      {selectedId && (
        <section key={selectedId} className="animate-hero-in border-b-2 dark:border-transparent border-cyan-primary dark:bg-black">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-52">
            {isLoadingLocation || !location ? (
              <HeroSkeleton />
            ) : (
              <div className="flex flex-col gap-6">
                <PlanetIcon size={64} className="text-foreground-strong" />

                <div className="flex items-center gap-4">
                  <h1 className="text-2xl sm:text-h1 font-bold text-foreground-strong">{location.name}</h1>
                  {heroFavoriteItem && <FavoriteButton item={heroFavoriteItem} size="lg" />}
                </div>

                <div className="flex items-center gap-6 text-h4 text-foreground-strong">
                  <div className="flex items-center gap-1.5">
                    <PlanetIcon size={16} className="flex-shrink-0" />
                    <span>{location.type || 'Planet'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Disc size={16} className="flex-shrink-0" />
                    <span>{location.dimension}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-h4 text-foreground-strong mt-10">
                  <SmileyBlankIcon size={16} className="flex-shrink-0" />
                  <span>{location.residents.length} Personagens localizados aqui</span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16" ref={listRef}>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} />

        <div className="flex items-center gap-3 my-8 lg:my-16">
          <PlanetIcon size={24} className="text-foreground flex-shrink-0" />
          <h3 className="text-h3 font-bold text-foreground">Localizações</h3>
        </div>

        {isLoadingLocations ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8 lg:mb-16">
            {Array.from({ length: 14 }).map((_, i) => (
              <SkeletonCard key={i} type="location" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8 lg:mb-16">
            {locations.map((loc) => (
              <LocationCard key={loc.id} location={loc} onSelect={() => handleSelect(loc.id)} />
            ))}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} />
      </div>
    </MainLayout>
  )
}

export default function LocationsPage() {
  return (
    <Suspense>
      <LocationsPageInner />
    </Suspense>
  )
}
