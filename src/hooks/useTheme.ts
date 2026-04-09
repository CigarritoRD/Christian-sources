import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const THEME_KEY = 'toolkit-box-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const savedTheme = window.localStorage.getItem(THEME_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme
  }

  return 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  }
}