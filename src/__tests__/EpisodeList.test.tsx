import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { EpisodeList } from '@/components/lists/EpisodeList'
import type { Episode } from '@/lib/types'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('@/lib/store/favorites', () => ({
  useFavoritesStore: () => ({
    isFavorite: () => false,
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  }),
}))

function makeEpisode(id: number): Episode {
  return {
    id,
    name: `Episódio ${id}`,
    air_date: 'December 2, 2013',
    episode: `S01E0${id}`,
    characters: [],
    url: `https://rickandmortyapi.com/api/episode/${id}`,
    created: '2017-11-10T12:56:33.798Z',
  }
}

describe('EpisodeList', () => {
  it('exibe 5 skeletons enquanto isLoading é verdadeiro', () => {
    render(<EpisodeList items={[]} isLoading={true} />)

    // Cada SkeletonCard de tipo "episode" renderiza um div com animate-pulse
    expect(document.querySelectorAll('.animate-pulse')).toHaveLength(5)
  })

  it('exibe estado vazio quando a lista não tem episódios', () => {
    render(<EpisodeList items={[]} isLoading={false} />)

    expect(screen.getByText(/nenhum resultado/i)).toBeInTheDocument()
  })

  it('renderiza um card para cada episódio fornecido', () => {
    const episodes = [makeEpisode(1), makeEpisode(2), makeEpisode(3)]
    render(<EpisodeList items={episodes} isLoading={false} />)

    expect(screen.getByText('Episódio 1 | S01E01')).toBeInTheDocument()
    expect(screen.getByText('Episódio 2 | S01E02')).toBeInTheDocument()
    expect(screen.getByText('Episódio 3 | S01E03')).toBeInTheDocument()
  })
})
