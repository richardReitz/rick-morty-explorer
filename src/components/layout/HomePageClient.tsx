'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Hero, MainLayout } from '@/components/layout'
import {
  SearchBar,
  FilterTabs,
  type FilterTab,
} from '@/components/ui'
import { CharacterList, EpisodeList, LocationList } from '@/components/lists'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { getCharacters } from '@/lib/api/characters'
import { getEpisodes } from '@/lib/api/episodes'
import { getLocations } from '@/lib/api/locations'
import { QUERY_STALE_TIME } from '@/lib/queryConfig'

export function HomePageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab | null>(null)
  const debouncedQuery = useDebounce(searchQuery, 300)

  const { data: charactersData, isLoading: isLoadingCharacters } = useQuery({
    queryKey: ['characters', debouncedQuery],
    queryFn: () => getCharacters(1, debouncedQuery || undefined),
    staleTime: QUERY_STALE_TIME,
  })

  const { data: episodesData, isLoading: isLoadingEpisodes } = useQuery({
    queryKey: ['episodes', debouncedQuery],
    queryFn: () => getEpisodes(1, debouncedQuery || undefined),
    staleTime: QUERY_STALE_TIME,
  })

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations', debouncedQuery],
    queryFn: () => getLocations(1, debouncedQuery || undefined),
    staleTime: QUERY_STALE_TIME,
  })

  const characters = charactersData?.results ?? []
  const episodes = episodesData?.results ?? []
  const locations = locationsData?.results ?? []
  const isSearching = debouncedQuery.length > 0

  return (
    <MainLayout>
      <Hero />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 py-12">
          <section className="flex items-center justify-between gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              className="flex-1 lg:flex-none lg:w-96"
            />
            <FilterTabs active={activeTab} onChange={setActiveTab} />
          </section>

          {(activeTab === null || activeTab === 'characters') && (
            <CharacterList
              items={isSearching ? characters : characters.slice(0, 8)}
              isLoading={isLoadingCharacters}
            />
          )}

          {(activeTab === null || activeTab === 'episodes') && (
            <EpisodeList
              items={isSearching ? episodes : episodes.slice(0, 5)}
              isLoading={isLoadingEpisodes}
            />
          )}

          {(activeTab === null || activeTab === 'locations') && (
            <LocationList
              items={isSearching ? locations : locations.slice(0, 6)}
              isLoading={isLoadingLocations}
            />
          )}
        </div>
      </div>
    </MainLayout>
  )
}
