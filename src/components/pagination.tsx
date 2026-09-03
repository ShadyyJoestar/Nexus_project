import Link from 'next/link'

export default function Pagination({
  page,
  totalPages,
  basePath,
  q,
  role,
}: {
  page: number
  totalPages: number
  basePath: string
  q?: string
  role?: string
}) {
  if (totalPages <= 1) return null

  function href(p: number) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (role) params.set('role', role)
    if (p > 1) params.set('page', String(p))
    const s = params.toString()
    return s ? `${basePath}?${s}` : basePath
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-slate-500">
        Halaman {page} dari {totalPages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            href={href(page - 1)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Prev
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-100 px-3 py-1.5 text-slate-300">
            ← Prev
          </span>
        )}
        {page < totalPages ? (
          <Link
            href={href(page + 1)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Next →
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-100 px-3 py-1.5 text-slate-300">
            Next →
          </span>
        )}
      </div>
    </div>
  )
}