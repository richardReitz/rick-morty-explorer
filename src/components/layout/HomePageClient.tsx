'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Hero, MainLayout } from '@/components/layout'
import {
  SearchBar,
  FilterTabs,
  type FilterTab,
} from '@/components/ui'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { getCharacters } from '@/lib/api/characters'
import { getEpisodes } from '@/lib/api/episodes'
import { getLocations } from '@/lib/api/locations'

export function HomePageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab | null>(null)
  const debouncedQuery = useDebounce(searchQuery, 300)

  const { data: charactersData, isLoading: isLoadingCharacters } = useQuery({
    queryKey: ['characters', debouncedQuery],
    queryFn: () => getCharacters(1, debouncedQuery || undefined),
    staleTime: 1000 * 60 * 5,
  })

  const { data: episodesData, isLoading: isLoadingEpisodes } = useQuery({
    queryKey: ['episodes', debouncedQuery],
    queryFn: () => getEpisodes(1, debouncedQuery || undefined),
    staleTime: 1000 * 60 * 5,
  })

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations', debouncedQuery],
    queryFn: () => getLocations(1, debouncedQuery || undefined),
    staleTime: 1000 * 60 * 5,
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
          <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full sm:w-80 lg:w-96"
            />
            <FilterTabs active={activeTab} onChange={setActiveTab} />
          </section>

          {/* Seções de lista serão adicionadas na Task 6 */}
        </div>
      </div>
    </MainLayout>
  )
}
