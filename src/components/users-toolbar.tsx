'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useLocale } from '@/components/locale-provider'

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
  const { t } = useLocale()
  const [q, setQ] = useState(initialQ)
  const [role, setRole] = useState(initialRole)
  const [pending, startTransition] = useTransition()

  function apply(nextQ: string, nextRole: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (nextQ.trim()) params.set('q', nextQ.trim())
    else params.delete('q')
    if (nextRole) params.set('role', nextRole)
    else params.delete('role')
    params.delete('page')
    startTransition(() => router.push(`${pathname}?${params.toString()}`))
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        apply(q, role)
      }}
      className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t('searchUsers')}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 sm:max-w-xs"
      />
      <select
        value={role}
        onChange={(e) => {
          setRole(e.target.value)
          apply(q, e.target.value)
        }}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      >
        <option value="">{t('allRoles')}</option>
        <option value="client">Client</option>
        <option value="member">Member</option>
        <option value="admin">Admin</option>
        <option value="leader">Leader</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? t('loading') : t('members')}
      </button>
    </form>
  )
}