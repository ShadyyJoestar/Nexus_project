import StatistikView from '@/components/statistik-view'
import { loadStatistik } from '@/lib/statistik'

export default async function AdminStatistikPage() {
  const { stats, sessionCount, error } = await loadStatistik(['admin'])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
          Statistik siswa
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base dark:text-slate-400">
          Rekap kehadiran seluruh siswa ekskul.
        </p>
      </div>
      <StatistikView stats={stats} sessionCount={sessionCount} error={error} />
    </div>
  )
}