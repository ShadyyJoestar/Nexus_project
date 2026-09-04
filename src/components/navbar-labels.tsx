'use client'

import Link from 'next/link'
import { useLocale } from '@/components/locale-provider'

export default function NavbarLabels({
  user,
  displayName,
  dashboardHref,
}: {
  user: boolean
  displayName: string | null
  dashboardHref: string
}) {
  const { t } = useLocale()

  return (
    <>
      <Link
        href="/members"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-300"
      >
        {t('members')}
      </Link>
      <Link
        href="/projects"
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-300"
      >
        {t('projects')}
      </Link>

      {user ? (
        <>
          <Link
            href={dashboardHref}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-teal-300"
          >
            {displayName || t('dashboard')}
          </Link>
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {t('logout')}
            </button>
          </form>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {t('login')}
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-gradient-to-r from-sky-500 to-teal-400 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-sky-600 hover:to-teal-500"
          >
            {t('join')}
          </Link>
        </>
      )}
    </>
  )
}