import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name, username')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="flex w-full flex-col border-b border-slate-200 bg-white lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3 p-4 lg:block lg:p-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-500">
                Admin panel
              </p>
              <h1 className="text-lg font-semibold text-slate-900">Nexus</h1>
            </div>
            <form action="/auth/logout" method="post" className="lg:hidden">
              <button
                type="submit"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </form>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-4 lg:pb-4">
            <p className="mb-1 hidden px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 lg:block">
              Manage
            </p>
            <Link
              href="/admin"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
            >
              Users & roles
            </Link>
            <Link
              href="/admin/projects"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
            >
              All projects
            </Link>

            <p className="mb-1 mt-4 hidden px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 lg:block">
              Public site
            </p>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Home ↗
            </Link>
            <Link
              href="/members"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Members ↗
            </Link>
            <Link
              href="/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Projects ↗
            </Link>
          </nav>

          <div className="mt-auto hidden border-t border-slate-100 p-4 lg:block">
            <p className="text-xs text-slate-400">Login sebagai</p>
            <p className="mt-0.5 truncate text-sm font-medium text-slate-800">
              {profile.display_name || profile.username}
            </p>
            <p className="truncate text-xs text-slate-400">
              @{profile.username}
            </p>
            <form action="/auth/logout" method="post" className="mt-3">
              <button
                type="submit"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
            </form>
          </div>
        </aside>

        {/* Content — lebih luas */}
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}