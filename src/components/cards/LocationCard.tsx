'use client'

import Link from 'next/link'
import { Info } from 'lucide-react'
import { PlanetIcon } from '../icons'
import { Button } from '../ui/Button'
import { FavoriteButton } from '../ui/FavoriteButton'
import type { LocationItem } from '@/lib/types'

export function LocationCard({ location, onSelect }: { location: LocationItem; onSelect?: () => void }) {
  const favoriteItem = {
    id: location.id,
    type: 'location' as const,
    name: location.name,
  }

  return (
    <div className="relative pt-5 w-full">
      <PlanetIcon
        size={48}
        className="text-foreground-strong absolute top-[-8px] left-1/2 -translate-x-1/2 z-10"
      />
      <div className="bg-bg-secondary hover:bg-bg-surface rounded-2xl px-4 pt-8 pb-4 flex flex-col items-center gap-3 text-center transition-colors">
        <div className="w-full">
          <p className="text-h4 text-foreground-strong mb-1">{location.type || 'Planet'}</p>
          <h4 className="text-h4 text-cyan-primary truncate">{location.name}</h4>
        </div>
        {onSelect ? (
          <Button variant="surface" size="sm" onClick={onSelect}>
            <Info size={14} />
            Saiba mais
          </Button>
        ) : (
          <Button variant="surface" size="sm" asChild>
            <Link href={`/locations?id=${location.id}`}>
              <Info size={14} />
              Saiba mais
            </Link>
          </Button>
        )}
        <FavoriteButton item={favoriteItem} size='sm' />
      </div>
    </div>
  )
}
