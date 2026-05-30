import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CharacterCard } from '@/components/cards/CharacterCard'
import type { Character } from '@/lib/types'

// ─── Mocks de módulos externos ────────────────────────────────────────────────

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// FavoriteButton depende do zustand com persist — isolamos para focar no card
vi.mock('@/components/ui/FavoriteButton', () => ({
  FavoriteButton: ({ item }: { item: { id: number } }) => (
    <button aria-label="Adicionar aos favoritos" data-id={item.id} />
  ),
}))

// ─── Factory de dados ─────────────────────────────────────────────────────────

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Terra C-137', url: 'https://rickandmortyapi.com/api/location/1' },
    location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    episode: [],
    url: 'https://rickandmortyapi.com/api/character/1',
    created: '2017-11-04T18:48:46.250Z',
    ...overrides,
  }
}

// ─── Testes ───────────────────────────────────────────────────────────────────

describe('CharacterCard', () => {
  describe('renderização das informações do personagem', () => {
    it('exibe o nome do personagem', () => {
      render(<CharacterCard character={makeCharacter({ name: 'Morty Smith' })} />)
      expect(screen.getByText('Morty Smith')).toBeInTheDocument()
    })

    it('exibe "Vivo" para personagens com status Alive', () => {
      render(<CharacterCard character={makeCharacter({ status: 'Alive' })} />)
      expect(screen.getByText('Vivo')).toBeInTheDocument()
    })

    it('exibe "Morto" para personagens com status Dead', () => {
      render(<CharacterCard character={makeCharacter({ status: 'Dead' })} />)
      expect(screen.getByText('Morto')).toBeInTheDocument()
    })

    it('exibe "Desconhecido" para personagens com status unknown', () => {
      render(<CharacterCard character={makeCharacter({ status: 'unknown' })} />)
      expect(screen.getByText('Desconhecido')).toBeInTheDocument()
    })

    it('exibe a espécie do personagem', () => {
      render(<CharacterCard character={makeCharacter({ species: 'Alien' })} />)
      expect(screen.getByText('Alien')).toBeInTheDocument()
    })

    it('exibe o nome da origem do personagem', () => {
      render(<CharacterCard character={makeCharacter({ origin: { name: 'Planeta X', url: '' } })} />)
      expect(screen.getByText('Planeta X')).toBeInTheDocument()
    })

    it('exibe a imagem com o nome do personagem como alt text', () => {
      render(<CharacterCard character={makeCharacter({ name: 'Beth Smith', image: '/beth.jpg' })} />)
      expect(screen.getByAltText('Beth Smith')).toBeInTheDocument()
    })
  })

  describe('botão "Saiba mais"', () => {
    it('chama onSelect ao clicar quando onSelect é fornecido', async () => {
      const onSelect = vi.fn()
      render(<CharacterCard character={makeCharacter()} onSelect={onSelect} />)
      await userEvent.click(screen.getByRole('button', { name: /saiba mais/i }))
      expect(onSelect).toHaveBeenCalledOnce()
    })

    it('renderiza um link para /characters?id=X quando onSelect não é fornecido', () => {
      render(<CharacterCard character={makeCharacter({ id: 42 })} />)
      const link = screen.getByRole('link', { name: /saiba mais/i })
      expect(link).toHaveAttribute('href', '/characters?id=42')
    })
  })

  describe('botão de favorito', () => {
    it('exibe o botão de favorito para o personagem correto', () => {
      render(<CharacterCard character={makeCharacter({ id: 7 })} />)
      const btn = screen.getByRole('button', { name: /favoritos/i })
      expect(btn).toBeInTheDocument()
      expect(btn).toHaveAttribute('data-id', '7')
    })
  })
})
