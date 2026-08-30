import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile, Project } from '@/types/database'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell } from '@/components/ui'
import MemberDashboard from '@/components/member-dashboard'

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

  const { data: projectsData } = await supabase
    .from('projects')
    .select('*')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <MemberDashboard
          profile={profile as Profile}
          projects={(projectsData ?? []) as Project[]}
        />
      </Container>
    </PageShell>
  )
}