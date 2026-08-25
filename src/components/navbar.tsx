import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role: string | null = null
  let displayName: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, display_name, username')
      .eq('id', user.id)
      .single()

    role = profile?.role ?? null
    displayName = profile?.display_name || profile?.username || null
  }

  const dashboardHref =
    role === 'admin' ? '/admin' : role === 'member' ? '/member' : role === 'client' ? '/client' : '/login'

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-teal-400 text-sm font-bold text-white">
            N
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-800">
            Nexus
          </span>
          <span className="hidden text-xs font-medium text-sky-500 sm:inline">
            CodeClass
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/members"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700 sm:inline-block"
          >
            Members
          </Link>
          <Link
            href="/projects"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700 sm:inline-block"
          >
            Projects
          </Link>

          {user ? (
            <>
              <Link
                href={dashboardHref}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
              >
                {displayName || 'Dashboard'}
              </Link>
              <form action="/auth/logout" method="post">
                <button
                  type="submit"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-sky-500 to-teal-400 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-sky-600 hover:to-teal-500"
              >
                Gabung
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}