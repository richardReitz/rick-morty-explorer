'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-black">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <Link href="/">
          <Image
            src="/LogoA.png"
            alt="Rick and Morty"
            width={164}
            height={44}
            className="w-[120px] sm:w-[164px] h-auto object-contain"
          />
        </Link>
        <Button variant="primary" size="sm" asChild >
          <Link href="/favorites">
            <Heart size={16} />
            <span className="hidden sm:inline">Lista de favoritos</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
