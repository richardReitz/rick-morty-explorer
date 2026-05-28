'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { MainLayout } from '@/components/layout'
import {
  SearchBar,
  FilterTabs,
  SectionHeader,
  SkeletonCard,
  EmptyState,
  Button,
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
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="my-8 bg-gradient-to-br from-bg-primary to-bg-secondary border border-bg-surface rounded-2xl px-8 lg:px-16 py-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 className="text-h1 text-foreground">
              Saiba tudo em um só{' '}
              <span className="text-cyan-primary">lugar.</span>
            </h1>
            <p className="text-h4 text-muted">
              Personagens, localizações, episódios e muito mais.
            </p>
            <div className="flex gap-3 justify-center lg:justify-start">
              <Button variant="primary" size="md">Entrar</Button>
              <Button variant="secondary" size="md">Criar</Button>
            </div>
            <button
              onClick={handleRickSanchezFilter}
              className="text-body text-cyan-primary hover:underline underline-offset-2 transition-all block mx-auto lg:mx-0 w-fit"
            >
              Veja todas as Rick Sanchez com os filtros
            </button>
          </div>
          <div className="hidden lg:block relative w-64 h-64 flex-shrink-0">
            <Image
              src="https://rickandmortyapi.com/api/character/avatar/1.jpeg"
              alt="Rick Sanchez"
              fill
              className="object-cover rounded-full dark:opacity-60 dark:brightness-75"
              sizes="256px"
            />
          </div>
        </section>

        {/* Search + Filters + Sections */}
        <div className="space-y-12 pb-16">
          <section className="space-y-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            {isSearching && (
              <FilterTabs active={activeTab} onChange={setActiveTab} />
            )}
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
                <div
                  className={
                    isSearching
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'flex gap-4 overflow-x-auto pb-2'
                  }
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={isSearching ? '' : 'min-w-[320px] flex-shrink-0'}
                    >
                      <SkeletonCard type="episode" />
                    </div>
                  ))}
                </div>
              ) : episodes.length === 0 ? (
                <EmptyState />
              ) : isSearching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {episodes.map((ep) => (
                    <EpisodeCard key={ep.id} episode={ep} />
                  ))}
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {episodes.slice(0, 6).map((ep) => (
                    <div key={ep.id} className="min-w-[320px] flex-shrink-0">
                      <EpisodeCard episode={ep} />
                    </div>
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
