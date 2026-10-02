import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, Badge } from '@/components/ui'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: clientCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')

  const { count: memberCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'member')

  const { count: adminCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'admin')

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, username, display_name, role, created_at')
    .order('created_at', { ascending: false })
    .limit(8)

  const { data: recentProjects } = await supabase
    .from('projects')
    .select(
      `
      id,
      title,
      tech_stack,
      status,
      created_at,
      profiles (
        username,
        display_name
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(6)

  type RecentProject = {
    id: string
    title: string
    tech_stack: string[] | null
    status: string | null
    created_at: string
    profiles:
      | { username: string; display_name: string }
      | { username: string; display_name: string }[]
      | null
  }

  const projects = ((recentProjects ?? []) as RecentProject[]).map((p) => {
    const raw = p.profiles
    const author = Array.isArray(raw) ? (raw[0] ?? null) : raw
    return { ...p, author }
  })

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base dark:text-slate-400">
            Ringkasan komunitas CodeClass di Nexus
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/users"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Kelola roles
          </Link>
          <Link
            href="/admin/projects"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            Lihat projects
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total users</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {totalUsers ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Client</p>
          <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
            {clientCount ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Member</p>
          <p className="mt-2 text-3xl font-bold text-teal-600 dark:text-teal-400">
            {memberCount ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Admin</p>
          <p className="mt-2 text-3xl font-bold text-sky-600 dark:text-sky-400">
            {adminCount ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Projects</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
            {projectCount ?? 0}
          </p>
        </Card>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        {/* Recent users */}
        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              User terbaru
            </h2>
            <Link
              href="/admin/users"
              className="text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
            >
              Semua →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers && recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-200"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {user.display_name}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-400">
                          @{user.username}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          tone={
                            user.role === 'admin'
                              ? 'sky'
                              : user.role === 'client'
                                ? 'amber'
                                : 'teal'
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-400 dark:text-slate-400">
                        {new Date(user.created_at).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-slate-400 dark:text-slate-400"
                    >
                      Belum ada user
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent projects */}
        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Project terbaru
            </h2>
            <Link
              href="/admin/projects"
              className="text-sm font-medium text-sky-600 hover:underline dark:text-sky-400"
            >
              Semua →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Author</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-200"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{p.title}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-400">
                          {new Date(p.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {p.author ? (
                          <Link
                            href={`/members/${p.author.username}`}
                            target="_blank"
                            className="hover:text-sky-600 hover:underline"
                          >
                            @{p.author.username}
                          </Link>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone="slate">
                          {(p.status ?? 'published').replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-slate-400 dark:text-slate-400"
                    >
                      Belum ada project
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}