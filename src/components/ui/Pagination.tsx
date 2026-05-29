'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const PAGE_WINDOW = 4

function getPaginationRange(current: number, total: number): number[] {
  const half = Math.floor(PAGE_WINDOW / 2)
  let start = Math.max(1, current - half)
  const end = Math.min(total, start + PAGE_WINDOW - 1)
  start = Math.max(1, end - PAGE_WINDOW + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const pageRange = getPaginationRange(currentPage, totalPages)

  return (
    <div className={cn('flex items-center justify-center gap-4', className)}>
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-12 h-12 flex items-center justify-center rounded-full text-foreground hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft size={32} />
      </button>

      {pageRange.map((p) => (
        <button
          type="button"
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            'w-12 h-12 flex items-center justify-center rounded-full text-body font-medium transition-colors',
            p === currentPage
              ? 'bg-cyan-primary text-white border-2 border-cyan-primary'
              : 'bg-transparent text-foreground border-2 border-foreground hover:border-cyan-primary hover:text-cyan-primary'
          )}
          aria-label={`Página ${p}`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-12 h-12 flex items-center justify-center rounded-full text-foreground hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Próxima página"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  )
}
