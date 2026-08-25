import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // 1. Cek login
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Cek role di profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name, username')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Sidebar sederhana */}
      <div className="flex min-h-screen">
        <aside className="w-60 border-r border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Admin
            </p>
            <h1 className="text-lg font-semibold">Nexus</h1>
          </div>

          <nav className="flex flex-col gap-1">
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className="rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              Users
            </Link>
            <Link
              href="/"
              className="mt-4 rounded-lg px-3 py-2 text-sm text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-300"
            >
              ← Kembali ke site
            </Link>
          </nav>

          <div className="mt-auto pt-8 text-xs text-zinc-500">
            Login sebagai
            <p className="mt-1 font-medium text-zinc-300">
              {profile.display_name || profile.username}
            </p>
          </div>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  )
}