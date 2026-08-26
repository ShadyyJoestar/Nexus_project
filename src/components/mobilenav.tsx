'use client'

import { useState } from 'react'
import Link from 'next/link'

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

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-sky-100 text-slate-700 transition hover:bg-sky-50"
      >
        {open ? (
          <span className="text-lg leading-none">×</span>
        ) : (
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 rounded bg-slate-700" />
            <span className="block h-0.5 w-5 rounded bg-slate-700" />
            <span className="block h-0.5 w-5 rounded bg-slate-700" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-14 border-b border-sky-100 bg-white px-4 py-3 shadow-lg sm:top-16">
          <div className="flex flex-col gap-1">
            <Link
              href="/members"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50"
            >
              Members
            </Link>
            <Link
              href="/projects"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50"
            >
              Projects
            </Link>

            {user ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-teal-50"
                >
                  {displayName || 'Dashboard'}
                </Link>
                <form action="/auth/logout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="mt-1 rounded-lg bg-gradient-to-r from-sky-500 to-teal-400 px-3 py-2.5 text-center text-sm font-medium text-white"
                >
                  Gabung
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}