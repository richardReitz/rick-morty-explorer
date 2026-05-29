'use client'

import Link from 'next/link'
import { TvMinimalPlay, Info } from 'lucide-react'
import { Button } from '../ui/Button'
import { FavoriteButton } from '../ui/FavoriteButton'
import type { Episode } from '@/lib/types'

export function EpisodeCard({ episode, onSelect }: { episode: Episode; onSelect?: () => void }) {
  const favoriteItem = {
    id: episode.id,
    type: 'episode' as const,
    name: episode.name,
  }

  return (
    <div className="bg-bg-secondary hover:bg-bg-surface rounded-2xl p-4 flex flex-col gap-3 transition-colors">
      <div className="flex items-center gap-2">
        <TvMinimalPlay size={20} className="text-foreground-strong flex-shrink-0" />
        <span className="font-normal text-foreground-strong text-h4 line-clamp-1">
          {episode.name} | {episode.episode}
        </span>
      </div>
      <div className="flex items-center justify-between">
        {onSelect ? (
          <Button variant="surface" size="sm" onClick={onSelect}>
            <Info size={15} />
            Saiba mais
          </Button>
        ) : (
          <Button variant="surface" size="sm" asChild>
            <Link href={`/episodes?id=${episode.id}`}>
              <Info size={15} />
              Saiba mais
            </Link>
          </Button>
        )}
        <FavoriteButton item={favoriteItem} />
      </div>
    </div>
  )
}
