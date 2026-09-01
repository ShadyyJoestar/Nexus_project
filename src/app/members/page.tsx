import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell, Card, Badge } from '@/components/ui'

export const metadata = {
  title: 'Members — Nexus',
  description: 'Daftar member CodeClass di Nexus',
}

export default async function MembersPage() {
  const supabase = await createClient()

  const { data: membersData } = await supabase
    .from('profiles')
    .select(
      'id, username, display_name, avatar_url, bio, skills, github_url, role'
    )
    .eq('role', 'member')
    .order('display_name')

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

  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-sky-600">CodeClass</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Members
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Kenali member CodeClass dan lihat karya yang mereka bagikan.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {members.length > 0 ? (
            members.map((m) => {
              const skills = m.skills ?? []
              return (
                <Link key={m.id} href={`/members/${m.username}`}>
                  <Card className="h-full transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
                    <div className="flex items-start gap-3">
                      {m.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.avatar_url}
                          alt={m.display_name}
                          className="h-11 w-11 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-teal-400 text-sm font-bold text-white">
                          {(m.display_name || m.username)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">
                          {m.display_name}
                        </p>
                        <p className="text-sm text-sky-600">@{m.username}</p>
                      </div>
                    </div>

                    {m.bio ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {m.bio}
                      </p>
                    ) : null}

                    {skills.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {skills.slice(0, 4).map((s) => (
                          <Badge key={s} tone="slate">
                            {s}
                          </Badge>
                        ))}
                        {skills.length > 4 ? (
                          <Badge tone="slate">+{skills.length - 4}</Badge>
                        ) : null}
                      </div>
                    ) : null}

                    <p className="mt-4 text-sm font-medium text-sky-600">
                      Lihat profil →
                    </p>
                  </Card>
                </Link>
              )
            })
          ) : (
            <Card className="sm:col-span-2 lg:col-span-3">
              <p className="text-sm text-slate-500">
                Belum ada member. Nanti akan muncul di sini setelah role
                diubah menjadi member.
              </p>
            </Card>
          )}
        </div>
      </Container>
    </PageShell>
  )
}