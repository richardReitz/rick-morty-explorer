import type { Metadata } from 'next'
import { FavoritesPageClient } from '@/components/layout/FavoritesPageClient'

export const metadata: Metadata = {
  title: 'Favoritos | Rick & Morty App',
  description: 'Todos os seus personagens, episódios e localizações favoritos',
}

export default function FavoritesPage() {
  return <FavoritesPageClient />
}
