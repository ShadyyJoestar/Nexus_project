import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Project } from '@/types/database'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell, Card, Badge } from '@/components/ui'

type Props = {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  return {
    title: `@${username} — Nexus`,
    description: `Profil member CodeClass @${username}`,
  }
}

export default async function MemberProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profileData } = await supabase
    .from('profiles')
    .select(
      'id, username, display_name, avatar_url, bio, skills, github_url, role, created_at'
    )
    .eq('username', username)
    .eq('role', 'member')
    .single()

  if (!profileData) notFound()

  const profile = profileData as Pick<
    Profile,
    | 'id'
    | 'username'
    | 'display_name'
    | 'avatar_url'
    | 'bio'
    | 'skills'
    | 'github_url'
    | 'role'
    | 'created_at'
  >

  const { data: projectsData } = await supabase
    .from('projects')
    .select(
      'id, profile_id, title, description, thumbnail_url, github_url, live_url, tech_stack, created_at'
    )
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false })

  const projects = (projectsData ?? []) as Pick<
    Project,
    | 'id'
    | 'profile_id'
    | 'title'
    | 'description'
    | 'thumbnail_url'
    | 'github_url'
    | 'live_url'
    | 'tech_stack'
    | 'created_at'
  >[]

  const skills = profile.skills ?? []

  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        {/* Profile header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-400 text-xl font-bold text-white sm:h-20 sm:w-20 sm:text-2xl">
              {(profile.display_name || profile.username)
                .charAt(0)
                .toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {profile.display_name}
                </h1>
                <Badge tone="teal">Member</Badge>
              </div>
              <p className="mt-0.5 text-sky-600">@{profile.username}</p>
              {profile.bio ? (
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                  {profile.bio}
                </p>
              ) : null}
            </div>
          </div>

          {/* Contact / links */}
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            {profile.github_url ? (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              >
                <span aria-hidden>⌘</span>
                GitHub
              </a>
            ) : null}
            <Link
              href="/members"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
            >
              ← Semua member
            </Link>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Skills
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((s) => (
                <Badge key={s} tone="sky">
                  {s}
                </Badge>
              ))}
            </div>
          </section>
        ) : null}

        {/* Projects */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Projects
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {projects.length > 0
                  ? `${projects.length} project dibagikan`
                  : 'Belum ada project'}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {projects.length > 0 ? (
              projects.map((p) => {
                const tech = p.tech_stack ?? []
                return (
                  <Card key={p.id} className="flex flex-col">
                    <p className="font-semibold text-slate-900">{p.title}</p>
                    {p.description ? (
                      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
                        {p.description}
                      </p>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {tech.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tech.map((t) => (
                          <Badge key={t} tone="teal">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.github_url ? (
                        <a
                          href={p.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                        >
                          GitHub
                        </a>
                      ) : null}
                      {p.live_url ? (
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-gradient-to-r from-sky-500 to-teal-400 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:from-sky-600 hover:to-teal-500"
                        >
                          Live Demo
                        </a>
                      ) : null}
                    </div>
                  </Card>
                )
              })
            ) : (
              <Card className="sm:col-span-2">
                <p className="text-sm text-slate-500">
                  Member ini belum membagikan project.
                </p>
              </Card>
            )}
          </div>
        </section>
      </Container>
    </PageShell>
  )
}