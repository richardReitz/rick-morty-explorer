'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useThemeStore } from '@/lib/store/theme'

export function Header() {
  const { theme } = useThemeStore()

  return (
    <header className="sticky top-0 z-50 bg-bg-secondary border-b border-bg-surface">
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
        <Link
          href="/favorites"
          className="flex items-center gap-2 text-body text-cyan-primary border border-cyan-primary rounded-full px-4 py-1.5 hover:bg-cyan-primary/10 transition-colors"
        >
          <Heart size={16} />
          <span className="hidden sm:inline">Lista de favoritos</span>
        </Link>
      </div>
    </header>
  )
}
