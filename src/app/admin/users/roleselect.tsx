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

  async function handleChange(next: string) {
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
      className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-white outline-none focus:border-indigo-500"
    >
      <option value="client">client</option>
      <option value="member">member</option>
      <option value="admin">admin</option>
    </select>
  )
}