import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Project } from '@/types/database'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell, Card, Badge } from '@/components/ui'

export const metadata = {
  title: 'Projects — Nexus',
  description: 'Project showcase member CodeClass di Nexus',
}

type Author = {
  username: string
  display_name: string
}

type ProjectRow = Pick<
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
> & {
  profiles: Author | Author[] | null
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projectsData } = await supabase
    .from('projects')
    .select(
      `
      id,
      profile_id,
      title,
      description,
      thumbnail_url,
      github_url,
      live_url,
      tech_stack,
      created_at,
      profiles (
        username,
        display_name
      )
    `
    )
    .order('created_at', { ascending: false })

  const projects = ((projectsData ?? []) as ProjectRow[]).map((p) => {
    const raw = p.profiles
    const author: Author | null = Array.isArray(raw)
      ? (raw[0] ?? null)
      : raw
    return { ...p, profiles: author }
  })

  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-sky-600">CodeClass</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Projects
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Semua project yang dibagikan member CodeClass.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2">
          {projects.length > 0 ? (
            projects.map((p) => {
              const tech = p.tech_stack ?? []
              const author = p.profiles

              return (
                <Card key={p.id} className="flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-slate-900">{p.title}</p>
                  </div>

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

                  {author ? (
                    <p className="mt-4 text-sm text-slate-500">
                      oleh{' '}
                      <Link
                        href={`/members/${author.username}`}
                        className="font-medium text-sky-600 hover:underline"
                      >
                        {author.display_name}
                      </Link>
                      <span className="text-slate-400">
                        {' '}
                        · @{author.username}
                      </span>
                    </p>
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
                Belum ada project yang dibagikan.
              </p>
            </Card>
          )}
        </div>
      </Container>
    </PageShell>
  )
}