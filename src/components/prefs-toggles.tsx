'use client'

import { useTheme } from '@/components/theme-provider'
import { useLocale } from '@/components/locale-provider'

export default function PrefsToggles() {
  const { theme, setTheme } = useTheme()
  const { locale, setLocale, t } = useLocale()

  return (
    <div className="flex items-center gap-1">
      <select
        aria-label={t('theme')}
        value={theme}
        onChange={(e) =>
          setTheme(e.target.value as 'light' | 'dark' | 'system')
        }
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 outline-none transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <option value="light">{t('light')}</option>
        <option value="dark">{t('dark')}</option>
        <option value="system">{t('system')}</option>
      </select>
      <select
        aria-label={t('language')}
        value={locale}
        onChange={(e) => setLocale(e.target.value as 'id' | 'en')}
        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-600 outline-none transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <option value="id">ID</option>
        <option value="en">EN</option>
      </select>
    </div>
  )
}