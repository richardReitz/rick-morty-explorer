'use client'

import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/lib/store/theme'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className="inline-flex w-fit rounded-full bg-bg-surface overflow-hidden">
      <Button
        onClick={() => !isDark && toggleTheme()}
        variant="ghost"
        size="sm"
        className={cn(
          'px-3 py-1.5 rounded-none [&>svg]:size-3',
          isDark
            ? 'bg-bg-surface text-foreground hover:bg-bg-surface hover:text-foreground'
            : 'text-muted hover:text-foreground hover:bg-transparent'
        )}
      >
        <Moon size={12} />
        <span>Escuro</span>
      </Button>
      <Button
        onClick={() => isDark && toggleTheme()}
        variant="ghost"
        size="sm"
        className={cn(
          'px-3 py-1.5 rounded-none [&>svg]:size-3',
          !isDark
            ? 'bg-cyan-primary text-white hover:bg-cyan-secondary hover:text-white'
            : 'text-muted hover:text-foreground hover:bg-transparent'
        )}
      >
        <Sun size={12} />
        <span>Claro</span>
      </Button>
    </div>
  )
}
