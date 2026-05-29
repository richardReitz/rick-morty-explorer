import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSearchParams, useRouter } from 'next/navigation'
import LocationsPage from '@/app/locations/page'
import { LocationCard } from '@/components/cards/LocationCard'
import { getLocations, getLocation } from '@/lib/api/locations'
import type { ApiResponse, LocationItem } from '@/lib/types'

// ─── Mocks de módulos externos ────────────────────────────────────────────────

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Isola o layout: não é o objeto dos testes
vi.mock('@/components/layout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mocks das funções de API — configurados por teste
vi.mock('@/lib/api/locations')

// ─── Stubs de navegação reutilizados em todos os testes de página ─────────────

const mockSearchParams = { get: vi.fn() }
const mockRouter = { push: vi.fn() }

// ─── Factories de dados ───────────────────────────────────────────────────────

function makeLocation(id: number, overrides: Partial<LocationItem> = {}): LocationItem {
  return {
    id,
    name: `Localização ${id}`,
    type: 'Planet',
    dimension: 'Dimension C-137',
    residents: [],
    url: `https://rickandmortyapi.com/api/location/${id}`,
    created: '2017-11-10T12:42:04.162Z',
    ...overrides,
  }
}

function apiOf<T>(results: T[], pages = 1): ApiResponse<T> {
  return {
    info: { count: results.length, pages, next: null, prev: null },
    results,
  }
}

// ─── Helper de render ─────────────────────────────────────────────────────────

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <LocationsPage />
    </QueryClientProvider>
  )
}

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('LocationCard', () => {
  it('exibe o nome e o tipo da localização', () => {
    render(<LocationCard location={makeLocation(1)} />)

    expect(screen.getByText('Localização 1')).toBeInTheDocument()
    expect(screen.getByText('Planet')).toBeInTheDocument()
  })

  it('usa "Planet" como fallback quando o campo type está vazio', () => {
    render(<LocationCard location={makeLocation(1, { type: '' })} />)

    expect(screen.getByText('Planet')).toBeInTheDocument()
  })

  it('chama onSelect ao clicar em "Saiba mais" quando a prop é fornecida', async () => {
    const onSelect = vi.fn()
    render(<LocationCard location={makeLocation(1)} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button', { name: /saiba mais/i }))

    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('renderiza um link para /locations?id={id} quando onSelect não é fornecido', () => {
    render(<LocationCard location={makeLocation(7)} />)

    const link = screen.getByRole('link', { name: /saiba mais/i })
    expect(link).toHaveAttribute('href', '/locations?id=7')
  })
})

describe('LocationsPage', () => {
  beforeEach(() => {
    // Por padrão: sem ?id= na URL, sem dados nas APIs
    mockSearchParams.get.mockReturnValue(null)
    mockRouter.push.mockReset()
    vi.mocked(useSearchParams).mockReturnValue(mockSearchParams as ReturnType<typeof useSearchParams>)
    vi.mocked(useRouter).mockReturnValue(mockRouter as ReturnType<typeof useRouter>)
    vi.mocked(getLocations).mockResolvedValue(apiOf([]))
    vi.mocked(getLocation).mockResolvedValue(makeLocation(1))
    // jsdom não implementa scroll nativo; evita erros ao clicar em cards/paginação
    window.scrollTo = vi.fn()
    Element.prototype.scrollIntoView = vi.fn()
  })

  describe('lista de localizações', () => {
    it('não exibe cards enquanto a lista está carregando', () => {
      vi.mocked(getLocations).mockReturnValue(new Promise(() => {}))

      renderPage()

      expect(screen.queryByText('Localização 1')).not.toBeInTheDocument()
    })

    it('exibe todos os cards após o carregamento', async () => {
      const locations = Array.from({ length: 3 }, (_, i) => makeLocation(i + 1))
      vi.mocked(getLocations).mockResolvedValue(apiOf(locations))

      renderPage()

      await waitFor(() => expect(screen.getByText('Localização 1')).toBeInTheDocument())
      expect(screen.getByText('Localização 2')).toBeInTheDocument()
      expect(screen.getByText('Localização 3')).toBeInTheDocument()
    })

    it('chama router.push com ?id= correto ao clicar em "Saiba mais" de um card', async () => {
      vi.mocked(getLocations).mockResolvedValue(apiOf([makeLocation(42)]))

      renderPage()

      await waitFor(() => screen.getByText('Localização 42'))
      await userEvent.click(screen.getByRole('button', { name: /saiba mais/i }))

      expect(mockRouter.push).toHaveBeenCalledWith('/locations?id=42', { scroll: false })
    })
  })

  describe('hero da localização selecionada', () => {
    it('não exibe o hero quando não há ?id= na URL', async () => {
      vi.mocked(getLocations).mockResolvedValue(apiOf([makeLocation(1)]))

      renderPage()

      await waitFor(() => screen.getByText('Localização 1'))
      expect(screen.queryByText(/Personagens localizados aqui/i)).not.toBeInTheDocument()
    })

    it('exibe nome, tipo, dimensão e contagem de residentes quando há ?id= na URL', async () => {
      const loc = makeLocation(3, {
        name: 'Citadel of Ricks',
        type: 'Space station',
        dimension: 'unknown',
        residents: ['url1', 'url2', 'url3'],
      })
      mockSearchParams.get.mockImplementation((key: string) => (key === 'id' ? '3' : null))
      vi.mocked(getLocation).mockResolvedValue(loc)

      renderPage()

      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'Citadel of Ricks' })).toBeInTheDocument()
      )
      expect(screen.getByText('Space station')).toBeInTheDocument()
      expect(screen.getByText('unknown')).toBeInTheDocument()
      expect(screen.getByText(/3 Personagens localizados aqui/i)).toBeInTheDocument()
    })

    it('não exibe o título do hero enquanto os detalhes da localização carregam', () => {
      mockSearchParams.get.mockImplementation((key: string) => (key === 'id' ? '1' : null))
      vi.mocked(getLocation).mockReturnValue(new Promise(() => {}))

      renderPage()

      // O skeleton anima sem texto; nenhum h1 deve aparecer antes do dado chegar
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
      expect(screen.queryByText(/Personagens localizados aqui/i)).not.toBeInTheDocument()
    })
  })

  describe('paginação', () => {
    it('avança para a página 2 ao clicar em "Próxima página"', async () => {
      vi.mocked(getLocations).mockResolvedValue({
        info: { count: 60, pages: 7, next: null, prev: null },
        results: [makeLocation(1)],
      })

      renderPage()

      await waitFor(() => screen.getByText('Localização 1'))

      // A paginação é renderizada duas vezes (topo e rodapé); clica na primeira
      const nextBtns = screen.getAllByRole('button', { name: /próxima página/i })
      await userEvent.click(nextBtns[0])

      await waitFor(() => {
        // O botão "2" deve estar marcado como página atual
        const page2Btn = screen.getAllByRole('button', { name: 'Página 2' })[0]
        expect(page2Btn).toHaveAttribute('aria-current', 'page')
      })
    })

    it('desabilita o botão "Anterior" quando está na primeira página', async () => {
      vi.mocked(getLocations).mockResolvedValue({
        info: { count: 60, pages: 7, next: null, prev: null },
        results: [makeLocation(1)],
      })

      renderPage()

      await waitFor(() => screen.getByText('Localização 1'))

      const prevBtns = screen.getAllByRole('button', { name: /página anterior/i })
      prevBtns.forEach((btn) => expect(btn).toBeDisabled())
    })
  })
})
