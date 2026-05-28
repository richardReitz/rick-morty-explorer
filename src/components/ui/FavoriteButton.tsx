'use client'

import { Heart } from 'lucide-react'
import { useFavoritesStore } from '@/lib/store/favorites'
import type { FavoriteItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from './Button'

type FavoriteButtonProps = {
  item: FavoriteItem
  size?: 'sm' | 'lg'
}

export function FavoriteButton({ item, size = 'sm' }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()
  const favorited = isFavorite(item.id, item.type)

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (favorited) {
      removeFavorite(item.id, item.type)
    } else {
      addFavorite(item)
    }
  }

  const iconSize = size === 'lg' ? 48 : 32

  return (
    <Button
      onClick={toggle}
      variant="ghost"
      size="sm"
      aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={cn(
        'p-0 active:scale-90 hover:bg-transparent',
        size === 'lg' ? 'size-12' : 'size-8',
        favorited ? 'text-cyan-primary' : 'text-muted hover:text-cyan-primary'
      )}
    >
      <Heart
        style={{ width: iconSize, height: iconSize }}
        fill={favorited ? 'currentColor' : 'none'}
        className="transition-colors"
      />
    </Button>
  )
}
