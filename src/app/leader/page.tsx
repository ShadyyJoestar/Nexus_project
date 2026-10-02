import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Project } from '@/types/database'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell, Card, Badge } from '@/components/ui'
import MemberDashboard from '@/components/member-dashboard'
import { RoleSelect } from '@/app/admin/users/roleselect'
import UsersToolbar from '@/components/users-toolbar'
import Pagination from '@/components/pagination'

const PAGE_SIZE = 25

type Props = {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>
}

export default async function LeaderPage({ searchParams }: Props) {
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const roleFilter = (params.role ?? '').trim()
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (profile.role !== 'leader') {
    if (profile.role === 'admin') redirect('/admin')
    if (profile.role === 'member') redirect('/member')
    redirect('/client')
  }

  const { data: projectsData } = await supabase
    .from('projects')
    .select('*')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })

  // Stats — count only (aman untuk ribuan row)
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

  // Users — filtered + paginated
  let usersQuery = supabase
    .from('profiles')
    .select(
      'id, username, display_name, role, github_url, skills, created_at',
      { count: 'exact' }
    )

  if (
    roleFilter &&
    ['client', 'member', 'admin', 'leader'].includes(roleFilter)
  ) {
    usersQuery = usersQuery.eq('role', roleFilter)
  }
  if (q) {
    usersQuery = usersQuery.or(
      `username.ilike.%${q}%,display_name.ilike.%${q}%`
    )
  }

  const { data: allUsers, count: usersCount } = await usersQuery
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalFiltered = usersCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE))

  // Projects list — limit 20 saja
  const { data: allProjectsRaw } = await supabase
    .from('projects')
    .select(
      `
      id,
      title,
      status,
      tech_stack,
      github_url,
      project_url,
      created_at,
      profiles (
        username,
        display_name
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(20)

  type ProjectRow = {
    id: string
    title: string
    status: string | null
    tech_stack: string[] | null
    github_url: string | null
    project_url: string | null
    created_at: string
    profiles:
      | { username: string; display_name: string }
      | { username: string; display_name: string }[]
      | null
  }

  const allProjects = ((allProjectsRaw ?? []) as ProjectRow[]).map((p) => {
    const raw = p.profiles
    const author = Array.isArray(raw) ? (raw[0] ?? null) : raw
    return { ...p, author }
  })

  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <div className="mb-10 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-teal-50/40 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="sky">Leader</Badge>
              <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100">
                Dashboard Leader
              </h1>
            </div>
            <Link
              href="/leader/absensi"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-600 hover:to-teal-500"
            >
              Absensi →
            </Link>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Kelola profil & project kamu, plus pantau komunitas dan atur role
            user. Role leader hanya lewat database.
          </p>
        </div>

        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
            Profil & project saya
          </h2>
          <MemberDashboard
            profile={profile as Profile}
            projects={(projectsData ?? []) as Project[]}
          />
        </section>

        <section className="border-t border-slate-100 pt-12 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Manajemen komunitas
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Overview CodeClass — tanpa create/delete akun.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

          <div className="mt-10 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Users & roles
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Cari / filter · {PAGE_SIZE} per halaman · {totalFiltered} hasil
              </p>
            </div>

            <Suspense fallback={null}>
              <UsersToolbar initialQ={q} initialRole={roleFilter} />
            </Suspense>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Links</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers && allUsers.length > 0 ? (
                    allUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-200"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {u.display_name}
                          </p>
                          <p className="text-xs text-sky-600 dark:text-sky-400">@{u.username}</p>
                        </td>
                        <td className="px-4 py-3">
                          <RoleSelect userId={u.id} currentRole={u.role} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1 text-xs">
                            {u.role === 'member' || u.role === 'leader' ? (
                              <Link
                                href={`/members/${u.username}`}
                                className="font-medium text-sky-600 hover:underline dark:text-sky-400"
                              >
                                Profil →
                              </Link>
                            ) : null}
                            {u.github_url ? (
                              <a
                                href={u.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:underline dark:text-slate-400"
                              >
                                GitHub ↗
                              </a>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400 dark:text-slate-400">
                          {new Date(u.created_at).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-slate-400 dark:text-slate-400"
                      >
                        Tidak ada user yang cocok.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/leader"
              q={q || undefined}
              role={roleFilter || undefined}
            />
          </div>

          <div className="mt-10">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Project terbaru
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              20 project terakhir (read-only).
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Project</th>
                    <th className="px-4 py-3 font-medium">Author</th>
                    <th className="px-4 py-3 font-medium">Stack</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Links</th>
                  </tr>
                </thead>
                <tbody>
                  {allProjects.length > 0 ? (
                    allProjects.map((p) => {
                      const tech = p.tech_stack ?? []
                      return (
                        <tr
                          key={p.id}
                          className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-200"
                        >
                          <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                            {p.title}
                          </td>
                          <td className="px-4 py-3">
                            {p.author ? (
                              <Link
                                href={`/members/${p.author.username}`}
                                className="text-sky-600 hover:underline dark:text-sky-400"
                              >
                                @{p.author.username}
                              </Link>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {tech.length > 0 ? (
                              <div className="flex max-w-[160px] flex-wrap gap-1">
                                {tech.slice(0, 3).map((t) => (
                                  <Badge key={t} tone="teal">
                                    {t}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Badge tone="slate">
                              {(p.status ?? 'published').replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-1 text-xs">
                              {p.github_url ? (
                                <a
                                  href={p.github_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sky-600 hover:underline dark:text-sky-400"
                                >
                                  GitHub ↗
                                </a>
                              ) : null}
                              {p.project_url ? (
                                <a
                                  href={p.project_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-500 hover:underline dark:text-slate-400"
                                >
                                  Project ↗
                                </a>
                              ) : null}
                              {!p.github_url && !p.project_url ? '—' : null}
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-slate-400 dark:text-slate-400"
                      >
                        Belum ada project
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </Container>
    </PageShell>
  )
}