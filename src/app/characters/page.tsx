'use client'

import { Suspense } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import Image from 'next/image'
import { Activity, CircleQuestionMark, TvMinimalPlay } from 'lucide-react'
import { AlienIcon, GenderFemaleIcon, GenderMaleIcon, SmileyBlankIcon } from '@/components/icons'
import { MainLayout, DetailHeroSection } from '@/components/layout'
import { CharacterCard, LocationCard } from '@/components/cards'
import { FavoriteButton, Pagination, SkeletonCard, DetailHeroSkeleton, SectionHeaderWithIcon } from '@/components/ui'
import { getCharacter, getCharacters } from '@/lib/api/characters'
import { getLocation } from '@/lib/api/locations'
import { useDetailNavigation } from '@/lib/hooks/useDetailNavigation'
import { QUERY_STALE_TIME } from '@/lib/queryConfig'
import type { Character, CharacterGender } from '@/lib/types'

const statusLabel: Record<Character['status'], string> = {
  Alive: 'Vivo',
  Dead: 'Morto',
  unknown: 'Desconhecido',
}

function extractId(url: string): number | null {
  if (!url) return null
  const id = url.split('/').pop()
  return id && id !== '' ? Number(id) : null
}

function renderGenderIcon(gender: CharacterGender): React.ReactNode {
  if (gender === 'Male') return <GenderMaleIcon size={24} className="flex-shrink-0" />
  if (gender === 'Female') return <GenderFemaleIcon size={24} className="flex-shrink-0" />
  return <CircleQuestionMark size={24} className="flex-shrink-0" />
}

function CharactersPageInner() {
  const { selectedId, page, listRef, handleSelect, changePage } = useDetailNavigation('characters')

  const { data: character, isLoading: isLoadingCharacter } = useQuery({
    queryKey: ['character', selectedId],
    queryFn: () => getCharacter(selectedId!),
    enabled: !!selectedId,
    staleTime: QUERY_STALE_TIME,
  })

  const originId = character ? extractId(character.origin.url) : null
  const locationId = character ? extractId(character.location.url) : null

  const { data: originLocation } = useQuery({
    queryKey: ['location', originId],
    queryFn: () => getLocation(originId!),
    enabled: !!originId,
    staleTime: QUERY_STALE_TIME,
  })

  const { data: currentLocation } = useQuery({
    queryKey: ['location', locationId],
    queryFn: () => getLocation(locationId!),
    enabled: !!locationId,
    staleTime: QUERY_STALE_TIME,
  })

  const { data: charactersData, isLoading: isLoadingCharacters } = useQuery({
    queryKey: ['characters', page],
    queryFn: () => getCharacters(page),
    staleTime: QUERY_STALE_TIME,
    placeholderData: keepPreviousData,
  })

  const totalPages = charactersData?.info.pages ?? 1
  const characters = charactersData?.results ?? []

  const heroFavoriteItem = character
    ? {
        id: character.id,
        type: 'character' as const,
        name: character.name,
        image: character.image,
        status: character.status,
        species: character.species,
        origin: character.origin,
      }
    : null

  return (
    <MainLayout>
      <DetailHeroSection
        selectedId={selectedId}
        isLoading={isLoadingCharacter || !character}
        skeleton={<DetailHeroSkeleton variant="character" />}
      >
        {character && (
          <div className="flex flex-col sm:flex-row gap-16">
            <div className="flex-shrink-0">
              <div className="relative w-full sm:w-[360px] h-64 sm:h-[440px] rounded-2xl overflow-hidden">
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 369px"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col gap-8 flex-1 min-w-0">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl sm:text-h1 font-bold text-foreground-strong">{character.name}</h1>
                {heroFavoriteItem && <FavoriteButton item={heroFavoriteItem} size="lg" />}
              </div>

              <div className="flex items-center gap-2 text-foreground-strong text-h4">
                <TvMinimalPlay size={20} className="flex-shrink-0" />
                <span>Participou de {character.episode.length} episódios</span>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-h4 text-foreground-strong mt-3">
                <div className="flex items-center gap-1.5">
                  <Activity size={24} className="flex-shrink-0 text-lime-brand" />
                  <span>{statusLabel[character.status]}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlienIcon size={24} className="flex-shrink-0" />
                  <span>{character.species}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {renderGenderIcon(character.gender)}
                  <span>{character.gender}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 mt-6 sm:self-end">
                {originLocation && (
                  <div className="flex-1">
                    <LocationCard location={originLocation} />
                  </div>
                )}
                {currentLocation && (
                  <div className="flex-1">
                    <LocationCard location={currentLocation} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </DetailHeroSection>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16" ref={listRef}>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} />

        <SectionHeaderWithIcon icon={<SmileyBlankIcon size={24} className="text-foreground flex-shrink-0" />}>
          Mais<br />personagens
        </SectionHeaderWithIcon>

        {isLoadingCharacters ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 lg:mb-16">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} type="character" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 lg:mb-16">
            {characters.map((char) => (
              <CharacterCard key={char.id} character={char} onSelect={() => handleSelect(char.id)} />
            ))}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} />
      </div>
    </MainLayout>
  )
}

export default function CharactersPage() {
  return (
    <Suspense>
      <CharactersPageInner />
    </Suspense>
  )
}
