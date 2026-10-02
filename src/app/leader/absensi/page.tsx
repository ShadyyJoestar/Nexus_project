import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type {
  AbsensiRecord,
  AbsensiSession,
  EkskulStudent,
} from '@/types/database'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell, Badge } from '@/components/ui'
import AbsensiPanel from '@/components/absensi-panel'

export default async function LeaderAbsensiPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'leader') {
    if (profile?.role === 'admin') redirect('/admin/absensi')
    redirect('/')
  }

  const { data: studentsData } = await supabase
    .from('ekskul_students')
    .select('*')
    .order('full_name', { ascending: true })

  const { data: sessionsData } = await supabase
    .from('absensi_sessions')
    .select('*')
    .order('session_date', { ascending: false })
    .limit(60)

  const sessionIds = (sessionsData ?? []).map((s) => s.id)

  let recordsData: AbsensiRecord[] = []
  if (sessionIds.length > 0) {
    const { data } = await supabase
      .from('absensi_records')
      .select('*')
      .in('session_id', sessionIds)
    recordsData = (data ?? []) as AbsensiRecord[]
  }

  const students = (studentsData ?? []) as EkskulStudent[]
  const sessions = (sessionsData ?? []) as AbsensiSession[]

  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="sky">Leader</Badge>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                Absensi
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Isi absensi siswa ekskul per tanggal. Daftar siswa dikelola admin.
            </p>
          </div>
          <Link
            href="/leader"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            ← Dashboard
          </Link>
        </div>

        <AbsensiPanel
          students={students}
          sessions={sessions}
          records={recordsData}
          canManageStudents
        />
      </Container>
    </PageShell>
  )
}