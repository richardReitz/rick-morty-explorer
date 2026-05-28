'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { MainLayout } from '@/components/layout'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
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
import { useThemeStore } from '@/lib/store/theme'
import { getCharacters } from '@/lib/api/characters'
import { getEpisodes } from '@/lib/api/episodes'
import { getLocations } from '@/lib/api/locations'

const heroText = {
  dark: 'Ai sim, Porr#@%&*',
  light: 'Wubba Lubba Dub Dub! Cuidado com os olhos.',
}

export function HomePageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<FilterTab>('characters')
  const debouncedQuery = useDebounce(searchQuery, 300)
  const charactersSectionRef = useRef<HTMLElement>(null)
  const { theme } = useThemeStore()

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
      {/* Hero */}
      <section className="border-b border-cyan-primary dark:bg-black">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-h1 text-foreground underline underline-offset-4 decoration-foreground">
              Saiba tudo em um só{' '}
              <span className="text-cyan-primary decoration-cyan-primary">lugar.</span>
            </h1>
            <p className="text-h4 text-muted">
              Personagens, localizações, episódios e muito mais.
            </p>
            <ThemeToggle />
            <button
              onClick={handleRickSanchezFilter}
              className="text-body text-cyan-primary hover:underline underline-offset-2 transition-all block w-fit"
            >
              {heroText[theme]}
            </button>
          </div>
          <div className="relative flex-shrink-0 w-[340px] h-[320px] lg:w-[480px] lg:h-[420px]">
            <Image
              src={theme === 'dark' ? '/HighlightImage.png' : '/HighLightImage-w.png'}
              alt="Rick Sanchez"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 340px, 480px"
              priority
            />
          </div>
        </div>
      </section>

      {/* Search + Filters + Sections */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 py-12">
          <section className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full sm:w-80 lg:w-96"
            />
            <FilterTabs active={activeTab} onChange={setActiveTab} />
          </section>

          {/* Characters */}
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

          {/* Episodes */}
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

          {/* Locations */}
          {(!isSearching || activeTab === 'locations') && (
            <section className="transition-opacity duration-200">
              <SectionHeader title="Localizações" href="/locations" />
              {isLoadingLocations ? (
                <div
                  className={
                    isSearching
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'flex gap-4 overflow-x-auto pb-2'
                  }
                >
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={isSearching ? '' : 'min-w-[200px] flex-shrink-0'}
                    >
                      <SkeletonCard type="location" />
                    </div>
                  ))}
                </div>
              ) : locations.length === 0 ? (
                <EmptyState />
              ) : isSearching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {locations.map((loc) => (
                    <LocationCard key={loc.id} location={loc} />
                  ))}
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {locations.slice(0, 7).map((loc) => (
                    <div key={loc.id} className="min-w-[200px] flex-shrink-0">
                      <LocationCard location={loc} />
                    </div>
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
