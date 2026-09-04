'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeContextValue = {
  theme: Theme
  resolved: 'light' | 'dark'
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystem(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystem() : theme
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  return resolved
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolved, setResolved] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('nexus-theme') as Theme | null
    const initial =
      saved === 'light' || saved === 'dark' || saved === 'system'
        ? saved
        : 'system'
    setThemeState(initial)
    setResolved(applyTheme(initial))

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      setThemeState((current) => {
        if (current === 'system') setResolved(applyTheme('system'))
        return current
      })
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem('nexus-theme', next)
    setResolved(applyTheme(next))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}