'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Activity, Globe, Info, User } from 'lucide-react'
import { Button } from '../ui/Button'
import { FavoriteButton } from '../ui/FavoriteButton'
import type { Character } from '@/lib/types'

const statusLabel: Record<Character['status'], string> = {
  Alive: 'Vivo',
  Dead: 'Morto',
  unknown: 'Desconhecido',
}

export function CharacterCard({ character }: { character: Character }) {
  const favoriteItem = {
    id: character.id,
    type: 'character' as const,
    name: character.name,
    image: character.image,
  }

  return (
    <div className="bg-bg-secondary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4">
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
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-h4 font-bold text-foreground truncate">{character.name}</h4>
          <FavoriteButton item={favoriteItem} />
        </div>
        <div className="flex items-center gap-1.5 text-body text-muted">
          <Activity size={12} className="flex-shrink-0" />
          <span>{statusLabel[character.status]}</span>
        </div>
        <div className="flex items-center gap-1.5 text-body text-muted">
          <User size={12} className="flex-shrink-0" />
          <span>{character.species}</span>
        </div>
        <div className="flex items-center gap-1.5 text-body text-muted">
          <Globe size={12} className="flex-shrink-0" />
          <span className="truncate">{character.origin.name}</span>
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="primary" size="sm" asChild>
            <Link href={`/characters/${character.id}`}>
              <Info size={20} />
              Saiba mais
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
