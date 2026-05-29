'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import { HeartIcon } from '../icons'
import { MainLayout } from '@/components/layout/MainLayout'
import { FilterTabs, type FilterTab, EmptyState, Button } from '@/components/ui'
import { CharacterCard } from '@/components/cards/CharacterCard'
import { EpisodeCard } from '@/components/cards/EpisodeCard'
import { LocationCard } from '@/components/cards/LocationCard'
import { useFavoritesStore } from '@/lib/store/favorites'
import { useThemeStore } from '@/lib/store/theme'
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
    episode: '',
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
  const { theme } = useThemeStore()

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
            <HeartIcon size={56} className="text-cyan-primary mb-4" strokeWidth={1.5} />
            <h1 className="text-[32px] sm:text-h1 text-foreground">Todos os seus</h1>
            <h1 className="text-[32px] sm:text-h1 text-foreground">
              <span className="text-cyan-primary">favoritos.</span>
            </h1>
          </div>
          <div className="relative flex-shrink-0 w-full lg:w-[435px] h-[300px] lg:h-[434px]">
            <div className="absolute inset-0">
              <Image
                src={theme === 'dark' ? '/HighlightImage.png' : '/HighLightImage-w.png'}
                alt="Rick e Morty"
                fill
                className="object-cover"
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
            <section className="transition-opacity duration-200">
              <div className="flex items-center mb-8 gap-4">
                <h3 className="text-h3 font-bold text-foreground">Personagens</h3>
                {activeTab !== 'characters' && (
                  <Button variant="primary" size="sm" asChild>
                    <Link href="/characters">
                      <LayoutGrid size={14} />
                      Ver todos
                    </Link>
                  </Button>
                )}
              </div>
              {characterFavs.length === 0 ? (
                <EmptyState message="Nenhum personagem favoritado ainda" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {displayedCharacters.map((fav) => (
                    <CharacterCard key={fav.id} character={toCharacter(fav)} />
                  ))}
                </div>
              )}
            </section>
          )}

          {showEpisodes && (
            <section className="transition-opacity duration-200">
              <div className="flex items-center mb-8 gap-4">
                <h3 className="text-h3 font-bold text-foreground">Episódios</h3>
                {activeTab !== 'episodes' && (
                  <Button variant="primary" size="sm" asChild>
                    <Link href="/episodes">
                      <LayoutGrid size={14} />
                      Ver todos
                    </Link>
                  </Button>
                )}
              </div>
              {episodeFavs.length === 0 ? (
                <EmptyState message="Nenhum episódio favoritado ainda" />
              ) : (
                <div className="flex overflow-x-auto gap-4 pb-2">
                  {displayedEpisodes.map((fav) => (
                    <div key={fav.id} className="flex-shrink-0 w-72">
                      <EpisodeCard episode={toEpisode(fav)} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {showLocations && (
            <section className="transition-opacity duration-200">
              <div className="flex items-center mb-8 gap-4">
                <h3 className="text-h3 font-bold text-foreground">Localizações</h3>
                {activeTab !== 'locations' && (
                  <Button variant="primary" size="sm" asChild>
                    <Link href="/locations">
                      <LayoutGrid size={14} />
                      Ver todos
                    </Link>
                  </Button>
                )}
              </div>
              {locationFavs.length === 0 ? (
                <EmptyState message="Nenhuma localização favoritada ainda" />
              ) : (
                <div className="flex overflow-x-auto gap-4 pb-2">
                  {displayedLocations.map((fav) => (
                    <div key={fav.id} className="flex-shrink-0 w-48">
                      <LocationCard location={toLocation(fav)} />
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
