'use client'

import { useState } from 'react'
import Image from 'next/image'
import { HeartIcon } from '../icons'
import { MainLayout } from '@/components/layout/MainLayout'
import { FilterTabs, type FilterTab } from '@/components/ui'
import { CharacterList, EpisodeList, LocationList } from '@/components/lists'
import { useFavoritesStore } from '@/lib/store/favorites'
import type { Character, Episode, LocationItem, FavoriteItem } from '@/lib/types'

function toCharacter(fav: FavoriteItem): Character {
  return {
    id: fav.id,
    name: fav.name,
    image: fav.image ?? '',
    status: fav.status ?? 'unknown',
    species: fav.species ?? '',
    type: '',
    gender: 'unknown',
    origin: fav.origin ?? { name: '', url: '' },
    location: { name: '', url: '' },
    episode: [],
    url: '',
    created: '',
  }
}

function toEpisode(fav: FavoriteItem): Episode {
  return {
    id: fav.id,
    name: fav.name,
    air_date: '',
    episode: fav.episode ?? '',
    characters: [],
    url: '',
    created: '',
  }
}

function toLocation(fav: FavoriteItem): LocationItem {
  return {
    id: fav.id,
    name: fav.name,
    type: '',
    dimension: '',
    residents: [],
    url: '',
    created: '',
  }
}

export function FavoritesPageClient() {
  const [activeTab, setActiveTab] = useState<FilterTab | null>(null)
  const { favorites } = useFavoritesStore()

  const characterFavs = favorites.filter((f) => f.type === 'character')
  const episodeFavs = favorites.filter((f) => f.type === 'episode')
  const locationFavs = favorites.filter((f) => f.type === 'location')

  const displayedCharacters = activeTab === 'characters' ? characterFavs : characterFavs.slice(0, 8)
  const displayedEpisodes = activeTab === 'episodes' ? episodeFavs : episodeFavs.slice(0, 5)
  const displayedLocations = activeTab === 'locations' ? locationFavs : locationFavs.slice(0, 7)

  const showCharacters = activeTab === null || activeTab === 'characters'
  const showEpisodes = activeTab === null || activeTab === 'episodes'
  const showLocations = activeTab === null || activeTab === 'locations'

  return (
    <MainLayout>
      <section className="border-b-2 dark:border-transparent border-cyan-primary dark:bg-black overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-stretch items-center">
          <div className="flex-1 flex flex-col justify-center w-full py-12 lg:py-0">
            <HeartIcon size={56} className="text-cyan-primary mb-4" strokeWidth={3} />
            <h1 className="text-[32px] leading-none font-bold sm:text-h1 text-foreground-strong">Todos os seus</h1>
            <h1 className="text-[32px] leading-none font-bold sm:text-h1 text-foreground-strong">
              <span className="text-cyan-primary">favoritos.</span>
            </h1>
          </div>
          <div className="relative flex-shrink-0 w-full lg:w-[435px] h-[300px] lg:h-[434px]">
            <div className="absolute inset-0">
              <Image
                src="/FavoriteImage.png"
                alt="Rick e Morty"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 py-12">
          <section className="flex items-center justify-end">
            <FilterTabs active={activeTab} onChange={setActiveTab} />
          </section>

          {showCharacters && (
            <CharacterList
              items={displayedCharacters.map(toCharacter)}
              isLoading={false}
              emptyMessage="Nenhum personagem favoritado ainda"
            />
          )}

          {showEpisodes && (
            <EpisodeList
              items={displayedEpisodes.map(toEpisode)}
              isLoading={false}
              emptyMessage="Nenhum episódio favoritado ainda"
            />
          )}

          {showLocations && (
            <LocationList
              items={displayedLocations.map(toLocation)}
              isLoading={false}
              emptyMessage="Nenhuma localização favoritada ainda"
            />
          )}
        </div>
      </div>
    </MainLayout>
  )
}
