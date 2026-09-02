import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Project } from '@/types/database'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell, Card, Badge } from '@/components/ui'
import MemberDashboard from '@/components/member-dashboard'
import { RoleSelect } from '@/app/admin/users/roleselect'

export default async function LeaderPage() {
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

  // Community stats
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

  const { data: allUsers } = await supabase
    .from('profiles')
    .select(
      'id, username, display_name, role, github_url, skills, created_at'
    )
    .order('created_at', { ascending: false })

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
        {/* Header leader */}
        <div className="mb-10 rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-teal-50/40 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="sky">Leader</Badge>
            <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Dashboard Leader
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Kelola profil & project kamu seperti member, plus pantau komunitas
            dan atur role user (client / member / admin). Role leader hanya
            bisa diubah lewat database.
          </p>
        </div>

        {/* ===== BAGIAN 1: Profil + project sendiri ===== */}
        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            Profil & project saya
          </h2>
          <MemberDashboard
            profile={profile as Profile}
            projects={(projectsData ?? []) as Project[]}
          />
        </section>

        {/* ===== BAGIAN 2: Manajemen komunitas ===== */}
        <section className="border-t border-slate-100 pt-12">
          <h2 className="text-lg font-semibold text-slate-900">
            Manajemen komunitas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Overview CodeClass — tanpa create/delete akun.
          </p>

          {/* Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <p className="text-sm text-slate-500">Total users</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalUsers ?? 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Client</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {clientCount ?? 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Member</p>
              <p className="mt-2 text-3xl font-bold text-teal-600">
                {memberCount ?? 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Admin</p>
              <p className="mt-2 text-3xl font-bold text-sky-600">
                {adminCount ?? 0}
              </p>
            </Card>
            <Card>
              <p className="text-sm text-slate-500">Projects</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {projectCount ?? 0}
              </p>
            </Card>
          </div>

          {/* Users & roles */}
          <div className="mt-10">
            <h3 className="text-base font-semibold text-slate-900">
              Users & roles
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Ubah client → member / admin. Leader tidak bisa diubah dari sini.
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
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
                        className="border-t border-slate-100 text-slate-700"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-900">
                            {u.display_name}
                          </p>
                          <p className="text-xs text-sky-600">@{u.username}</p>
                        </td>
                        <td className="px-4 py-3">
                          <RoleSelect
                            userId={u.id}
                            currentRole={u.role}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1 text-xs">
                            {u.role === 'member' || u.role === 'leader' ? (
                              <Link
                                href={`/members/${u.username}`}
                                className="font-medium text-sky-600 hover:underline"
                              >
                                Profil →
                              </Link>
                            ) : null}
                            {u.github_url ? (
                              <a
                                href={u.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:underline"
                              >
                                GitHub ↗
                              </a>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(u.created_at).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-8 text-center text-slate-400"
                      >
                        Belum ada user
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* All projects (read-only) */}
          <div className="mt-10">
            <h3 className="text-base font-semibold text-slate-900">
              Semua project
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Read-only. Edit/hapus hanya oleh owner di dashboard mereka.
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
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
                          className="border-t border-slate-100 text-slate-700"
                        >
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {p.title}
                          </td>
                          <td className="px-4 py-3">
                            {p.author ? (
                              <Link
                                href={`/members/${p.author.username}`}
                                className="text-sky-600 hover:underline"
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
                                  className="text-sky-600 hover:underline"
                                >
                                  GitHub ↗
                                </a>
                              ) : null}
                              {p.project_url ? (
                                <a
                                  href={p.project_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-slate-500 hover:underline"
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
                        className="px-4 py-8 text-center text-slate-400"
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