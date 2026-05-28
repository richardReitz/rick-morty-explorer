'use client'

import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/lib/store/theme'
import { Button } from '@/components/ui/Button'

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div className="flex gap-3">
      <Button
        onClick={() => !isDark && toggleTheme()}
        variant={isDark ? "primary" : "secondary"}
        size="sm"
      >
        <Moon size={12} />
        <span>Escuro</span>
      </Button>
      <Button
        onClick={() => isDark && toggleTheme()}
        variant={!isDark ? "primary" : "secondary"}
        size="sm"
      >
        <Sun size={12} />
        <span>Claro</span>
      </Button>
    </div>
  )
}
