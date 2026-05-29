import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CharactersPage from '@/app/characters/page'
import { getCharacter, getCharacters } from '@/lib/api/characters'
import { getLocation } from '@/lib/api/locations'
import type { ApiResponse, Character, LocationItem } from '@/lib/types'

// ─── Mocks de módulos externos ────────────────────────────────────────────────

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockPush = vi.fn()
const mockGet = vi.fn()

vi.mock('next/navigation', () => ({
  useSearchParams: () => ({ get: mockGet }),
  useRouter: () => ({ push: mockPush }),
}))

// Isola o layout: não é o objeto dos testes
vi.mock('@/components/layout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// FavoriteButton depende do zustand com persist — isolamos para evitar side-effects
vi.mock('@/components/ui/FavoriteButton', () => ({
  FavoriteButton: () => <button aria-label="Adicionar aos favoritos" />,
}))

vi.mock('@/lib/api/characters')
vi.mock('@/lib/api/locations')

// ─── Factories de dados ───────────────────────────────────────────────────────

function makeCharacter(id: number, overrides: Partial<Character> = {}): Character {
  return {
    id,
    name: `Personagem ${id}`,
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Terra C-137', url: 'https://rickandmortyapi.com/api/location/1' },
    location: { name: 'Terra Atual', url: 'https://rickandmortyapi.com/api/location/20' },
    image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
    episode: ['e1', 'e2'],
    url: `https://rickandmortyapi.com/api/character/${id}`,
    created: '2017-11-04T18:48:46.250Z',
    ...overrides,
  }
}

function makeLocation(id: number, name = `Localização ${id}`): LocationItem {
  return {
    id,
    name,
    type: 'Planet',
    dimension: 'Dimension C-137',
    residents: [],
    url: `https://rickandmortyapi.com/api/location/${id}`,
    created: '2017-11-10T12:42:04.162Z',
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
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <CharactersPage />
    </QueryClientProvider>
  )
}

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('CharactersPage', () => {
  beforeEach(() => {
    mockGet.mockReturnValue(null) // sem ?id na URL por padrão
    mockPush.mockReset()
    vi.mocked(getCharacters).mockResolvedValue(apiOf([]))
    vi.mocked(getLocation).mockResolvedValue(makeLocation(1))
    window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
    // jsdom não implementa scrollIntoView — necessário para o changePage
    Element.prototype.scrollIntoView = vi.fn()
  })

  describe('lista de personagens', () => {
    it('exibe 12 skeletons enquanto os personagens estão carregando', () => {
      // Simula requisição que nunca termina para prender o estado de loading
      vi.mocked(getCharacters).mockImplementation(() => new Promise(() => {}))
      renderPage()
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(12)
    })

    it('exibe o título "Personagens" após o carregamento', async () => {
      renderPage()
      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'Personagens' })).toBeInTheDocument()
      )
    })

    it('exibe todos os personagens retornados pela API', async () => {
      vi.mocked(getCharacters).mockResolvedValue(
        apiOf([makeCharacter(1), makeCharacter(2), makeCharacter(3)])
      )
      renderPage()
      await waitFor(() => expect(screen.getByText('Personagem 1')).toBeInTheDocument())
      expect(screen.getByText('Personagem 2')).toBeInTheDocument()
      expect(screen.getByText('Personagem 3')).toBeInTheDocument()
    })
  })

  describe('hero do personagem (painel de detalhes)', () => {
    it('não exibe o painel de detalhes quando nenhum ?id está na URL', async () => {
      renderPage()
      // Aguarda o carregamento da lista para garantir que o hero não apareceu depois
      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'Personagens' })).toBeInTheDocument()
      )
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    })

    it('exibe skeleton enquanto o personagem está sendo buscado via API', async () => {
      mockGet.mockReturnValue('1')
      // getCharacter nunca resolve — mantém estado de loading
      vi.mocked(getCharacter).mockImplementation(() => new Promise(() => {}))
      renderPage()

      // Aguarda a lista carregar para eliminar os pulsos dela
      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'Personagens' })).toBeInTheDocument()
      )

      // O nome do personagem (h1) ainda não deve aparecer
      expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
      // O HeroSkeleton usa animate-pulse
      expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('exibe o nome do personagem no título principal após o carregamento', async () => {
      mockGet.mockReturnValue('5')
      vi.mocked(getCharacter).mockResolvedValue(makeCharacter(5))
      renderPage()
      await waitFor(() =>
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Personagem 5')
      )
    })

    it('exibe "Vivo" para personagem com status Alive', async () => {
      mockGet.mockReturnValue('1')
      vi.mocked(getCharacter).mockResolvedValue(makeCharacter(1, { status: 'Alive' }))
      renderPage()
      await waitFor(() => screen.getByRole('heading', { level: 1 }))
      expect(screen.getByText('Vivo')).toBeInTheDocument()
    })

    it('exibe "Morto" para personagem com status Dead', async () => {
      mockGet.mockReturnValue('2')
      vi.mocked(getCharacter).mockResolvedValue(makeCharacter(2, { status: 'Dead' }))
      renderPage()
      await waitFor(() => screen.getByRole('heading', { level: 1 }))
      expect(screen.getByText('Morto')).toBeInTheDocument()
    })

    it('exibe a contagem de episódios do personagem', async () => {
      mockGet.mockReturnValue('3')
      vi.mocked(getCharacter).mockResolvedValue(
        makeCharacter(3, { episode: ['e1', 'e2', 'e3', 'e4', 'e5'] })
      )
      renderPage()
      await waitFor(() =>
        expect(screen.getByText('Participou de 5 episódios')).toBeInTheDocument()
      )
    })

    it('exibe os cards de localização quando origem e localização estão disponíveis', async () => {
      mockGet.mockReturnValue('1')
      vi.mocked(getCharacter).mockResolvedValue(makeCharacter(1))
      vi.mocked(getLocation)
        .mockResolvedValueOnce(makeLocation(1, 'Origem do Personagem'))
        .mockResolvedValueOnce(makeLocation(20, 'Local Atual'))
      renderPage()

      await waitFor(() => expect(screen.getByText('Origem do Personagem')).toBeInTheDocument())
      expect(screen.getByText('Local Atual')).toBeInTheDocument()
    })
  })

  describe('paginação', () => {
    it('botão "Página anterior" está desabilitado na primeira página', async () => {
      vi.mocked(getCharacters).mockResolvedValue(apiOf([], 5))
      renderPage()
      await waitFor(() => screen.getByRole('heading', { name: 'Personagens' }))
      const prevButtons = screen.getAllByRole('button', { name: 'Página anterior' })
      prevButtons.forEach((btn) => expect(btn).toBeDisabled())
    })

    it('botão "Próxima página" está desabilitado quando há apenas 1 página', async () => {
      vi.mocked(getCharacters).mockResolvedValue(apiOf([], 1))
      renderPage()
      await waitFor(() => screen.getByRole('heading', { name: 'Personagens' }))
      const nextButtons = screen.getAllByRole('button', { name: 'Próxima página' })
      nextButtons.forEach((btn) => expect(btn).toBeDisabled())
    })

    it('marca a página atual com aria-current="page"', async () => {
      vi.mocked(getCharacters).mockResolvedValue(apiOf([], 5))
      renderPage()
      await waitFor(() => screen.getByRole('heading', { name: 'Personagens' }))
      // Na página 1, os botões "Página 1" devem ter aria-current="page"
      const page1Buttons = screen.getAllByRole('button', { name: 'Página 1' })
      page1Buttons.forEach((btn) => expect(btn).toHaveAttribute('aria-current', 'page'))
    })

    it('avança para a página 2 ao clicar no botão correspondente', async () => {
      vi.mocked(getCharacters).mockResolvedValue(apiOf([], 5))
      renderPage()
      await waitFor(() => screen.getAllByRole('button', { name: 'Página 2' }))

      await userEvent.click(screen.getAllByRole('button', { name: 'Página 2' })[0])

      // Após o clique, página 2 deve ser a página ativa
      await waitFor(() =>
        expect(screen.getAllByRole('button', { name: 'Página 2' })[0]).toHaveAttribute(
          'aria-current',
          'page'
        )
      )
    })
  })

  describe('seleção de personagem', () => {
    it('chama router.push com o id correto ao clicar em "Saiba mais"', async () => {
      vi.mocked(getCharacters).mockResolvedValue(apiOf([makeCharacter(42)]))
      renderPage()
      await waitFor(() => screen.getByText('Personagem 42'))

      await userEvent.click(screen.getByRole('button', { name: /saiba mais/i }))

      expect(mockPush).toHaveBeenCalledWith('/characters?id=42', { scroll: false })
    })
  })
})
