import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { EpisodeCard } from '@/components/cards/EpisodeCard'
import type { Episode } from '@/lib/types'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Isola o estado de favoritos: não é o foco dos testes do card
vi.mock('@/lib/store/favorites', () => ({
  useFavoritesStore: () => ({
    isFavorite: () => false,
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  }),
}))

function makeEpisode(overrides: Partial<Episode> = {}): Episode {
  return {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
    episode: 'S01E01',
    characters: [],
    url: 'https://rickandmortyapi.com/api/episode/1',
    created: '2017-11-10T12:56:33.798Z',
    ...overrides,
  }
}

describe('EpisodeCard', () => {
  it('exibe o nome e o código do episódio no formato "Nome | S01E01"', () => {
    render(<EpisodeCard episode={makeEpisode({ name: 'Pilot', episode: 'S01E01' })} />)

    expect(screen.getByText('Pilot | S01E01')).toBeInTheDocument()
  })

  it('chama onSelect ao clicar em "Saiba mais" quando callback é fornecido', async () => {
    const onSelect = vi.fn()
    render(<EpisodeCard episode={makeEpisode()} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button', { name: /saiba mais/i }))

    expect(onSelect).toHaveBeenCalledOnce()
  })

  it('renderiza link para /episodes?id=X quando onSelect não é fornecido', () => {
    render(<EpisodeCard episode={makeEpisode({ id: 7 })} />)

    const link = screen.getByRole('link', { name: /saiba mais/i })
    expect(link).toHaveAttribute('href', '/episodes?id=7')
  })

  it('exibe botão de favorito para o episódio', () => {
    render(<EpisodeCard episode={makeEpisode()} />)

    expect(screen.getByRole('button', { name: /favoritos/i })).toBeInTheDocument()
  })
})
