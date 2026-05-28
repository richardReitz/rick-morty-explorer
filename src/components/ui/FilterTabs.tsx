'use client'

import { Users, MapPin, Tv } from 'lucide-react'
import { cn } from '@/lib/utils'

export type FilterTab = 'characters' | 'locations' | 'episodes'

interface FilterTabsProps {
  active: FilterTab
  onChange: (tab: FilterTab) => void
}

const tabs: { value: FilterTab; label: string; Icon: React.ElementType }[] = [
  { value: 'characters', label: 'Personagens', Icon: Users },
  { value: 'locations', label: 'Localizações', Icon: MapPin },
  { value: 'episodes', label: 'Episódios', Icon: Tv },
]

export function FilterTabs({ active, onChange }: FilterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {tabs.map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-full text-body font-medium whitespace-nowrap transition-colors flex-shrink-0',
            active === value
              ? 'bg-cyan-primary text-white'
              : 'bg-bg-surface text-muted hover:text-foreground'
          )}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  )
}
