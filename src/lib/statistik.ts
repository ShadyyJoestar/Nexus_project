import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { PenilaianItem, PenilaianScore, UserRole } from '@/types/database'

export type StatistikTab = 'kehadiran' | 'penilaian'

const PAGE_SIZE = 1000

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

export function parseTab(value: string | string[] | undefined): StatistikTab {
  return (Array.isArray(value) ? value[0] : value) === 'penilaian'
    ? 'penilaian'
    : 'kehadiran'
}

/** Cek role di server, lalu ambil statistik. Redirect kalau tidak berhak. */
export async function loadStatistik(
  allowed: UserRole[],
  rawTab?: string | string[]
) {
  const tab = parseTab(rawTab)
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

  let penilaian: { items: PenilaianItem[]; scores: PenilaianScore[] } | null = null
  let penilaianError: string | null = null
  if (tab === 'penilaian') {
    const itemsRes = await supabase
      .from('penilaian_items')
      .select('id, title, max_score, created_at')
      .order('created_at', { ascending: true })

    // PostgREST membatasi 1000 baris per request, jadi nilai diambil per halaman.
    const scores: PenilaianScore[] = []
    let scoresError: string | null = null
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, error } = await supabase
        .from('penilaian_scores')
        .select('item_id, student_id, score')
        .order('id', { ascending: true })
        .range(from, from + PAGE_SIZE - 1)
      if (error) {
        scoresError = error.message
        break
      }
      scores.push(...((data ?? []) as PenilaianScore[]))
      if ((data?.length ?? 0) < PAGE_SIZE) break
    }

    penilaianError = itemsRes.error?.message ?? scoresError
    penilaian = {
      items: ((itemsRes.data ?? []) as PenilaianItem[]).map((i) => ({
        ...i,
        max_score: Number(i.max_score),
      })),
      scores,
    }
  }

  return {
    tab,
    penilaian,
    penilaianError,
    stats: (statsRes.data ?? []) as StudentStat[],
    sessionCount: sessionsRes.count ?? 0,
    error: statsRes.error?.message ?? null,
  }
}