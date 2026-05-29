import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { CharacterList } from '@/components/lists/CharacterList'
import type { Character } from '@/lib/types'

// ─── Mocks de módulos externos ────────────────────────────────────────────────

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('@/components/ui/FavoriteButton', () => ({
  FavoriteButton: () => <button aria-label="Adicionar aos favoritos" />,
}))

// ─── Factory de dados ─────────────────────────────────────────────────────────

function makeCharacter(id: number): Character {
  return {
    id,
    name: `Personagem ${id}`,
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Terra C-137', url: '' },
    location: { name: 'Terra C-137', url: '' },
    image: `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`,
    episode: [],
    url: `https://rickandmortyapi.com/api/character/${id}`,
    created: '2017-11-04T18:48:46.250Z',
  }
}

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('CharacterList', () => {
  describe('estado de carregamento', () => {
    it('exibe 8 skeletons animados enquanto isLoading=true', () => {
      render(<CharacterList items={[]} isLoading={true} />)
      // Cada SkeletonCard type="character" adiciona um elemento com animate-pulse
      const skeletons = document.querySelectorAll('.animate-pulse')
      expect(skeletons).toHaveLength(8)
    })

    it('não exibe nomes de personagens enquanto está carregando', () => {
      const items = [makeCharacter(1), makeCharacter(2)]
      render(<CharacterList items={items} isLoading={true} />)
      expect(screen.queryByText('Personagem 1')).not.toBeInTheDocument()
    })
  })

  describe('estado vazio', () => {
    it('exibe mensagem de estado vazio quando a lista está sem resultados', () => {
      render(<CharacterList items={[]} isLoading={false} />)
      expect(screen.getByText(/nenhum resultado encontrado/i)).toBeInTheDocument()
    })
  })

  describe('lista preenchida', () => {
    it('renderiza um card para cada personagem recebido', () => {
      const items = [makeCharacter(1), makeCharacter(2), makeCharacter(3)]
      render(<CharacterList items={items} isLoading={false} />)
      expect(screen.getByText('Personagem 1')).toBeInTheDocument()
      expect(screen.getByText('Personagem 2')).toBeInTheDocument()
      expect(screen.getByText('Personagem 3')).toBeInTheDocument()
    })

    it('não exibe estado vazio quando há personagens na lista', () => {
      render(<CharacterList items={[makeCharacter(1)]} isLoading={false} />)
      expect(screen.queryByText(/nenhum resultado encontrado/i)).not.toBeInTheDocument()
    })
  })

  describe('cabeçalho da seção', () => {
    it('exibe o título "Personagens"', () => {
      render(<CharacterList items={[]} isLoading={false} />)
      expect(screen.getByRole('heading', { name: 'Personagens' })).toBeInTheDocument()
    })

    it('exibe link "Ver todos" apontando para /characters', () => {
      render(<CharacterList items={[]} isLoading={false} />)
      expect(screen.getByRole('link', { name: /ver todos/i })).toHaveAttribute('href', '/characters')
    })
  })
})
