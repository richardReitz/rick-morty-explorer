type SkeletonType = 'character' | 'episode' | 'location'

export function SkeletonCard({ type }: { type: SkeletonType }) {
  if (type === 'character') {
    return (
      <div className="bg-bg-secondary rounded-xl overflow-hidden animate-pulse">
        <div className="aspect-square bg-bg-surface" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-bg-surface rounded w-3/4" />
          <div className="h-3 bg-bg-surface rounded w-1/2" />
          <div className="h-3 bg-bg-surface rounded w-2/3" />
          <div className="h-3 bg-bg-surface rounded w-1/2" />
          <div className="h-8 bg-bg-surface rounded mt-3" />
        </div>
      </div>
    )
  }

  if (type === 'episode') {
    return (
      <div className="bg-bg-secondary rounded-xl p-4 flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-bg-surface flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-bg-surface rounded w-1/3" />
          <div className="h-4 bg-bg-surface rounded w-2/3" />
          <div className="h-3 bg-bg-surface rounded w-1/2" />
        </div>
        <div className="h-8 w-24 bg-bg-surface rounded-lg" />
      </div>
    )
  }

  return (
    <div className="bg-bg-secondary rounded-xl p-4 flex flex-col items-center gap-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-bg-surface" />
      <div className="w-full space-y-2">
        <div className="h-4 bg-bg-surface rounded w-3/4 mx-auto" />
        <div className="h-3 bg-bg-surface rounded w-1/2 mx-auto" />
        <div className="h-3 bg-bg-surface rounded w-2/3 mx-auto" />
      </div>
      <div className="h-8 w-full bg-bg-surface rounded-lg" />
    </div>
  )
}
