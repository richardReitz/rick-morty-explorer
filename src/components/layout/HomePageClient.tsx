'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Hero, MainLayout } from '@/components/layout'
import {
  SearchBar,
  FilterTabs,
  SectionHeader,
  SkeletonCard,
  EmptyState,
  type FilterTab,
} from '@/components/ui'
import { CharacterCard, EpisodeCard, LocationCard } from '@/components/cards'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { getCharacters } from '@/lib/api/characters'
import { getEpisodes } from '@/lib/api/episodes'
import { getLocations } from '@/lib/api/locations'

export function HomePageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('characters')
  const debouncedQuery = useDebounce(searchQuery, 300)
  const charactersSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setActiveTab('characters')
  }, [debouncedQuery])

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

  function handleRickSanchezFilter() {
    setSearchQuery('Rick Sanchez')
    setTimeout(() => {
      charactersSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 350)
  }

  return (
    <MainLayout>
      <Hero onAccentClick={handleRickSanchezFilter} />

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

          {(!isSearching || activeTab === 'characters') && (
            <section
              ref={charactersSectionRef}
              id="characters-section"
              className="transition-opacity duration-200"
            >
              <SectionHeader title="Personagens" href="/characters" />
              {isLoadingCharacters ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} type="character" />
                  ))}
                </div>
              ) : characters.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(isSearching ? characters : characters.slice(0, 8)).map((char) => (
                    <CharacterCard key={char.id} character={char} />
                  ))}
                </div>
              )}
            </section>
          )}

          {(!isSearching || activeTab === 'episodes') && (
            <section className="transition-opacity duration-200">
              <SectionHeader title="Episódios" href="/episodes" />
              {isLoadingEpisodes ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <SkeletonCard key={i} type="episode" />
                  ))}
                </div>
              ) : episodes.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {(isSearching ? episodes : episodes.slice(0, 5)).map((ep) => (
                    <EpisodeCard key={ep.id} episode={ep} />
                  ))}
                </div>
              )}
            </section>
          )}

          {(!isSearching || activeTab === 'locations') && (
            <section className="transition-opacity duration-200">
              <SectionHeader title="Localizações" href="/locations" />
              {isLoadingLocations ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} type="location" />
                  ))}
                </div>
              ) : locations.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {(isSearching ? locations : locations.slice(0, 6)).map((loc) => (
                    <LocationCard key={loc.id} location={loc} />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
