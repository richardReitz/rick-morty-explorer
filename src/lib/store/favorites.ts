import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FavoriteItem } from '../types'

interface FavoritesState {
  favorites: FavoriteItem[]
  addFavorite: (item: FavoriteItem) => void
  removeFavorite: (id: number, type: FavoriteItem['type']) => void
  isFavorite: (id: number, type: FavoriteItem['type']) => boolean
  clearFavorites: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (item) =>
        set((state) =>
          state.favorites.some((f) => f.id === item.id && f.type === item.type)
            ? state
            : { favorites: [...state.favorites, item] }
        ),
      removeFavorite: (id, type) =>
        set((state) => ({
          favorites: state.favorites.filter(
            (f) => !(f.id === id && f.type === type)
          ),
        })),
      isFavorite: (id, type) =>
        get().favorites.some((f) => f.id === id && f.type === type),
      clearFavorites: () => set({ favorites: [] }),
    }),
    { name: 'rm-favorites' }
  )
)
