import Link from 'next/link'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import StatistikView from '@/components/statistik-view'
import { PageShell, Badge } from '@/components/ui'
import { loadStatistik } from '@/lib/statistik'

export default async function LeaderStatistikPage() {
  const { stats, sessionCount, error } = await loadStatistik(['leader'])

  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="sky">Leader</Badge>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                Statistik siswa
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Rekap kehadiran seluruh siswa ekskul.
            </p>
          </div>
          <Link
            href="/leader"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            ← Dashboard
          </Link>
        </div>
        <StatistikView stats={stats} sessionCount={sessionCount} error={error} />
      </Container>
    </PageShell>
  )
}