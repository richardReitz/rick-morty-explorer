'use client'

import Image from 'next/image'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { useThemeStore } from '@/lib/store/theme'

export function Hero() {
  const { theme } = useThemeStore()

  return (
    <section className="border-b-2 dark:border-transparent border-cyan-primary dark:bg-black overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-stretch items-center">

        <div className="flex-1 flex flex-col justify-center w-full pt-10 pb-2 lg:py-0">
          <h1 className="text-[32px] font-bold sm:text-h1 text-foreground-strong">
            Saiba tudo em
          </h1>
          <h1 className="text-[32px] font-bold sm:text-h1 text-foreground-strong">
            um só <span className='text-cyan-primary'>lugar.</span>
          </h1>

          <p className="mt-6 text-h4 text-foreground-strong">
            Personagens. localizações, episódios e muito mais.
          </p>

          <div className="mt-16">
            <ThemeToggle />
          </div>

          <p className="mt-6 text-h4 text-cyan-primary">
            {theme === 'dark' ? "Ai sim, Porr#@%&*" : "Wubba Lubba Dub Dub! Cuidado com os olhos."}
          </p>
        </div>

        <div className="relative flex-shrink-0 w-full lg:w-[435px] h-[300px] lg:h-[434px]">
          <div className="absolute inset-0">
            <Image
              src={theme === 'dark' ? '/HighlightImage.png' : '/HighLightImage-w.png'}
              alt="Rick Sanchez"
              fill
              className="object-contain lg:object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  )
}
