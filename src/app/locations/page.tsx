'use client'

import { Suspense } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Disc } from 'lucide-react'
import { PlanetIcon, SmileyBlankIcon } from '@/components/icons'
import { MainLayout, DetailHeroSection } from '@/components/layout'
import { LocationCard } from '@/components/cards'
import { FavoriteButton, Pagination, SkeletonCard, DetailHeroSkeleton, SectionHeaderWithIcon } from '@/components/ui'
import { getLocation, getLocations } from '@/lib/api/locations'
import { useDetailNavigation } from '@/lib/hooks/useDetailNavigation'
import { QUERY_STALE_TIME } from '@/lib/queryConfig'

function LocationsPageInner() {
  const { selectedId, page, listRef, handleSelect, changePage } = useDetailNavigation('locations')

  const { data: location, isLoading: isLoadingLocation } = useQuery({
    queryKey: ['location', selectedId],
    queryFn: () => getLocation(selectedId!),
    enabled: !!selectedId,
    staleTime: QUERY_STALE_TIME,
  })

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations', page],
    queryFn: () => getLocations(page),
    staleTime: QUERY_STALE_TIME,
    placeholderData: keepPreviousData,
  })

  const totalPages = locationsData?.info.pages ?? 1
  const locations = locationsData?.results ?? []

  const heroFavoriteItem = location
    ? { id: location.id, type: 'location' as const, name: location.name }
    : null

  return (
    <MainLayout>
      <DetailHeroSection
        selectedId={selectedId}
        isLoading={isLoadingLocation || !location}
        skeleton={<DetailHeroSkeleton variant="location" />}
        innerClassName="py-10 pb-52"
      >
        {location && (
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
      </DetailHeroSection>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16" ref={listRef}>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} />

        <SectionHeaderWithIcon icon={<PlanetIcon size={24} className="text-foreground flex-shrink-0" />}>
          Mais<br />localizações
        </SectionHeaderWithIcon>

        {isLoadingLocations ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 pt-2 mb-8 lg:mb-16">
            {Array.from({ length: 14 }).map((_, i) => (
              <SkeletonCard key={i} type="location" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 pt-2 mb-8 lg:mb-16">
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
