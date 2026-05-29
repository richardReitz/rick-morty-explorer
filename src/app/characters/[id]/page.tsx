'use client'

import { useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Dna,
  Tv,
  User,
  Users,
} from 'lucide-react'
import { MainLayout } from '@/components/layout'
import { CharacterCard, LocationCard } from '@/components/cards'
import { FavoriteButton, SkeletonCard } from '@/components/ui'
import { getCharacter, getCharacters } from '@/lib/api/characters'
import { getLocation } from '@/lib/api/locations'
import type { Character } from '@/lib/types'

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

function HeroSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-8 animate-pulse">
      <div className="flex-shrink-0 w-full sm:w-[369px] h-[461px] bg-bg-surface rounded-lg" />
      <div className="flex-1 space-y-4 py-2">
        <div className="h-10 bg-bg-surface rounded w-2/3" />
        <div className="h-4 bg-bg-surface rounded w-1/3" />
        <div className="flex gap-4">
          <div className="h-4 bg-bg-surface rounded w-16" />
          <div className="h-4 bg-bg-surface rounded w-20" />
          <div className="h-4 bg-bg-surface rounded w-14" />
        </div>
        <div className="flex gap-6 mt-6">
          <div className="flex-1 h-36 bg-bg-surface rounded-2xl" />
          <div className="flex-1 h-36 bg-bg-surface rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

const PAGE_WINDOW = 4

function getPaginationRange(current: number, total: number): number[] {
  const half = Math.floor(PAGE_WINDOW / 2)
  let start = Math.max(1, current - half)
  const end = Math.min(total, start + PAGE_WINDOW - 1)
  start = Math.max(1, end - PAGE_WINDOW + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default function CharacterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const characterId = Number(id)
  const [page, setPage] = useState(1)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { data: character, isLoading: isLoadingCharacter } = useQuery({
    queryKey: ['character', characterId],
    queryFn: () => getCharacter(characterId),
    staleTime: 1000 * 60 * 5,
  })

  const originId = character ? extractId(character.origin.url) : null
  const locationId = character ? extractId(character.location.url) : null

  const { data: originLocation } = useQuery({
    queryKey: ['location', originId],
    queryFn: () => getLocation(originId!),
    enabled: !!originId,
    staleTime: 1000 * 60 * 5,
  })

  const { data: currentLocation } = useQuery({
    queryKey: ['location', locationId],
    queryFn: () => getLocation(locationId!),
    enabled: !!locationId,
    staleTime: 1000 * 60 * 5,
  })

  const { data: charactersData, isLoading: isLoadingCharacters } = useQuery({
    queryKey: ['characters', page],
    queryFn: () => getCharacters(page),
    staleTime: 1000 * 60 * 5,
  })

  const otherCharacters =
    charactersData?.results.filter((c) => c.id !== characterId).slice(0, 12) ?? []
  const totalPages = charactersData?.info.pages ?? 1
  const pageRange = getPaginationRange(page, totalPages)

  function changePage(next: number) {
    setPage(next)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const heroFavoriteItem = character
    ? {
        id: character.id,
        type: 'character' as const,
        name: character.name,
        image: character.image,
      }
    : null

  return (
    <MainLayout>
      {/* Hero */}
      <section className="border-b-2 dark:border-transparent border-cyan-primary dark:bg-black">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {isLoadingCharacter || !character ? (
            <HeroSkeleton />
          ) : (
            <div className="flex flex-col sm:flex-row gap-16">
              <div className="flex-shrink-0">
                <div className="relative w-full sm:w-[369px] h-[461px] rounded-lg overflow-hidden ring-2 ring-cyan-primary">
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

              <div className="flex flex-col gap-8 justify-center flex-1 min-w-0">
                <div className="flex items-center gap-4">
                  <h1 className="text-h1 font-bold text-foreground-strong">{character.name}</h1>
                  {heroFavoriteItem && <FavoriteButton item={heroFavoriteItem} size="lg" />}
                </div>

                <div className="flex items-center gap-2 text-foreground-strong text-body">
                  <Tv size={16} className="flex-shrink-0" />
                  <span>Participou de {character.episode.length} episódios</span>
                </div>

                <div className="flex flex-wrap items-center gap-5 text-body text-foreground-strong mt-3">
                  <div className="flex items-center gap-1.5">
                    <Activity size={16} className="flex-shrink-0 text-lime-brand" />
                    <span>{statusLabel[character.status]}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={16} className="flex-shrink-0" />
                    <span>{character.species}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Dna size={16} className="flex-shrink-0" />
                    <span>{character.gender}</span>
                  </div>
                </div>

                <div className="flex flex-row gap-6 mt-2 self-end">
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
        </div>
      </section>

      {/* Separator */}
      <div className="border-b border-cyan-primary" />

      {/* More characters */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10" ref={sectionRef}>
        <div className="flex items-center gap-3 mb-8">
          <Users size={24} className="text-foreground flex-shrink-0" />
          <h3 className="text-h3 font-bold text-foreground">Mais personagens</h3>
        </div>

        {isLoadingCharacters ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} type="character" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherCharacters.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-16">
          <button
            onClick={() => changePage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="w-12 h-12 flex items-center justify-center rounded-full text-foreground hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft size={32} />
          </button>

          {pageRange.map((p) => (
            <button
              key={p}
              onClick={() => changePage(p)}
              className={`w-12 h-12 flex items-center justify-center rounded-full text-body font-medium transition-colors ${
                p === page
                  ? 'bg-cyan-primary text-white border-2 border-cyan-primary'
                  : 'bg-transparent text-foreground border-2 border-foreground hover:border-cyan-primary hover:text-cyan-primary'
              }`}
              aria-label={`Página ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => changePage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="w-12 h-12 flex items-center justify-center rounded-full text-foreground hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Próxima página"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </MainLayout>
  )
}
