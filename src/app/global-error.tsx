'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="id">
      <body className="min-h-screen bg-white text-slate-800 antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-400 text-lg font-bold text-white">
            N
          </div>
          <p className="mt-6 text-sm font-semibold text-sky-600">Critical error</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Aplikasi mengalami error
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            Terjadi kesalahan yang tidak terduga. Silakan coba muat ulang
            halaman.
          </p>
          {error.digest ? (
            <p className="mt-2 font-mono text-xs text-slate-400">
              Kode: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-600 hover:to-teal-500"
          >
            Coba lagi
          </button>
        </div>
      </body>
    </html>
  )
}