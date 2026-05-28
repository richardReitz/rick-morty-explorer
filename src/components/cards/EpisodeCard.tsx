'use client'

import Link from 'next/link'
import { Tv, Calendar, Info } from 'lucide-react'
import { Button } from '../ui/Button'
import { FavoriteButton } from '../ui/FavoriteButton'
import type { Episode } from '@/lib/types'

export function EpisodeCard({ episode }: { episode: Episode }) {
  const favoriteItem = {
    id: episode.id,
    type: 'episode' as const,
    name: episode.name,
  }

  return (
    <div className="bg-bg-secondary rounded-xl p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center flex-shrink-0">
        <Tv size={18} className="text-cyan-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-body font-bold text-cyan-primary">{episode.episode}</p>
        <p className="text-h4 text-foreground truncate">{episode.name}</p>
        <p className="text-body text-muted flex items-center gap-1">
          <Calendar size={11} className="flex-shrink-0" />
          {episode.air_date}
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/episodes/${episode.id}`}>
            <Info size={14} />
            Saiba mais
          </Link>
        </Button>
        <FavoriteButton item={favoriteItem} />
      </div>
    </div>
  )
}
