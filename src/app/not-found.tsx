import Link from 'next/link'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell } from '@/components/ui'

export default function NotFound() {
  return (
    <PageShell>
      <Navbar />
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-semibold text-sky-600">404</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          URL yang kamu buka tidak ada atau sudah dipindahkan.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-600 hover:to-teal-500"
          >
            Ke beranda
          </Link>
          <Link
            href="/members"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Lihat members
          </Link>
        </div>
      </Container>
    </PageShell>
  )
}