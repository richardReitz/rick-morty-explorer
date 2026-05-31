'use client'

import { useState } from 'react'
import { MapPin, TvMinimalPlay, ListFilter } from 'lucide-react'
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
  const [open, setOpen] = useState(false)
  const activeTab = tabs.find(t => t.value === active)

  return (
    <>
      {/* Mobile / tablet: dropdown */}
      <div className="relative lg:hidden flex-shrink-0">
        <Button
          variant={active ? 'primary' : 'surface'}
          size="sm"
          onClick={() => setOpen(prev => !prev)}
          className={cn(
            'px-4 h-10',
            !active && '!bg-white dark:!bg-[#313234] border border-foreground-strong dark:border-transparent text-foreground-strong dark:!text-white'
          )}
        >
          <ListFilter size={16} />
          {activeTab ? activeTab.label : 'Filtrar'}
        </Button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-2 z-20 min-w-[180px] bg-bg-secondary dark:bg-bg-surface rounded-2xl p-1.5 flex flex-col gap-0.5 shadow-lg">
              {active && (
                <button
                  onClick={() => { onChange(null); setOpen(false) }}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-body text-muted hover:bg-bg-surface dark:hover:bg-bg-primary transition-colors text-left w-full"
                >
                  Todos
                </button>
              )}
              {tabs.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => { onChange(active === value ? null : value); setOpen(false) }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-body transition-colors text-left w-full',
                    active === value
                      ? 'bg-cyan-primary text-white'
                      : 'text-foreground-strong hover:bg-bg-surface dark:hover:bg-bg-primary'
                  )}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop: tab buttons */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-body text-foreground-strong whitespace-nowrap flex-shrink-0">Filtrar por:</span>
        {tabs.map(({ value, label, Icon }) => (
          <Button
            key={value}
            variant={active === value ? 'primary' : 'surface'}
            size="sm"
            onClick={() => onChange(active === value ? null : value)}
            className={cn('px-4 py-2 whitespace-nowrap flex-shrink-0', active !== value && 'dark:!bg-[#313234] dark:hover:!bg-[#313234]/80 dark:!text-white')}
          >
            <Icon />
            {label}
          </Button>
        ))}
      </div>
    </>
  )
}
