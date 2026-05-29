'use client'

import { MapPin, TvMinimalPlay } from 'lucide-react'
import { SmileyBlankIcon } from '../icons'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export type FilterTab = 'characters' | 'locations' | 'episodes'

interface FilterTabsProps {
  active: FilterTab | null
  onChange: (tab: FilterTab | null) => void
}

const tabs: { value: FilterTab; label: string; Icon: React.ElementType }[] = [
  { value: 'characters', label: 'Personagens', Icon: SmileyBlankIcon },
  { value: 'locations', label: 'Localizações', Icon: MapPin },
  { value: 'episodes', label: 'Episódios', Icon: TvMinimalPlay },
]

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <span className="text-body text-foreground-strong whitespace-nowrap flex-shrink-0">Filtrar por:</span>
      {tabs.map(({ value, label, Icon }) => (
        <Button
          key={value}
          variant={active === value ? 'primary' : 'surface'}
          size="sm"
          onClick={() => onChange(active === value ? null : value)}
          className={cn('px-4 py-2 whitespace-nowrap flex-shrink-0', active !== value && 'dark:!bg-transparent dark:hover:!bg-foreground/5')}
        >
          <Icon />
          {label}
        </Button>
      ))}
    </div>
  )
}
