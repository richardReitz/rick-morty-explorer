type DetailHeroSkeletonVariant = 'character' | 'episode' | 'location'

interface DetailHeroSkeletonProps {
  variant: DetailHeroSkeletonVariant
}

export function DetailHeroSkeleton({ variant }: DetailHeroSkeletonProps) {
  if (variant === 'character') {
    return (
      <div className="flex flex-col sm:flex-row gap-8 animate-pulse">
        <div className="flex-shrink-0 w-full sm:w-[369px] h-[461px] bg-bg-surface rounded-lg" />
        <div className="flex-1 space-y-4 py-2">
          <div className="h-10 bg-bg-surface rounded w-2/3" />
          <div className="h-4 bg-bg-surface rounded w-1/3" />
          <div className="flex gap-4">
            <div className="h-4 bg-bg-surface rounded w-16" />
            <div className="h-4 bg-bg-surface rounded w-20" />
            <div className="h-4 bg-bg-surface rounded w-14" />
          </div>
          <div className="flex gap-6 mt-6">
            <div className="flex-1 h-36 bg-bg-surface rounded-2xl" />
            <div className="flex-1 h-36 bg-bg-surface rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'episode') {
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

  return (
    <div className="flex flex-col gap-6 animate-pulse py-4">
      <div className="w-16 h-16 rounded-full bg-bg-surface" />
      <div className="h-10 bg-bg-surface rounded w-1/2" />
      <div className="flex gap-6">
        <div className="h-4 bg-bg-surface rounded w-24" />
        <div className="h-4 bg-bg-surface rounded w-32" />
      </div>
      <div className="h-4 bg-bg-surface rounded w-48" />
    </div>
  )
}
