'use client'

import { Heart } from 'lucide-react'
import { useFavoritesStore } from '@/lib/store/favorites'
import type { FavoriteItem } from '@/lib/types'
import { cn } from '@/lib/utils'

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
    <button
      onClick={toggle}
      aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      style={{ width: iconSize, height: iconSize }}
      className={cn(
        'flex items-center justify-center transition-all duration-150 active:scale-90',
        favorited ? 'text-cyan-primary' : 'text-muted hover:text-cyan-primary'
      )}
    >
      <Heart
        size={iconSize}
        fill={favorited ? 'currentColor' : 'none'}
        className="transition-colors"
      />
    </button>
  )
}
