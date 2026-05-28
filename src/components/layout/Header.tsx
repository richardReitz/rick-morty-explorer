'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useThemeStore } from '@/lib/store/theme'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { theme } = useThemeStore()

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black">
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
        <Button variant="secondary" size="sm" asChild className="px-4 py-1.5">
          <Link href="/favorites">
            <Heart size={16} />
            <span className="hidden sm:inline">Lista de favoritos</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
