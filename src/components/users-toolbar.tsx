'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

const ROLES = [
  { value: '', label: 'Semua role' },
  { value: 'client', label: 'Client' },
  { value: 'member', label: 'Member' },
  { value: 'admin', label: 'Admin' },
  { value: 'leader', label: 'Leader' },
]

export default function UsersToolbar({
  initialQ = '',
  initialRole = '',
}: {
  initialQ?: string
  initialRole?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [q, setQ] = useState(initialQ)
  const [role, setRole] = useState(initialRole)
  const [pending, startTransition] = useTransition()

  function apply(nextQ: string, nextRole: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (nextQ.trim()) params.set('q', nextQ.trim())
    else params.delete('q')
    if (nextRole) params.set('role', nextRole)
    else params.delete('role')
    params.delete('page') // reset ke halaman 1
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    apply(q, role)
  }

  function onRoleChange(value: string) {
    setRole(value)
    apply(q, value)
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari username atau nama..."
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:max-w-xs"
      />
      <select
        value={role}
        onChange={(e) => onRoleChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
      >
        {ROLES.map((r) => (
          <option key={r.value || 'all'} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-600 hover:to-teal-500 disabled:opacity-60"
      >
        {pending ? 'Mencari...' : 'Cari'}
      </button>
    </form>
  )
}