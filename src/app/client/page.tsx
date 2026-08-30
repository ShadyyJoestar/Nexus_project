import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Project } from '@/types/database'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell, Card, Badge } from '@/components/ui'

export default async function ClientPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

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
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Community
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Lihat member CodeClass dan project mereka.
            </p>
          </div>
          <Badge tone="amber">Role: client</Badge>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Members</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.length > 0 ? (
              members.map((m) => {
                const skills = m.skills ?? []
                return (
                  <Link key={m.id} href={`/members/${m.username}`}>
                    <Card className="h-full transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
                      <p className="font-semibold text-slate-900">
                        {m.display_name}
                      </p>
                      <p className="text-sm text-sky-600">@{m.username}</p>
                      {m.bio ? (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                          {m.bio}
                        </p>
                      ) : null}
                      {skills.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {skills.map((s) => (
                            <Badge key={s} tone="slate">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                      <p className="mt-3 text-sm font-medium text-sky-600">
                        Lihat profil →
                      </p>
                    </Card>
                  </Link>
                )
              })
            ) : (
              <p className="text-sm text-slate-500">Belum ada member.</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900">Projects</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {projects.length > 0 ? (
              projects.map((p) => {
                const tech = p.tech_stack ?? []
                return (
                  <Card key={p.id}>
                    <p className="font-semibold text-slate-900">{p.title}</p>
                    {p.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {p.description}
                      </p>
                    ) : null}
                    {tech.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tech.map((t) => (
                          <Badge key={t} tone="teal">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    <div className="mt-4 flex gap-3 text-sm">
                      {p.github_url ? (
                        <a
                          href={p.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-sky-600 hover:underline"
                        >
                          GitHub
                        </a>
                      ) : null}
                      {p.live_url ? (
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-teal-600 hover:underline"
                        >
                          Live
                        </a>
                      ) : null}
                    </div>
                  </Card>
                )
              })
            ) : (
              <p className="text-sm text-slate-500">Belum ada project.</p>
            )}
          </div>
        </section>
      </Container>
    </PageShell>
  )
}