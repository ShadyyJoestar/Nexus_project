import { Avatar, Badge, Card, StatCard, Tabs } from '@/components/ui'
import PenilaianPanel from '@/components/penilaian-panel'
import { percent } from '@/lib/absensi'
import { LEVEL_CLASSES, LOW_LEVEL, levelTone } from '@/lib/level'
import type { StatistikTab, StudentStat } from '@/lib/statistik'
import type { PenilaianItem, PenilaianScore } from '@/types/database'

type Props = {
  tab: StatistikTab
  stats: StudentStat[]
  sessionCount: number
  error: string | null
  penilaian: { items: PenilaianItem[]; scores: PenilaianScore[] } | null
  penilaianError: string | null
}

const STATUS_SEGMENTS = [
  { key: 'hadir', label: 'Hadir', bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  { key: 'izin', label: 'Izin', bar: 'bg-sky-500', dot: 'bg-sky-500' },
  { key: 'sakit', label: 'Sakit', bar: 'bg-amber-500', dot: 'bg-amber-500' },
  { key: 'alpha', label: 'Alpha', bar: 'bg-slate-400', dot: 'bg-slate-400' },
] as const

function ErrorCard({ message }: { message: string }) {
  return (
    <Card>
      <p className="text-sm text-red-500">{message}</p>
    </Card>
  )
}

function Kehadiran({
  stats,
  sessionCount,
}: {
  stats: StudentStat[]
  sessionCount: number
}) {
  const active = stats.filter((s) => s.is_active)
  const rows = active
    .map((s) => ({ ...s, pct: percent(s.hadir, s.total_sessions) }))
    .sort((a, b) => a.pct - b.pct || a.full_name.localeCompare(b.full_name, 'id'))

  const withSessions = rows.filter((r) => r.total_sessions > 0)
  const avg =
    withSessions.length === 0
      ? 0
      : Math.round(
          withSessions.reduce((sum, r) => sum + r.pct, 0) / withSessions.length
        )
  const lowCount = withSessions.filter((r) => r.pct < LOW_LEVEL).length
  const inactiveCount = stats.length - active.length

  const totals = STATUS_SEGMENTS.map((seg) => ({
    ...seg,
    count: active.reduce((sum, s) => sum + s[seg.key], 0),
  }))
  const totalMarks = totals.reduce((sum, t) => sum + t.count, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Siswa aktif" value={active.length} tone="sky" />
        <StatCard label="Total sesi" value={sessionCount} tone="violet" />
        <StatCard
          label="Rata-rata kehadiran"
          value={`${avg}%`}
          tone={avg >= LOW_LEVEL ? 'emerald' : 'amber'}
        />
        <StatCard
          label={`Di bawah ${LOW_LEVEL}%`}
          value={lowCount}
          tone={lowCount > 0 ? 'rose' : 'emerald'}
          hint={lowCount > 0 ? 'Perlu ditindaklanjuti' : 'Semua aman'}
        />
      </div>

      {totalMarks > 0 ? (
        <Card>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Komposisi kehadiran
          </h2>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            {totals.map((t) =>
              t.count > 0 ? (
                <div
                  key={t.key}
                  className={t.bar}
                  style={{ width: `${(t.count / totalMarks) * 100}%` }}
                  title={`${t.label}: ${t.count}`}
                />
              ) : null
            )}
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
            {totals.map((t) => (
              <li key={t.key} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${t.dot}`} aria-hidden="true" />
                {t.label}{' '}
                <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-200">
                  {t.count}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Kehadiran per siswa
        </h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Diurutkan dari kehadiran terendah. Siswa yang belum diisi dihitung
          alpha.
        </p>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Siswa</th>
                <th className="px-3 py-3 text-center font-medium">H</th>
                <th className="px-3 py-3 text-center font-medium">I</th>
                <th className="px-3 py-3 text-center font-medium">S</th>
                <th className="px-3 py-3 text-center font-medium">A</th>
                <th className="px-4 py-3 font-medium">Kehadiran</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Belum ada siswa aktif.
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const low = r.total_sessions > 0 && r.pct < LOW_LEVEL
                  return (
                    <tr
                      key={r.student_id}
                      className="border-t border-slate-100 transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40"
                    >
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={r.full_name} />
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {r.full_name}
                          </span>
                          {low ? <Badge tone="amber">Perlu perhatian</Badge> : null}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-center font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
                        {r.hadir}
                      </td>
                      <td className="px-3 py-2.5 text-center tabular-nums text-sky-600 dark:text-sky-400">
                        {r.izin}
                      </td>
                      <td className="px-3 py-2.5 text-center tabular-nums text-amber-600 dark:text-amber-400">
                        {r.sakit}
                      </td>
                      <td className="px-3 py-2.5 text-center tabular-nums text-slate-500 dark:text-slate-400">
                        {r.alpha}
                      </td>
                      <td className="px-4 py-2.5">
                        {r.total_sessions === 0 ? (
                          <span className="text-slate-400">-</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className={`h-full rounded-full ${LEVEL_CLASSES[levelTone(r.pct)].bar}`}
                                style={{ width: `${r.pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium tabular-nums text-slate-600 dark:text-slate-300">
                              {r.pct}% ({r.hadir}/{r.total_sessions})
                            </span>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {inactiveCount > 0 ? (
          <p className="mt-2 text-xs text-slate-400">
            {inactiveCount} siswa nonaktif tidak ditampilkan.
          </p>
        ) : null}
      </section>
    </div>
  )
}

export default function StatistikView({
  tab,
  stats,
  sessionCount,
  error,
  penilaian,
  penilaianError,
}: Props) {
  const students = stats
    .filter((s) => s.is_active)
    .map((s) => ({ id: s.student_id, name: s.full_name }))

  let body: React.ReactNode
  if (error) {
    body = (
      <ErrorCard message="Gagal memuat statistik kehadiran. Pastikan SQL view sudah dijalankan." />
    )
  } else if (tab === 'penilaian') {
    body =
      penilaianError || !penilaian ? (
        <ErrorCard message="Gagal memuat penilaian. Pastikan supabase/penilaian.sql sudah dijalankan." />
      ) : (
        <PenilaianPanel
          students={students}
          items={penilaian.items}
          scores={penilaian.scores}
        />
      )
  } else {
    body = <Kehadiran stats={stats} sessionCount={sessionCount} />
  }

  return (
    <div className="space-y-6">
      <Tabs
        items={[
          { href: '?tab=kehadiran', label: 'Kehadiran', active: tab === 'kehadiran' },
          { href: '?tab=penilaian', label: 'Penilaian', active: tab === 'penilaian' },
        ]}
      />
      {body}
    </div>
  )
}