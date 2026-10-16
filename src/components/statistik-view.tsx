import { Badge, Card } from '@/components/ui'
import { percent } from '@/lib/absensi'
import type { StudentStat } from '@/lib/statistik'

const LOW_ATTENDANCE = 75

export default function StatistikView({
  stats,
  sessionCount,
  error,
}: {
  stats: StudentStat[]
  sessionCount: number
  error: string | null
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
  const lowCount = withSessions.filter((r) => r.pct < LOW_ATTENDANCE).length
  const inactiveCount = stats.length - active.length

  if (error) {
    return (
      <Card>
        <p className="text-sm text-red-500">
          Gagal memuat statistik: {error}. Pastikan SQL view sudah dijalankan.
        </p>
      </Card>
    )
  }

  const cards = [
    { label: 'Siswa aktif', value: String(active.length) },
    { label: 'Total sesi', value: String(sessionCount) },
    { label: 'Rata-rata kehadiran', value: `${avg}%` },
    { label: `Di bawah ${LOW_ATTENDANCE}%`, value: String(lowCount) },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {c.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {c.value}
            </p>
          </Card>
        ))}
      </div>

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
                <th className="w-10 px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Nama</th>
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
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Belum ada siswa aktif.
                  </td>
                </tr>
              ) : (
                rows.map((r, i) => {
                  const low = r.total_sessions > 0 && r.pct < LOW_ATTENDANCE
                  return (
                    <tr
                      key={r.student_id}
                      className="border-t border-slate-100 dark:border-slate-800"
                    >
                      <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                        {r.full_name}
                        {low ? (
                          <span className="ml-2 align-middle">
                            <Badge tone="amber">Perlu perhatian</Badge>
                          </span>
                        ) : null}
                      </td>
                      <td className="px-3 py-3 text-center">{r.hadir}</td>
                      <td className="px-3 py-3 text-center">{r.izin}</td>
                      <td className="px-3 py-3 text-center">{r.sakit}</td>
                      <td className="px-3 py-3 text-center">{r.alpha}</td>
                      <td className="px-4 py-3">
                        {r.total_sessions === 0 ? (
                          <span className="text-slate-400">-</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                              <div
                                className={`h-full rounded-full ${low ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                style={{ width: `${r.pct}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
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