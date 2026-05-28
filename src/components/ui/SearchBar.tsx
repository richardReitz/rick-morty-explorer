'use client'

import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Personagens, episódios, localização...',
  className,
}: SearchBarProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full bg-bg-surface rounded-lg pl-4 pr-9 h-10 text-body text-foreground',
          'placeholder:text-muted border border-transparent',
          'focus:outline-none focus:border-cyan-primary transition-colors'
        )}
      />
      {value ? (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 text-muted hover:text-foreground transition-colors"
          aria-label="Limpar busca"
        >
          <X size={14} />
        </button>
      ) : (
        <Search
          size={16}
          className="absolute right-3 text-muted pointer-events-none"
        />
      )}
    </div>
  )
}
