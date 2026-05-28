import { cn } from '@/lib/utils'

type Status = 'Alive' | 'Dead' | 'unknown'

interface StatusConfig {
  label: string
  className: string
}

const statusConfig: Record<Status, StatusConfig> = {
  Alive: { label: 'Vivo', className: 'bg-green-500 text-white' },
  Dead: { label: 'Morto', className: 'bg-red-500 text-white' },
  unknown: { label: 'Desconhecido', className: 'bg-bg-surface text-muted' },
}

export function Badge({ status }: { status: Status }) {
  const { label, className } = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-body font-medium',
        className
      )}
    >
      {label}
    </span>
  )
}
