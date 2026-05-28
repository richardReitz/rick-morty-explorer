import { cn } from '@/lib/utils'

type SpinnerSize = 'sm' | 'md' | 'lg'

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-16 h-16 border-4',
}

export function LoadingSpinner({ size = 'md' }: { size?: SpinnerSize }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          'rounded-full border-bg-surface border-t-cyan-primary animate-spin',
          sizeClasses[size]
        )}
      />
    </div>
  )
}
