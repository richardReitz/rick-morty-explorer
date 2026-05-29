import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HomePageClient } from '@/components/layout/HomePageClient'
import { getCharacters } from '@/lib/api/characters'
import { getEpisodes } from '@/lib/api/episodes'
import { getLocations } from '@/lib/api/locations'
import type { ApiResponse, Character, Episode, LocationItem } from '@/lib/types'

// ─── Mocks de módulos externos ────────────────────────────────────────────────

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Isola o layout e o hero: não são o objeto dos testes
vi.mock('@/components/layout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/components/layout/Hero', () => ({
  Hero: () => <div data-testid="hero" />,
}))

// useDebounce retorna o valor imediatamente: não precisamos avançar timers
// para testar o comportamento de isSearching
vi.mock('@/lib/hooks/useDebounce', () => ({
  useDebounce: <T,>(value: T) => value,
}))

// Mocks das funções de API — serão configurados em cada teste
vi.mock('@/lib/api/characters')
vi.mock('@/lib/api/episodes')
vi.mock('@/lib/api/locations')

// ─── Factories de dados ───────────────────────────────────────────────────────

function makeCharacter(id: number): Character {
  return {
    id,
    name: `Personagem ${id}`,
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth (C-137)', url: '' },
    location: { name: 'Earth (C-137)', url: '' },
    image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
    episode: [],
    url: `https://rickandmortyapi.com/api/character/${id}`,
    created: '2017-11-04T18:48:46.250Z',
  }
}

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

function makeLocation(id: number): LocationItem {
  return {
    id,
    name: `Localização ${id}`,
    type: 'Planet',
    dimension: 'Dimension C-137',
    residents: [],
    url: `https://rickandmortyapi.com/api/location/${id}`,
    created: '2017-11-10T12:42:04.162Z',
  }
}

function apiOf<T>(results: T[]): ApiResponse<T> {
  return {
    info: { count: results.length, pages: 1, next: null, prev: null },
    results,
  }
}

// ─── Helper de render ─────────────────────────────────────────────────────────

function renderHome() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <HomePageClient />
    </QueryClientProvider>
  )
}

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('HomePageClient', () => {
  beforeEach(() => {
    // Estado padrão: todas as APIs retornam lista vazia
    vi.mocked(getCharacters).mockResolvedValue(apiOf([]))
    vi.mocked(getEpisodes).mockResolvedValue(apiOf([]))
    vi.mocked(getLocations).mockResolvedValue(apiOf([]))
  })

  describe('sem busca ativa', () => {
    it('exibe no máximo 8 personagens quando a API retorna mais de 8', async () => {
      const twentyChars = Array.from({ length: 20 }, (_, i) => makeCharacter(i + 1))
      vi.mocked(getCharacters).mockResolvedValue(apiOf(twentyChars))

      renderHome()

      // Aguarda o carregamento terminar (Personagem 1 aparece → query resolvida)
      await waitFor(() => expect(screen.getByText('Personagem 1')).toBeInTheDocument())

      expect(screen.getByText('Personagem 8')).toBeInTheDocument()
      expect(screen.queryByText('Personagem 9')).not.toBeInTheDocument()
    })

    it('exibe todos os personagens quando a API retorna menos que o limite de 8', async () => {
      const fiveChars = Array.from({ length: 5 }, (_, i) => makeCharacter(i + 1))
      vi.mocked(getCharacters).mockResolvedValue(apiOf(fiveChars))

      renderHome()

      await waitFor(() => expect(screen.getByText('Personagem 5')).toBeInTheDocument())

      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(`Personagem ${i}`)).toBeInTheDocument()
      }
    })
  })

  describe('com busca ativa', () => {
    it('remove o corte e exibe todos os resultados quando há texto na busca', async () => {
      const twelveChars = Array.from({ length: 12 }, (_, i) => makeCharacter(i + 1))
      vi.mocked(getCharacters).mockResolvedValue(apiOf(twelveChars))

      renderHome()

      const input = screen.getByPlaceholderText(/personagens, episódios/i)
      await userEvent.type(input, 'Rick')

      // Personagem 9 só aparece se o slice(.., 8) foi removido
      await waitFor(() => expect(screen.getByText('Personagem 9')).toBeInTheDocument())
      expect(screen.getByText('Personagem 12')).toBeInTheDocument()
    })
  })

  describe('FilterTabs — visibilidade das seções', () => {
    it('mostra todas as seções quando nenhuma aba está selecionada', () => {
      renderHome()

      expect(screen.getByRole('heading', { name: 'Personagens' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Episódios' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Localizações' })).toBeInTheDocument()
    })

    it('esconde episódios e localizações ao selecionar a aba Personagens', async () => {
      renderHome()

      const tab = screen.getByRole('button', { name: /personagens/i })
      await userEvent.click(tab)

      expect(screen.queryByRole('heading', { name: 'Episódios' })).not.toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'Localizações' })).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Personagens' })).toBeInTheDocument()
    })

    it('restaura todas as seções ao clicar na aba ativa novamente (toggle)', async () => {
      renderHome()

      const tab = screen.getByRole('button', { name: /personagens/i })
      await userEvent.click(tab) // ativa
      await userEvent.click(tab) // desativa

      expect(screen.getByRole('heading', { name: 'Episódios' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Localizações' })).toBeInTheDocument()
    })
  })
})
