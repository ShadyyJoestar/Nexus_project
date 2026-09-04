'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from '@/components/locale-provider'

export default function MobileNav({
  user,
  displayName,
  dashboardHref,
}: {
  user: boolean
  displayName: string | null
  dashboardHref: string
}) {
  const [open, setOpen] = useState(false)
  const { t } = useLocale()

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-100 text-slate-700 transition hover:bg-sky-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        {open ? (
          <span className="text-lg leading-none">×</span>
        ) : (
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 rounded bg-slate-700 dark:bg-slate-200" />
            <span className="block h-0.5 w-5 rounded bg-slate-700 dark:bg-slate-200" />
            <span className="block h-0.5 w-5 rounded bg-slate-700 dark:bg-slate-200" />
          </span>
        )}
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-14 z-50 border-b border-sky-100 bg-white px-4 py-3 shadow-lg dark:border-slate-800 dark:bg-slate-950 sm:top-16">
          <div className="flex flex-col gap-1">
            <Link
              href="/members"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t('members')}
            </Link>
            <Link
              href="/projects"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {t('projects')}
            </Link>
            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {displayName || t('dashboard')}
                </Link>
                <form action="/auth/logout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {t('logout')}
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-lg bg-gradient-to-r from-sky-500 to-teal-400 px-3 py-2.5 text-center text-sm font-medium text-white"
                >
                  {t('join')}
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}