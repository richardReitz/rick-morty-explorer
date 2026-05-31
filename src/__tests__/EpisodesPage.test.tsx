import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import EpisodesPage from '@/app/episodes/page'
import { getEpisode, getEpisodes } from '@/lib/api/episodes'
import type { ApiResponse, Episode } from '@/lib/types'

// ─── Mocks ───────────────────────────────────────────────────────────────────

// vi.fn() no nível do módulo garante que o mock factory os capture corretamente
const mockSearchParamsGet = vi.fn().mockReturnValue(null)
const mockRouterPush = vi.fn()

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: mockSearchParamsGet }),
  useRouter: () => ({ push: mockRouterPush }),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Isola o layout: apenas renderiza os filhos para simplificar as queries
vi.mock('@/components/layout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DetailHeroSection: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Isola o estado de favoritos do Zustand
vi.mock('@/lib/store/favorites', () => ({
  useFavoritesStore: () => ({
    isFavorite: () => false,
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
  }),
}))

vi.mock('@/lib/api/episodes')

// ─── Factories ────────────────────────────────────────────────────────────────

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

function apiOf<T>(results: T[], pages = 1): ApiResponse<T> {
  return {
    info: { count: results.length, pages, next: pages > 1 ? 'url' : null, prev: null },
    results,
  }
}

// ─── Helper de render ─────────────────────────────────────────────────────────

function renderPage() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <EpisodesPage />
    </QueryClientProvider>
  )
}

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('EpisodesPage', () => {
  beforeEach(() => {
    mockSearchParamsGet.mockReturnValue(null)
    mockRouterPush.mockReset()
    window.scrollTo = vi.fn()
    Element.prototype.scrollIntoView = vi.fn()
    vi.mocked(getEpisodes).mockResolvedValue(apiOf([]))
    vi.mocked(getEpisode).mockResolvedValue(makeEpisode())
  })

  describe('lista de episódios', () => {
    it('exibe os episódios após o carregamento', async () => {
      vi.mocked(getEpisodes).mockResolvedValue(
        apiOf([
          makeEpisode({ id: 1, name: 'Pilot', episode: 'S01E01' }),
          makeEpisode({ id: 2, name: 'Lawnmower Dog', episode: 'S01E02' }),
        ])
      )

      renderPage()

      await waitFor(() => expect(screen.getByText('Pilot | S01E01')).toBeInTheDocument())
      expect(screen.getByText('Lawnmower Dog | S01E02')).toBeInTheDocument()
    })

    it('não exibe cards de episódio enquanto a lista está carregando', async () => {
      // Promessa nunca resolve durante o trecho síncrono da assertion
      let resolveEpisodes!: (v: ApiResponse<Episode>) => void
      vi.mocked(getEpisodes).mockReturnValue(
        new Promise((res) => { resolveEpisodes = res })
      )

      renderPage()

      // Durante o loading, nenhum dado real deve aparecer
      expect(screen.queryByText(/S01E/)).not.toBeInTheDocument()

      // Após resolver, o episódio aparece
      resolveEpisodes(apiOf([makeEpisode({ name: 'Pilot', episode: 'S01E01' })]))
      await waitFor(() => expect(screen.getByText('Pilot | S01E01')).toBeInTheDocument())
    })
  })

  describe('hero (episódio selecionado)', () => {
    it('não exibe a seção hero quando não há ?id na URL', () => {
      // Verificação síncrona: a seção hero depende de selectedId, não de dados da query
      renderPage()

      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    })

    it('exibe nome, data de exibição e código do episódio selecionado', async () => {
      mockSearchParamsGet.mockImplementation((key: string) =>
        key === 'id' ? '1' : null
      )
      vi.mocked(getEpisode).mockResolvedValue(
        makeEpisode({ name: 'Pilot', air_date: 'December 2, 2013', episode: 'S01E01' })
      )

      renderPage()

      await waitFor(() =>
        expect(screen.getByRole('heading', { level: 1, name: 'Pilot' })).toBeInTheDocument()
      )
      expect(screen.getByText('2 de dezembro de 2013')).toBeInTheDocument()
      expect(screen.getByText('S01E01')).toBeInTheDocument()
    })

    it('exibe a contagem de personagens que participaram do episódio', async () => {
      mockSearchParamsGet.mockImplementation((key: string) =>
        key === 'id' ? '3' : null
      )
      vi.mocked(getEpisode).mockResolvedValue(
        makeEpisode({ id: 3, characters: Array(7).fill('https://url') })
      )

      renderPage()

      await waitFor(() =>
        expect(
          screen.getByText('7 Personagens participaram deste episódio')
        ).toBeInTheDocument()
      )
    })
  })

  describe('paginação', () => {
    it('o botão de página anterior está desabilitado quando está na primeira página', async () => {
      vi.mocked(getEpisodes).mockResolvedValue(
        apiOf([makeEpisode()], 3)
      )

      renderPage()

      // Aguarda a renderização dos botões de paginação
      await waitFor(() =>
        expect(screen.getAllByRole('button', { name: 'Página anterior' })[0]).toBeDisabled()
      )
    })

    it('clicar em "Próxima página" busca os episódios da página seguinte', async () => {
      vi.mocked(getEpisodes).mockResolvedValue(
        apiOf([makeEpisode({ id: 1, name: 'Pilot', episode: 'S01E01' })], 3)
      )

      renderPage()

      await waitFor(() => expect(screen.getByText('Pilot | S01E01')).toBeInTheDocument())

      // Há dois componentes Pagination na página (acima e abaixo da lista)
      await userEvent.click(screen.getAllByRole('button', { name: 'Próxima página' })[0])

      await waitFor(() =>
        expect(vi.mocked(getEpisodes)).toHaveBeenCalledWith(2)
      )
    })
  })
})
