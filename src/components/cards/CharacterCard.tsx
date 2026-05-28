'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Activity, Globe, User } from 'lucide-react'
import { Badge } from '../ui/Badge'
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
    <div className="bg-bg-secondary rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute top-2 left-2">
          <Badge status={character.status} />
        </div>
        <div className="absolute top-2 right-2">
          <FavoriteButton item={favoriteItem} />
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2">
        <h4 className="text-h4 font-bold text-foreground truncate">{character.name}</h4>
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
        <Button variant="secondary" size="sm" asChild className="mt-1 w-full">
          <Link href={`/characters/${character.id}`}>Saiba mais</Link>
        </Button>
      </div>
    </div>
  )
}
