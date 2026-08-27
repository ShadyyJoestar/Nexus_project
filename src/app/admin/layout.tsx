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
    <div className="min-h-screen bg-gradient-to-b from-sky-50/70 via-white to-teal-50/40 text-slate-800">
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="border-b border-sky-100 bg-white md:w-60 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between p-4 md:block md:p-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-500">
                Admin
              </p>
              <h1 className="text-lg font-semibold text-slate-800">Nexus</h1>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-4 md:pb-6">
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
              Users
            </Link>
            <Link
              href="/"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 md:mt-2"
            >
              ← Kembali ke site
            </Link>
          </nav>

          <div className="hidden border-t border-sky-50 p-6 text-xs text-slate-400 md:block">
            Login sebagai
            <p className="mt-1 font-medium text-slate-700">
              {profile.display_name || profile.username}
            </p>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}