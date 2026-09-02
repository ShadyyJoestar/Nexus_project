import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Project } from '@/types/database'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell, Badge } from '@/components/ui'
import MemberDashboard from '@/components/member-dashboard'

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

  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge tone="sky">Leader</Badge>
          <p className="text-sm text-slate-500">
            Dashboard leader CodeClass — kelola profil & project seperti member,
            tampil di atas daftar Members.
          </p>
        </div>
        <MemberDashboard
          profile={profile as Profile}
          projects={(projectsData ?? []) as Project[]}
        />
      </Container>
    </PageShell>
  )
}