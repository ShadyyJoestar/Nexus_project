import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui'

type Author = {
  username: string
  display_name: string
}

type ProjectRow = {
  id: string
  title: string
  description: string | null
  tech_stack: string[] | null
  status: string | null
  github_url: string | null
  project_url: string | null
  created_at: string
  profiles: Author | Author[] | null
}

export default async function AdminProjectsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('projects')
    .select(
      `
      id,
      title,
      description,
      tech_stack,
      status,
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

  const projects = ((data ?? []) as ProjectRow[]).map((p) => {
    const raw = p.profiles
    const author = Array.isArray(raw) ? (raw[0] ?? null) : raw
    return { ...p, author }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          All projects
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Overview project member. Hapus/edit project hanya lewat dashboard
          owner masing-masing.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">Author</th>
              <th className="px-4 py-3 font-medium">Stack</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Links</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((p) => {
                const tech = p.tech_stack ?? []
                return (
                  <tr
                    key={p.id}
                    className="border-t border-slate-100 text-slate-700"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{p.title}</p>
                      {p.description ? (
                        <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-slate-400">
                          {p.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      {p.author ? (
                        <Link
                          href={`/members/${p.author.username}`}
                          target="_blank"
                          className="font-medium text-sky-600 hover:underline"
                        >
                          @{p.author.username}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {tech.length > 0 ? (
                        <div className="flex max-w-[180px] flex-wrap gap-1">
                          {tech.slice(0, 3).map((t) => (
                            <Badge key={t} tone="teal">
                              {t}
                            </Badge>
                          ))}
                          {tech.length > 3 ? (
                            <Badge tone="slate">+{tech.length - 3}</Badge>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
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
                        {!p.github_url && !p.project_url ? (
                          <span className="text-slate-400">—</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(p.created_at).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Belum ada project
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}