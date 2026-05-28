'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronUp } from 'lucide-react'
import { useThemeStore } from '@/lib/store/theme'
import { Button } from '@/components/ui/Button'

export function Footer() {
  const { theme } = useThemeStore()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-white dark:bg-bg-primary">
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
        <Button
          onClick={scrollToTop}
          variant="ghost"
          size="sm"
          className="p-0 text-foreground hover:text-cyan-primary hover:bg-transparent"
        >
          <span>Voltar ao topo</span>
          <ChevronUp size={18} />
        </Button>
      </div>
    </footer>
  )
}
