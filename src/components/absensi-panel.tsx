'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type {
  AbsensiRecord,
  AbsensiSession,
  AbsensiStatus,
  EkskulStudent,
} from '@/types/database'
import { Card, Badge, PrimaryButton, Input } from '@/components/ui'

const STATUS_OPTIONS: {
  value: AbsensiStatus
  label: string
  tone: 'emerald' | 'sky' | 'amber' | 'slate'
}[] = [
  { value: 'hadir', label: 'Hadir', tone: 'emerald' },
  { value: 'izin', label: 'Izin', tone: 'sky' },
  { value: 'sakit', label: 'Sakit', tone: 'amber' },
  { value: 'alpha', label: 'Alpha', tone: 'slate' },
]

type Props = {
  students: EkskulStudent[]
  sessions: AbsensiSession[]
  /** records untuk semua session yang diload */
  records: AbsensiRecord[]
  /** true = bisa CRUD siswa; false = cuma isi absensi */
  canManageStudents?: boolean
}

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function AbsensiPanel({
  students: initialStudents,
  sessions: initialSessions,
  records: initialRecords,
  canManageStudents = true,
}: Props) {
  const router = useRouter()
  const [students, setStudents] = useState(initialStudents)
  const [sessions, setSessions] = useState(initialSessions)
  const [records, setRecords] = useState(initialRecords)

  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    initialSessions[0]?.id ?? null
  )
  const [newDate, setNewDate] = useState(todayISO())
  const [newTitle, setNewTitle] = useState('')
  const [sessionLoading, setSessionLoading] = useState(false)
  const [sessionError, setSessionError] = useState('')

  const [newStudentName, setNewStudentName] = useState('')
  const [studentLoading, setStudentLoading] = useState(false)
  const [studentError, setStudentError] = useState('')
  const [studentMsg, setStudentMsg] = useState('')

  const [savingId, setSavingId] = useState<string | null>(null)
  const [markAllLoading, setMarkAllLoading] = useState(false)

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null

  const activeRecordsByStudent = useMemo(() => {
    const map = new Map<string, AbsensiRecord>()
    if (!activeSessionId) return map
    for (const r of records) {
      if (r.session_id === activeSessionId) map.set(r.student_id, r)
    }
    return map
  }, [records, activeSessionId])

  const summary = useMemo(() => {
    const counts: Record<AbsensiStatus, number> = {
      hadir: 0,
      izin: 0,
      sakit: 0,
      alpha: 0,
    }
    const active = students.filter((s) => s.is_active)
    for (const s of active) {
      const r = activeRecordsByStudent.get(s.id)
      const st = r?.status ?? 'alpha'
      counts[st]++
    }
    return { total: active.length, ...counts }
  }, [students, activeRecordsByStudent])

  async function createSession(e: React.FormEvent) {
    e.preventDefault()
    if (!newDate) return
    setSessionLoading(true)
    setSessionError('')
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('absensi_sessions')
      .insert({
        session_date: newDate,
        title: newTitle.trim() || null,
        created_by: user?.id ?? null,
      })
      .select('*')
      .single()

    setSessionLoading(false)
    if (error) {
      setSessionError(
        error.code === '23505'
          ? 'Sudah ada sesi untuk tanggal itu.'
          : error.message
      )
      return
    }

    const session = data as AbsensiSession
    setSessions((prev) =>
      [session, ...prev].sort((a, b) =>
        b.session_date.localeCompare(a.session_date)
      )
    )
    setActiveSessionId(session.id)
    setNewTitle('')
    router.refresh()
  }

  async function deleteSession(id: string) {
    const ok = window.confirm('Hapus sesi absensi ini beserta semua catatannya?')
    if (!ok) return
    const supabase = createClient()
    const { error } = await supabase.from('absensi_sessions').delete().eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    setSessions((prev) => prev.filter((s) => s.id !== id))
    setRecords((prev) => prev.filter((r) => r.session_id !== id))
    if (activeSessionId === id) {
      setActiveSessionId(null)
    }
    router.refresh()
  }

  async function addStudent(e: React.FormEvent) {
    e.preventDefault()
    const name = newStudentName.trim()
    if (!name) return
    setStudentLoading(true)
    setStudentError('')
    setStudentMsg('')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('ekskul_students')
      .insert({ full_name: name })
      .select('*')
      .single()
    setStudentLoading(false)
    if (error) {
      setStudentError(error.message)
      return
    }
    const student = data as EkskulStudent
    setStudents((prev) =>
      [...prev, student].sort((a, b) =>
        a.full_name.localeCompare(b.full_name, 'id')
      )
    )
    setNewStudentName('')
    setStudentMsg('Siswa ditambahkan.')
    router.refresh()
  }

  async function toggleStudentActive(id: string, isActive: boolean) {
    const supabase = createClient()
    const { error } = await supabase
      .from('ekskul_students')
      .update({ is_active: !isActive, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !isActive } : s))
    )
    router.refresh()
  }

  async function deleteStudent(id: string, name: string) {
    const ok = window.confirm(
      `Hapus siswa "${name}"?\nSemua catatan absensinya ikut terhapus.`
    )
    if (!ok) return
    const supabase = createClient()
    const { error } = await supabase.from('ekskul_students').delete().eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    setStudents((prev) => prev.filter((s) => s.id !== id))
    setRecords((prev) => prev.filter((r) => r.student_id !== id))
    router.refresh()
  }

  async function setStatus(studentId: string, status: AbsensiStatus) {
    if (!activeSessionId) return
    setSavingId(studentId)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const existing = activeRecordsByStudent.get(studentId)
    if (existing) {
      const { data, error } = await supabase
        .from('absensi_records')
        .update({
          status,
          updated_by: user?.id ?? null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select('*')
        .single()
      setSavingId(null)
      if (error) {
        alert(error.message)
        return
      }
      const row = data as AbsensiRecord
      setRecords((prev) => prev.map((r) => (r.id === row.id ? row : r)))
    } else {
      const { data, error } = await supabase
        .from('absensi_records')
        .insert({
          session_id: activeSessionId,
          student_id: studentId,
          status,
          updated_by: user?.id ?? null,
        })
        .select('*')
        .single()
      setSavingId(null)
      if (error) {
        alert(error.message)
        return
      }
      setRecords((prev) => [...prev, data as AbsensiRecord])
    }
  }

  async function markAll(status: AbsensiStatus) {
    if (!activeSessionId) return
    const ok = window.confirm(
      `Tandai SEMUA siswa aktif sebagai "${status}" untuk sesi ini?`
    )
    if (!ok) return
    setMarkAllLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const active = students.filter((s) => s.is_active)

    for (const s of active) {
      const existing = activeRecordsByStudent.get(s.id)
      if (existing) {
        const { data, error } = await supabase
          .from('absensi_records')
          .update({
            status,
            updated_by: user?.id ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select('*')
          .single()
        if (!error && data) {
          const row = data as AbsensiRecord
          setRecords((prev) => prev.map((r) => (r.id === row.id ? row : r)))
        }
      } else {
        const { data, error } = await supabase
          .from('absensi_records')
          .insert({
            session_id: activeSessionId,
            student_id: s.id,
            status,
            updated_by: user?.id ?? null,
          })
          .select('*')
          .single()
        if (!error && data) {
          setRecords((prev) => [...prev, data as AbsensiRecord])
        }
      }
    }
    setMarkAllLoading(false)
    router.refresh()
  }

  const activeStudents = students.filter((s) => s.is_active)
  const inactiveStudents = students.filter((s) => !s.is_active)

  return (
    <div className="space-y-8">
      {/* Summary + session picker */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Sesi absensi
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Pilih tanggal sesi, lalu isi status per siswa.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {sessions.length === 0 ? (
              <p className="text-sm text-slate-400">Belum ada sesi. Buat dulu di bawah.</p>
            ) : (
              sessions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSessionId(s.id)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    activeSessionId === s.id
                      ? 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-700 dark:bg-sky-950/50 dark:text-sky-300'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                  }`}
                >
                  {new Date(s.session_date + 'T00:00:00').toLocaleDateString('id-ID', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {s.title ? (
                    <span className="ml-1 text-xs opacity-70">· {s.title}</span>
                  ) : null}
                </button>
              ))
            )}
          </div>

          {activeSession ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>Sesi aktif</span>
              <button
                type="button"
                onClick={() => deleteSession(activeSession.id)}
                className="rounded-lg border border-red-100 px-2 py-1 text-red-600 hover:bg-red-50"
              >
                Hapus sesi
              </button>
            </div>
          ) : null}

          <form onSubmit={createSession} className="mt-5 flex flex-wrap items-end gap-3">
            <div className="min-w-[140px]">
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Tanggal baru
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                required
              />
            </div>
            <div className="min-w-[160px] flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Judul (opsional)
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Latihan rutin"
                className="w-full rounded-xl border border-sky-100 bg-white px-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <PrimaryButton
              type="submit"
              disabled={sessionLoading}
              className="sm:w-auto"
            >
              {sessionLoading ? 'Membuat...' : '+ Buat sesi'}
            </PrimaryButton>
          </form>
          {sessionError ? (
            <p className="mt-2 text-sm text-red-500">{sessionError}</p>
          ) : null}
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Ringkasan
          </h2>
          {!activeSession ? (
            <p className="mt-3 text-sm text-slate-400">Pilih / buat sesi dulu.</p>
          ) : (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {summary.total} siswa aktif
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge tone="emerald">Hadir {summary.hadir}</Badge>
                <Badge tone="sky">Izin {summary.izin}</Badge>
                <Badge tone="amber">Sakit {summary.sakit}</Badge>
                <Badge tone="slate">Alpha {summary.alpha}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={markAllLoading || !activeSessionId}
                  onClick={() => markAll('hadir')}
                  className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 disabled:opacity-50"
                >
                  Semua hadir
                </button>
                <button
                  type="button"
                  disabled={markAllLoading || !activeSessionId}
                  onClick={() => markAll('alpha')}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  Semua alpha
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Attendance grid */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Daftar absensi
            </h2>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Nama diurutkan A–Z. Klik status untuk mengubah.
            </p>
          </div>
        </div>

        {!activeSessionId ? (
          <Card className="mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Buat atau pilih sesi absensi terlebih dahulu.
            </p>
          </Card>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium w-10">#</th>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {activeStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      Belum ada siswa aktif.
                    </td>
                  </tr>
                ) : (
                  activeStudents.map((s, i) => {
                    const rec = activeRecordsByStudent.get(s.id)
                    const current: AbsensiStatus = rec?.status ?? 'alpha'
                    const busy = savingId === s.id
                    return (
                      <tr
                        key={s.id}
                        className="border-t border-slate-100 dark:border-slate-800"
                      >
                        <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                          {s.full_name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {STATUS_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                disabled={busy}
                                onClick={() => setStatus(s.id, opt.value)}
                                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition disabled:opacity-50 ${
                                  current === opt.value
                                    ? opt.value === 'hadir'
                                      ? 'bg-emerald-500 text-white'
                                      : opt.value === 'izin'
                                        ? 'bg-sky-500 text-white'
                                        : opt.value === 'sakit'
                                          ? 'bg-amber-500 text-white'
                                          : 'bg-slate-500 text-white'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Manage students */}
      {canManageStudents ? (
        <section>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Kelola siswa
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            Tambah / nonaktifkan / hapus. Nama otomatis diurutkan A–Z.
          </p>

          <Card className="mt-4">
            <form onSubmit={addStudent} className="flex flex-wrap items-end gap-3">
              <div className="min-w-[200px] flex-1">
                <Input
                  label="Nama lengkap siswa"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Contoh: Muhammad Akbar"
                />
              </div>
              <PrimaryButton
                type="submit"
                disabled={studentLoading}
                className="sm:w-auto mb-4"
              >
                {studentLoading ? 'Menyimpan...' : '+ Tambah siswa'}
              </PrimaryButton>
            </form>
            {studentError ? (
              <p className="text-sm text-red-500">{studentError}</p>
            ) : null}
            {studentMsg ? (
              <p className="text-sm text-emerald-600">{studentMsg}</p>
            ) : null}
          </Card>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium w-10">#</th>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      Belum ada siswa.
                    </td>
                  </tr>
                ) : (
                  students.map((s, i) => (
                    <tr
                      key={s.id}
                      className="border-t border-slate-100 dark:border-slate-800"
                    >
                      <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        {s.full_name}
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={s.is_active ? 'teal' : 'slate'}>
                          {s.is_active ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => toggleStudentActive(s.id, s.is_active)}
                            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                          >
                            {s.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteStudent(s.id, s.full_name)}
                            className="rounded-lg border border-red-100 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {inactiveStudents.length > 0 ? (
            <p className="mt-2 text-xs text-slate-400">
              {inactiveStudents.length} siswa nonaktif (tidak muncul di form absensi).
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}