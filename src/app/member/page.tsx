import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell, Card, Badge } from '@/components/ui'

export default async function MemberPage() {
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
  if (profile.role === 'admin') redirect('/admin')
  if (profile.role === 'client') redirect('/client')

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })

  const skills = profile.skills ?? []

  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {profile.display_name}
              </h1>
              <Badge tone="teal">Member</Badge>
            </div>
            <p className="mt-1 text-sky-600">@{profile.username}</p>
            {profile.bio ? (
              <p className="mt-3 max-w-xl text-slate-600">{profile.bio}</p>
            ) : null}
            {skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {skills.map((s: string) => (
                  <Badge key={s} tone="sky">
                    {s}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">Project kamu</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {projects && projects.length > 0 ? (
              projects.map((p) => (
                <Card key={p.id}>
                  <p className="font-semibold text-slate-900">{p.title}</p>
                  {p.description ? (
                    <p className="mt-2 text-sm text-slate-500">{p.description}</p>
                  ) : null}
                </Card>
              ))
            ) : (
              <Card>
                <p className="text-sm text-slate-500">
                  Belum ada project. Nanti bisa ditambah dari dashboard member.
                </p>
              </Card>
            )}
          </div>
        </section>
      </Container>
    </PageShell>
  )
}