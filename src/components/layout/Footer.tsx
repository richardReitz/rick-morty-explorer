'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronUp } from 'lucide-react'
import { useThemeStore } from '@/lib/store/theme'

export function Footer() {
  const { theme } = useThemeStore()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-bg-secondary border-t border-bg-surface">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <Link href="/">
          <Image
            src={theme === 'dark' ? '/LogoA.png' : '/LogoB.png'}
            alt="Rick and Morty"
            width={120}
            height={40}
            className="object-contain"
          />
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
