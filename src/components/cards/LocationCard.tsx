'use client'

import Link from 'next/link'
import { Globe, Info } from 'lucide-react'
import { Button } from '../ui/Button'
import { FavoriteButton } from '../ui/FavoriteButton'
import type { LocationItem } from '@/lib/types'

export function LocationCard({ location }: { location: LocationItem }) {
  const favoriteItem = {
    id: location.id,
    type: 'location' as const,
    name: location.name,
  }

  return (
    <div className="bg-bg-secondary rounded-xl p-4 flex flex-col items-center gap-3 text-center">
      <Globe size={32} className="text-cyan-primary" />
      <div className="w-full">
        <p className="text-body text-muted">{location.type || 'Planet'}</p>
        <h4 className="text-h4 font-bold text-cyan-primary truncate">{location.name}</h4>
        {location.dimension && location.dimension !== 'unknown' && (
          <p className="text-body text-muted truncate">{location.dimension}</p>
        )}
      </div>
      <Button variant="secondary" size="sm" asChild className="w-full">
        <Link href={`/locations/${location.id}`}>
          <Info size={14} />
          Saiba mais
        </Link>
      </Button>
      <FavoriteButton item={favoriteItem} />
    </div>
  )
}
