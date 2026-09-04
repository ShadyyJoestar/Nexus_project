'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { t as translate, type Locale, type TranslationKey } from '@/lib/i18n'

type LocaleContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('id')

  useEffect(() => {
    const saved = localStorage.getItem('nexus-locale') as Locale | null
    if (saved === 'id' || saved === 'en') setLocaleState(saved)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    localStorage.setItem('nexus-locale', next)
    document.documentElement.lang = next
  }, [])

  const t = useCallback(
    (key: TranslationKey) => translate(locale, key),
    [locale]
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}