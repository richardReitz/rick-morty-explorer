import Link from 'next/link'
import { Heart } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-bg-secondary border-b border-bg-surface">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-h3 font-bold text-cyan-primary">
          Rick and Morty
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/favorites"
            className="flex items-center gap-2 text-body text-foreground hover:text-cyan-primary transition-colors"
          >
            <Heart size={18} />
            <span className="hidden sm:inline">Lista de favoritos</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
