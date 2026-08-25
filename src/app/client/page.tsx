import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Project } from '@/types/database'

export default async function ClientPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: membersData } = await supabase
    .from('profiles')
    .select(
      'id, username, display_name, avatar_url, bio, skills, github_url, role'
    )
    .eq('role', 'member')
    .order('display_name')

  const { data: projectsData } = await supabase
    .from('projects')
    .select(
      'id, profile_id, title, description, tech_stack, github_url, live_url'
    )
    .order('created_at', { ascending: false })

  const members = (membersData ?? []) as Pick<
    Profile,
    | 'id'
    | 'username'
    | 'display_name'
    | 'avatar_url'
    | 'bio'
    | 'skills'
    | 'github_url'
    | 'role'
  >[]

  const projects = (projectsData ?? []) as Pick<
    Project,
    | 'id'
    | 'profile_id'
    | 'title'
    | 'description'
    | 'tech_stack'
    | 'github_url'
    | 'live_url'
  >[]

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-semibold">
          Nexus
        </Link>
        <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-300">
          Client
        </span>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pb-16">
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="mt-2 text-zinc-400">
          Daftar member CodeClass dan project mereka. Role kamu masih{' '}
          <strong className="text-amber-300">client</strong> — admin bisa ubah
          jadi member nanti.
        </p>

        {/* Members */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Members</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.length > 0 ? (
              members.map((m) => {
                const skills = m.skills ?? []

                return (
                  <div
                    key={m.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
                  >
                    <p className="font-semibold">{m.display_name}</p>
                    <p className="text-sm text-zinc-500">@{m.username}</p>

                    {m.bio ? (
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                        {m.bio}
                      </p>
                    ) : null}

                    {skills.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {skills.map((s) => (
                          <span
                            key={s}
                            className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )
              })
            ) : (
              <p className="text-zinc-500">Belum ada member.</p>
            )}
          </div>
        </section>

        {/* Projects */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold">Projects</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {projects.length > 0 ? (
              projects.map((p) => {
                const techStack = p.tech_stack ?? []

                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
                  >
                    <p className="font-semibold">{p.title}</p>

                    {p.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                        {p.description}
                      </p>
                    ) : null}

                    {techStack.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {techStack.map((t) => (
                          <span
                            key={t}
                            className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-4 flex gap-3 text-sm">
                      {p.github_url ? (
                        <a
                          href={p.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline"
                        >
                          GitHub
                        </a>
                      ) : null}
                      {p.live_url ? (
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline"
                        >
                          Live
                        </a>
                      ) : null}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-zinc-500">Belum ada project.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}