'use client'

import Link from 'next/link'
import { ChevronUp } from 'lucide-react'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-bg-secondary border-t border-bg-surface">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <Link href="/" className="text-h4 font-bold text-cyan-primary">
          Rick and Morty
        </Link>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-body text-foreground hover:text-cyan-primary transition-colors"
        >
          <span>Voltar ao topo</span>
          <ChevronUp size={18} />
        </button>
      </div>
    </footer>
  )
}
