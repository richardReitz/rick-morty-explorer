import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FavoritesPageClient } from '@/components/layout/FavoritesPageClient'
import { useFavoritesStore } from '@/lib/store/favorites'
import type { FavoriteItem } from '@/lib/types'

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

// Isola o layout: não é o objeto dos testes
vi.mock('@/components/layout/MainLayout', () => ({
  MainLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Controla o estado de favoritos em cada teste
vi.mock('@/lib/store/favorites', () => ({
  useFavoritesStore: vi.fn(),
}))

// ─── Factories de dados ───────────────────────────────────────────────────────

function makeFavChar(id: number): FavoriteItem {
  return {
    id,
    type: 'character',
    name: `Personagem ${id}`,
    image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
    status: 'Alive',
    species: 'Human',
    origin: { name: 'Earth (C-137)', url: '' },
  }
}

function makeFavEpisode(id: number): FavoriteItem {
  return {
    id,
    type: 'episode',
    name: `Episódio ${id}`,
  }
}

function makeFavLocation(id: number): FavoriteItem {
  return {
    id,
    type: 'location',
    name: `Localização ${id}`,
  }
}

// ─── Helper: configura o store com a lista de favoritos desejada ──────────────

function mockStore(favorites: FavoriteItem[]) {
  vi.mocked(useFavoritesStore).mockReturnValue({
    favorites,
    addFavorite: vi.fn(),
    removeFavorite: vi.fn(),
    isFavorite: vi.fn().mockReturnValue(false),
    clearFavorites: vi.fn(),
  })
}

function renderFavorites() {
  return render(<FavoritesPageClient />)
}

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('FavoritesPageClient', () => {
  beforeEach(() => {
    // Estado padrão: sem nenhum favorito
    mockStore([])
  })

  // ── 1. Estado vazio ──────────────────────────────────────────────────────────

  describe('estado vazio', () => {
    it('exibe mensagem de vazio para personagens quando não há favoritos', () => {
      renderFavorites()

      expect(
        screen.getByText('Nenhum personagem favoritado ainda')
      ).toBeInTheDocument()
    })

    it('exibe mensagem de vazio para episódios quando não há favoritos', () => {
      renderFavorites()

      expect(
        screen.getByText('Nenhum episódio favoritado ainda')
      ).toBeInTheDocument()
    })

    it('exibe mensagem de vazio para localizações quando não há favoritos', () => {
      renderFavorites()

      expect(
        screen.getByText('Nenhuma localização favoritada ainda')
      ).toBeInTheDocument()
    })

    it('exibe EmptyState apenas nas seções sem favoritos quando as outras têm', () => {
      // Só personagens favoritados — episódios e localizações ficam vazios
      mockStore([makeFavChar(1)])

      renderFavorites()

      expect(screen.queryByText('Nenhum personagem favoritado ainda')).not.toBeInTheDocument()
      expect(screen.getByText('Nenhum episódio favoritado ainda')).toBeInTheDocument()
      expect(screen.getByText('Nenhuma localização favoritada ainda')).toBeInTheDocument()
    })
  })

  // ── 2. Renderização dos itens favoritados ────────────────────────────────────

  describe('renderização dos favoritos', () => {
    it('exibe o nome dos personagens favoritados', () => {
      mockStore([makeFavChar(1), makeFavChar(2)])

      renderFavorites()

      expect(screen.getByText('Personagem 1')).toBeInTheDocument()
      expect(screen.getByText('Personagem 2')).toBeInTheDocument()
    })

    it('exibe o nome dos episódios favoritados', () => {
      mockStore([makeFavEpisode(3)])

      renderFavorites()

      // EpisodeCard renderiza "{name} | {code}" num único span — regex capta o nome
      expect(screen.getByText(/Episódio 3/)).toBeInTheDocument()
    })

    it('exibe o nome das localizações favoritadas', () => {
      mockStore([makeFavLocation(5)])

      renderFavorites()

      expect(screen.getByText('Localização 5')).toBeInTheDocument()
    })

    it('renderiza itens de tipos diferentes separados nas suas seções', () => {
      mockStore([makeFavChar(1), makeFavEpisode(2), makeFavLocation(3)])

      renderFavorites()

      // Todos aparecem sem interferência entre si
      expect(screen.getByText('Personagem 1')).toBeInTheDocument()
      expect(screen.getByText(/Episódio 2/)).toBeInTheDocument()
      expect(screen.getByText('Localização 3')).toBeInTheDocument()
    })
  })

  // ── 3. Limite de exibição sem aba ativa ──────────────────────────────────────

  describe('limite de exibição (sem aba ativa)', () => {
    it('exibe no máximo 8 personagens quando há mais de 8', () => {
      const chars = Array.from({ length: 10 }, (_, i) => makeFavChar(i + 1))
      mockStore(chars)

      renderFavorites()

      expect(screen.getByText('Personagem 8')).toBeInTheDocument()
      expect(screen.queryByText('Personagem 9')).not.toBeInTheDocument()
      expect(screen.queryByText('Personagem 10')).not.toBeInTheDocument()
    })

    it('exibe no máximo 5 episódios quando há mais de 5', () => {
      const eps = Array.from({ length: 7 }, (_, i) => makeFavEpisode(i + 1))
      mockStore(eps)

      renderFavorites()

      expect(screen.getByText(/Episódio 5/)).toBeInTheDocument()
      expect(screen.queryByText(/Episódio 6/)).not.toBeInTheDocument()
      expect(screen.queryByText(/Episódio 7/)).not.toBeInTheDocument()
    })

    it('exibe no máximo 7 localizações quando há mais de 7', () => {
      const locs = Array.from({ length: 9 }, (_, i) => makeFavLocation(i + 1))
      mockStore(locs)

      renderFavorites()

      expect(screen.getByText('Localização 7')).toBeInTheDocument()
      expect(screen.queryByText('Localização 8')).not.toBeInTheDocument()
      expect(screen.queryByText('Localização 9')).not.toBeInTheDocument()
    })
  })

  // ── 4. Aba ativa remove o limite ─────────────────────────────────────────────

  describe('aba ativa remove o limite de exibição', () => {
    it('exibe todos os personagens ao selecionar a aba Personagens', async () => {
      const chars = Array.from({ length: 12 }, (_, i) => makeFavChar(i + 1))
      mockStore(chars)

      renderFavorites()

      await userEvent.click(screen.getByRole('button', { name: /personagens/i }))

      expect(screen.getByText('Personagem 12')).toBeInTheDocument()
    })

    it('exibe todos os episódios ao selecionar a aba Episódios', async () => {
      const eps = Array.from({ length: 8 }, (_, i) => makeFavEpisode(i + 1))
      mockStore(eps)

      renderFavorites()

      await userEvent.click(screen.getByRole('button', { name: /episódios/i }))

      expect(screen.getByText(/Episódio 8/)).toBeInTheDocument()
    })

    it('exibe todas as localizações ao selecionar a aba Localizações', async () => {
      const locs = Array.from({ length: 10 }, (_, i) => makeFavLocation(i + 1))
      mockStore(locs)

      renderFavorites()

      await userEvent.click(screen.getByRole('button', { name: /localizações/i }))

      expect(screen.getByText('Localização 10')).toBeInTheDocument()
    })
  })

  // ── 5. FilterTabs — visibilidade das seções ───────────────────────────────────

  describe('FilterTabs — visibilidade das seções', () => {
    it('exibe as três seções quando nenhuma aba está selecionada', () => {
      renderFavorites()

      expect(screen.getByRole('heading', { name: 'Personagens' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Episódios' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Localizações' })).toBeInTheDocument()
    })

    it('oculta episódios e localizações ao selecionar a aba Personagens', async () => {
      renderFavorites()

      await userEvent.click(screen.getByRole('button', { name: /personagens/i }))

      expect(screen.getByRole('heading', { name: 'Personagens' })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'Episódios' })).not.toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'Localizações' })).not.toBeInTheDocument()
    })

    it('oculta personagens e localizações ao selecionar a aba Episódios', async () => {
      renderFavorites()

      await userEvent.click(screen.getByRole('button', { name: /episódios/i }))

      expect(screen.queryByRole('heading', { name: 'Personagens' })).not.toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Episódios' })).toBeInTheDocument()
      expect(screen.queryByRole('heading', { name: 'Localizações' })).not.toBeInTheDocument()
    })

    it('restaura todas as seções ao clicar na aba ativa novamente (toggle)', async () => {
      renderFavorites()

      const tab = screen.getByRole('button', { name: /personagens/i })
      await userEvent.click(tab) // ativa
      await userEvent.click(tab) // desativa

      expect(screen.getByRole('heading', { name: 'Episódios' })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: 'Localizações' })).toBeInTheDocument()
    })
  })

  // ── 6. Botão "Ver todos" ─────────────────────────────────────────────────────

  describe('botão "Ver todos"', () => {
    it('exibe link "Ver todos" apontando para /characters na seção de personagens', () => {
      renderFavorites()

      const links = screen.getAllByRole('link', { name: /ver todos/i })
      const charLink = links.find((l) => l.getAttribute('href') === '/characters')
      expect(charLink).toBeInTheDocument()
    })

    it('remove o link "Ver todos" de personagens ao ativar a aba Personagens', async () => {
      renderFavorites()

      await userEvent.click(screen.getByRole('button', { name: /personagens/i }))

      // Com a aba ativa, episódios e localizações são ocultos também,
      // então nenhum "Ver todos" deve existir na página
      const verTodosLinks = screen.queryAllByRole('link', { name: /ver todos/i })
      expect(verTodosLinks.some((l) => l.getAttribute('href') === '/characters')).toBe(false)
    })

    it('exibe links "Ver todos" para episódios (/episodes) e localizações (/locations)', () => {
      renderFavorites()

      const links = screen.getAllByRole('link', { name: /ver todos/i })
      const hrefs = links.map((l) => l.getAttribute('href'))

      expect(hrefs).toContain('/episodes')
      expect(hrefs).toContain('/locations')
    })
  })
})
