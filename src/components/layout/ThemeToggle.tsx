'use client'

import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/lib/store/theme'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className="inline-flex w-fit rounded-full bg-bg-surface overflow-hidden">
      <button
        onClick={() => !isDark && toggleTheme()}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 text-body transition-colors',
          isDark ? 'bg-bg-surface text-foreground' : 'text-muted hover:text-foreground'
        )}
      >
        <Moon size={12} />
        <span>Escuro</span>
      </button>
      <button
        onClick={() => isDark && toggleTheme()}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 text-body transition-colors',
          !isDark ? 'bg-cyan-primary text-white' : 'text-muted hover:text-foreground'
        )}
      >
        <Sun size={12} />
        <span>Claro</span>
      </button>
    </div>
  )
}
