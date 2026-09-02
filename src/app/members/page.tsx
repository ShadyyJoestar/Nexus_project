import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell, Card, Badge } from '@/components/ui'

export const metadata = {
  title: 'Members — Nexus',
  description: 'Daftar member & leader CodeClass di Nexus',
}

type MemberCard = Pick<
  Profile,
  | 'id'
  | 'username'
  | 'display_name'
  | 'avatar_url'
  | 'bio'
  | 'skills'
  | 'github_url'
  | 'role'
>

function PersonCard({ m, featured }: { m: MemberCard; featured?: boolean }) {
  const skills = m.skills ?? []
  return (
    <Link href={`/members/${m.username}`}>
      <Card
        className={`h-full transition hover:-translate-y-0.5 hover:shadow-md ${
          featured
            ? 'border-sky-200 bg-gradient-to-b from-sky-50/80 to-white hover:border-sky-300'
            : 'hover:border-sky-200'
        }`}
      >
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
              {(m.display_name || m.username).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold text-slate-900">
                {m.display_name}
              </p>
              {m.role === 'leader' ? (
                <Badge tone="sky">Leader</Badge>
              ) : (
                <Badge tone="teal">Member</Badge>
              )}
            </div>
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

        <p className="mt-4 text-sm font-medium text-sky-600">Lihat profil →</p>
      </Card>
    </Link>
  )
}

export default async function MembersPage() {
  const supabase = await createClient()

  const { data: peopleData } = await supabase
    .from('profiles')
    .select(
      'id, username, display_name, avatar_url, bio, skills, github_url, role'
    )
    .in('role', ['leader', 'member'])
    .order('display_name')

  const people = (peopleData ?? []) as MemberCard[]
  const leaders = people.filter((p) => p.role === 'leader')
  const members = people.filter((p) => p.role === 'member')

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
            Leader dan member CodeClass — kenali mereka dan karya yang dibagikan.
          </p>
        </div>

        {leaders.length > 0 ? (
          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-600">
              Leaders
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {leaders.map((m) => (
                <PersonCard key={m.id} m={m} featured />
              ))}
            </div>
          </section>
        ) : null}

        <section className={leaders.length > 0 ? 'mt-12' : 'mt-8 sm:mt-10'}>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Members
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.length > 0 ? (
              members.map((m) => <PersonCard key={m.id} m={m} />)
            ) : (
              <Card className="sm:col-span-2 lg:col-span-3">
                <p className="text-sm text-slate-500">
                  Belum ada member. Nanti muncul setelah role diubah menjadi
                  member.
                </p>
              </Card>
            )}
          </div>
        </section>
      </Container>
    </PageShell>
  )
}