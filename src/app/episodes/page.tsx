'use client'

import { Suspense, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { TvMinimalPlay, Calendar, ListVideo } from 'lucide-react'
import { SmileyBlankIcon } from '@/components/icons'
import { MainLayout } from '@/components/layout'
import { EpisodeCard } from '@/components/cards'
import { FavoriteButton, Pagination, SkeletonCard } from '@/components/ui'
import { getEpisode, getEpisodes } from '@/lib/api/episodes'
import { QUERY_STALE_TIME } from '@/lib/queryConfig'
import { formatDatePtBR } from '@/lib/utils'

function HeroSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-12 w-12 bg-bg-surface rounded" />
      <div className="flex items-center gap-4">
        <div className="h-10 bg-bg-surface rounded w-1/2" />
        <div className="h-8 w-8 bg-bg-surface rounded" />
      </div>
      <div className="h-4 bg-bg-surface rounded w-64" />
      <div className="h-4 bg-bg-surface rounded w-48" />
    </div>
  )
}

function EpisodesPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedId = searchParams.get('id') ? Number(searchParams.get('id')) : null
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)

  const { data: episode, isLoading: isLoadingEpisode } = useQuery({
    queryKey: ['episode', selectedId],
    queryFn: () => getEpisode(selectedId!),
    enabled: !!selectedId,
    staleTime: QUERY_STALE_TIME,
  })

  const { data: episodesData, isLoading: isLoadingEpisodes } = useQuery({
    queryKey: ['episodes', page],
    queryFn: () => getEpisodes(page),
    staleTime: QUERY_STALE_TIME,
    placeholderData: keepPreviousData,
  })

  function handleSelect(id: number) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    router.push(`/episodes?id=${id}`, { scroll: false })
  }

  function changePage(next: number) {
    setPage(next)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const totalPages = episodesData?.info.pages ?? 1
  const episodes = episodesData?.results ?? []

  const heroFavoriteItem = episode
    ? { id: episode.id, type: 'episode' as const, name: episode.name }
    : null

  return (
    <MainLayout>
      {selectedId && (
        <section key={selectedId} className="animate-hero-in border-b-2 dark:border-transparent border-cyan-primary dark:bg-black">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-52">
            {isLoadingEpisode || !episode ? (
              <HeroSkeleton />
            ) : (
              <div className="flex flex-col gap-6">
                <TvMinimalPlay size={48} className="text-foreground-strong" />

                <div className="flex items-center gap-4">
                  <h1 className="text-2xl sm:text-h1 font-bold text-foreground-strong">{episode.name}</h1>
                  {heroFavoriteItem && <FavoriteButton item={heroFavoriteItem} size="lg" />}
                </div>

                <div className="flex items-center gap-5 text-h4 text-foreground-strong">
                  <div className="flex items-center gap-2">
                    <Calendar size={24} className="flex-shrink-0" />
                    <span>{formatDatePtBR(episode.air_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ListVideo size={24} className="flex-shrink-0" />
                    <span>{episode.episode}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-h4 text-foreground-strong mt-10">
                  <SmileyBlankIcon size={24} className="flex-shrink-0" />
                  <span>{episode.characters.length} Personagens participaram deste episódio</span>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16" ref={listRef}>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} />

        <div className="flex items-center gap-3 my-8 lg:my-16">
          <TvMinimalPlay size={24} className="text-foreground flex-shrink-0" />
          <h3 className="text-h3 font-bold text-foreground">Episódios</h3>
        </div>

        {isLoadingEpisodes ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 lg:mb-16">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} type="episode" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 lg:mb-16">
            {episodes.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} onSelect={() => handleSelect(ep.id)} />
            ))}
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={changePage} />
      </div>
    </MainLayout>
  )
}

export default function EpisodesPage() {
  return (
    <Suspense>
      <EpisodesPageInner />
    </Suspense>
  )
}
