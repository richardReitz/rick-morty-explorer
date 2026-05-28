'use client'

import { Heart } from 'lucide-react'
import { useFavoritesStore } from '@/lib/store/favorites'
import type { FavoriteItem } from '@/lib/types'
import { cn } from '@/lib/utils'

export function FavoriteButton({ item }: { item: FavoriteItem }) {
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

  return (
    <button
      onClick={toggle}
      aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={cn(
        'flex items-center justify-center w-9 h-9 rounded-full bg-bg-surface transition-all duration-150 active:scale-90',
        favorited ? 'text-cyan-primary' : 'text-muted hover:text-cyan-primary'
      )}
    >
      <Heart
        size={16}
        fill={favorited ? 'currentColor' : 'none'}
        className="transition-colors"
      />
    </button>
  )
}
