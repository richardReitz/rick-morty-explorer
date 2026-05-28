'use client'

import Image from 'next/image'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useThemeStore } from '@/lib/store/theme'

interface HeroProps {
  onAccentClick: () => void
}

export function Hero({ onAccentClick }: HeroProps) {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <section className="border-b-2 dark:border-transparent border-cyan-primary dark:bg-black">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-stretch items-center">

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-h1 text-foreground">
            Saiba tudo em
          </h1>
          <h1 className="text-h1 text-foreground">
            um só <span className='text-cyan-primary'>lugar.</span>
          </h1>

          <p className="mt-6 text-h4 text-foreground">
            Personagens. localizações, episódios e muito mais.
          </p>

        <div className="mt-16">
            <ThemeToggle />
          </div>

          <button
            onClick={onAccentClick}
            className="mt-6 w-fit text-h4 text-cyan-primary hover:underline underline-offset-2 transition-colors"
          >
            {isDark ? "Ai sim, Porr#@%&*" : "Wubba Lubba Dub Dub! Cuidado com os olhos."}
          </button>
        </div>

        <div className="relative flex-shrink-0 w-full lg:w-[435px] h-[300px] lg:h-[434px]">
          <div className="absolute inset-0">
            <Image
              src={theme === 'dark' ? '/HighlightImage.png' : '/HighLightImage-w.png'}
              alt="Rick Sanchez"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  )
}
