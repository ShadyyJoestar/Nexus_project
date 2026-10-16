import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types/database'

export type StudentStat = {
  student_id: string
  full_name: string
  is_active: boolean
  total_sessions: number
  hadir: number
  izin: number
  sakit: number
  alpha: number
}

/** Cek role di server, lalu ambil statistik. Redirect kalau tidak berhak. */
export async function loadStatistik(allowed: UserRole[]) {
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

  if (!profile || !allowed.includes(profile.role as UserRole)) redirect('/')

  const [statsRes, sessionsRes] = await Promise.all([
    supabase
      .from('student_attendance_stats')
      .select('*')
      .order('full_name', { ascending: true }),
    supabase
      .from('absensi_sessions')
      .select('id', { count: 'exact', head: true }),
  ])

  return {
    stats: (statsRes.data ?? []) as StudentStat[],
    sessionCount: sessionsRes.count ?? 0,
    error: statsRes.error?.message ?? null,
  }
}