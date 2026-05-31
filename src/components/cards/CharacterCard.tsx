'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Activity, Info } from 'lucide-react'
import { Button } from '../ui/Button'
import { FavoriteButton } from '../ui/FavoriteButton'
import { AlienIcon, PlanetIcon } from '../icons'
import type { Character } from '@/lib/types'

const statusLabel: Record<Character['status'], string> = {
  Alive: 'Vivo',
  Dead: 'Morto',
  unknown: 'Desconhecido',
}

export function CharacterCard({ character, onSelect }: { character: Character; onSelect?: () => void }) {
  const favoriteItem = {
    id: character.id,
    type: 'character' as const,
    name: character.name,
    image: character.image,
    status: character.status,
    species: character.species,
    origin: character.origin,
  }

  return (
    <div className="bg-bg-surface hover:bg-bg-secondary rounded-2xl overflow-hidden transition-colors p-4">
      <div className="p-3 dark:p-0">
        <div className="relative aspect-square overflow-hidden rounded-2xl ring-2 ring-inset ring-cyan-primary dark:ring-0">
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      </div>
      <div className="pt-4 flex flex-col gap-2">
        <div className="flex justify-between gap-3">
          <h4 className="text-h4 font-bold text-foreground-strong">{character.name}</h4>
          <FavoriteButton item={favoriteItem} size='lg'/>
        </div>
        <div className="flex items-center gap-1.5 text-body text-foreground-strong">
          <Activity size={16} className="flex-shrink-0 text-lime-brand" />
          <span>{statusLabel[character.status]}</span>
        </div>
        <div className="flex items-center gap-1.5 text-body text-foreground-strong">
          <AlienIcon size={16} className="flex-shrink-0" />
          <span>{character.species}</span>
        </div>
        <div className="flex items-center gap-1.5 text-body text-foreground-strong">
          <PlanetIcon size={16} className="flex-shrink-0" />
          <span className="truncate">{character.origin.name}</span>
        </div>
        <div className="flex justify-end mt-6">
          {onSelect ? (
            <Button variant="surface" size="sm" onClick={onSelect}>
              <Info size={20} />
              Saiba mais
            </Button>
          ) : (
            <Button variant="surface" size="sm" asChild>
              <Link href={`/characters?id=${character.id}`}>
                <Info size={20} />
                Saiba mais
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
