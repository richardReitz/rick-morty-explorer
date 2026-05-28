'use client'

import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

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
          'w-full bg-white dark:bg-bg-surface rounded-full pl-4 pr-9 h-10 text-body text-foreground',
          'placeholder:text-muted border border-transparent [.light_&]:border-foreground/30',
          'focus:outline-none focus:border-cyan-primary transition-colors'
        )}
      />
      {value ? (
        <Button
          onClick={() => onChange('')}
          variant="ghost"
          size="sm"
          aria-label="Limpar busca"
          className="absolute right-3 p-0 text-muted hover:text-foreground hover:bg-transparent [&>svg]:size-3.5"
        >
          <X size={14} />
        </Button>
      ) : (
        <Search
          size={16}
          className="absolute right-3 text-muted pointer-events-none"
        />
      )}
    </div>
  )
}
