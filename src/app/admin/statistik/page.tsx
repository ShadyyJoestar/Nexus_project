import StatistikView from '@/components/statistik-view'
import { loadStatistik } from '@/lib/statistik'

export default async function AdminStatistikPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const data = await loadStatistik(['admin'], (await searchParams).tab)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
          Statistik siswa
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base dark:text-slate-400">
          Kehadiran dan penilaian seluruh siswa ekskul.
        </p>
      </div>
      <StatistikView {...data} />
    </div>
  )
}