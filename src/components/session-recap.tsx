'use client'

import { useMemo, useRef, useState } from 'react'
import type {
  AbsensiRecord,
  AbsensiSession,
  AbsensiStatus,
  EkskulStudent,
} from '@/types/database'
import { Badge, Card } from '@/components/ui'
import { formatSessionDate, percent } from '@/lib/absensi'

type Props = {
  session: AbsensiSession | null
  /** hanya siswa aktif */
  students: EkskulStudent[]
  recordsByStudent: Map<string, AbsensiRecord>
  busy: boolean
  onMarkAll: (status: AbsensiStatus) => void
}

const ABSENT_LABELS: { status: AbsensiStatus; label: string }[] = [
  { status: 'izin', label: 'Izin' },
  { status: 'sakit', label: 'Sakit' },
  { status: 'alpha', label: 'Alpha' },
]

export default function SessionRecap({
  session,
  students,
  recordsByStudent,
  busy,
  onMarkAll,
}: Props) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  const recap = useMemo(() => {
    const names: Record<AbsensiStatus, string[]> = {
      hadir: [],
      izin: [],
      sakit: [],
      alpha: [],
    }
    let unmarked = 0
    for (const s of students) {
      const rec = recordsByStudent.get(s.id)
      if (!rec) unmarked++
      names[rec?.status ?? 'alpha'].push(s.full_name)
    }
    return { names, unmarked, total: students.length }
  }, [students, recordsByStudent])

  if (!session) {
    return (
      <Card>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Ringkasan
        </h2>
        <p className="mt-3 text-sm text-slate-400">Pilih / buat sesi dulu.</p>
      </Card>
    )
  }

  const hadirCount = recap.names.hadir.length
  const pct = percent(hadirCount, recap.total)

  function buildText(): string {
    if (!session) return ''
    const lines = [
      `Rekap absensi - ${formatSessionDate(session.session_date)}`,
      ...(session.title ? [session.title] : []),
      `Hadir ${hadirCount}/${recap.total} (${pct}%)`,
    ]
    for (const { status, label } of ABSENT_LABELS) {
      const list = recap.names[status]
      if (list.length > 0) lines.push(`${label} (${list.length}): ${list.join(', ')}`)
    }
    return lines.join('\n')
  }

  async function copyRecap() {
    try {
      await navigator.clipboard.writeText(buildText())
      setCopied(true)
      if (timer.current) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('Gagal menyalin. Salin manual dari daftar di bawah.')
    }
  }

  return (
    <Card>
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
        Ringkasan
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {formatSessionDate(session.session_date)}
        {session.title ? ` · ${session.title}` : ''}
      </p>

      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {pct}%
          <span className="ml-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            hadir ({hadirCount}/{recap.total})
          </span>
        </p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone="emerald">Hadir {hadirCount}</Badge>
        <Badge tone="sky">Izin {recap.names.izin.length}</Badge>
        <Badge tone="amber">Sakit {recap.names.sakit.length}</Badge>
        <Badge tone="slate">Alpha {recap.names.alpha.length}</Badge>
      </div>

      {recap.unmarked > 0 ? (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          {recap.unmarked} siswa belum diisi (sementara dihitung alpha).
        </p>
      ) : null}

      {ABSENT_LABELS.some(({ status }) => recap.names[status].length > 0) ? (
        <dl className="mt-4 space-y-2 text-sm">
          {ABSENT_LABELS.map(({ status, label }) =>
            recap.names[status].length > 0 ? (
              <div key={status}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {label}
                </dt>
                <dd className="text-slate-700 dark:text-slate-300">
                  {recap.names[status].join(', ')}
                </dd>
              </div>
            ) : null
          )}
        </dl>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyRecap}
          className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300"
        >
          {copied ? 'Tersalin ✓' : 'Salin rekap'}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onMarkAll('hadir')}
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 disabled:opacity-50"
        >
          Semua hadir
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onMarkAll('alpha')}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          Semua alpha
        </button>
      </div>
    </Card>
  )
}