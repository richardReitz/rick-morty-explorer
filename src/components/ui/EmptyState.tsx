import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  message?: string
  submessage?: string
}

export function EmptyState({
  message = 'Nenhum resultado encontrado para sua busca',
  submessage,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <SearchX size={48} className="text-muted" />
      <p className="text-h4 text-foreground">{message}</p>
      {submessage && <p className="text-body text-muted">{submessage}</p>}
    </div>
  )
}
