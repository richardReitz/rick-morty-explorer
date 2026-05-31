import type { ReactNode } from 'react'

interface DetailHeroSectionProps {
  selectedId: number | null
  isLoading: boolean
  skeleton: ReactNode
  children: ReactNode
  innerClassName?: string
}

export function DetailHeroSection({
  selectedId,
  isLoading,
  skeleton,
  children,
  innerClassName = 'py-10',
}: DetailHeroSectionProps) {
  if (!selectedId) return null

  return (
    <section key={selectedId} className="animate-hero-in border-b-2 dark:border-transparent border-cyan-primary dark:bg-black">
      <div className={`max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 ${innerClassName}`}>
        {isLoading ? skeleton : children}
      </div>
    </section>
  )
}
