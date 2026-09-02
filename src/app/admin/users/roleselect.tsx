'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/types/database'

export function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string
  currentRole: string
}) {
  const router = useRouter()
  const [role, setRole] = useState(currentRole)
  const [loading, setLoading] = useState(false)

  // Leader tidak bisa diubah lewat admin UI
  if (currentRole === 'leader') {
    return (
      <span className="inline-flex items-center rounded-lg border border-sky-100 bg-sky-50 px-2.5 py-1.5 text-sm font-medium text-sky-700">
        leader
      </span>
    )
  }

  async function handleChange(next: string) {
    if (next === 'leader') return

    setLoading(true)
    setRole(next)

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ role: next as UserRole })
      .eq('id', userId)

    setLoading(false)

    if (error) {
      alert(error.message)
      setRole(currentRole)
      return
    }

    router.refresh()
  }

  return (
    <select
      value={role}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-sky-100 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
    >
      <option value="client">client</option>
      <option value="member">member</option>
      <option value="admin">admin</option>
    </select>
  )
}