'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-start justify-center">
      <p className="text-sm font-semibold text-sky-600">Error</p>
      <h1 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
        Gagal memuat halaman admin
      </h1>
      <p className="mt-2 max-w-lg text-sm text-slate-500">
        Terjadi kesalahan. Coba lagi atau kembali ke dashboard.
      </p>
      {error.digest ? (
        <p className="mt-2 font-mono text-xs text-slate-400">
          Kode: {error.digest}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-600 hover:to-teal-500"
        >
          Coba lagi
        </button>
        <Link
          href="/admin"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Dashboard admin
        </Link>
      </div>
    </div>
  )
}