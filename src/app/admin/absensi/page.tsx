import { createClient } from '@/lib/supabase/server'
import type {
  AbsensiRecord,
  AbsensiSession,
  EkskulStudent,
} from '@/types/database'
import AbsensiPanel from '@/components/absensi-panel'

export default async function AdminAbsensiPage() {
  const supabase = await createClient()

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
          Absensi
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base dark:text-slate-400">
          Absensi siswa ekskul. Daftar siswa dikelola di sini, terpisah dari
          user Nexus.
        </p>
      </div>

      <AbsensiPanel
        students={students}
        sessions={sessions}
        records={recordsData}
        canManageStudents
      />
    </div>
  )
}