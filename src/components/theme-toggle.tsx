'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      aria-label='Toggle theme'
      aria-pressed={isDark}
      className='relative transition-all duration-200'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      size='icon'
      type='button'
      variant='ghost'
    >
      <span className='relative size-4'>
        <Sun className='absolute inset-0 scale-0 -rotate-90 transition-all duration-200 dark:scale-100 dark:rotate-0' />
        <Moon className='absolute inset-0 scale-100 rotate-0 transition-all duration-200 dark:scale-0 dark:-rotate-90' />
      </span>
    </Button>
  )
}
