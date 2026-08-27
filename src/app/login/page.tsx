'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getRedirectPath } from '@/lib/auth'
import type { UserRole } from '@/types/database'
import { AuthShell, Input, PrimaryButton } from '@/components/ui'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setLoading(false)
      setError(signInError.message)
      return
    }

    const userId = data.user?.id
    if (!userId) {
      setLoading(false)
      setError('User tidak ditemukan')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    setLoading(false)
    router.push(getRedirectPath(profile?.role as UserRole))
    router.refresh()
  }

  return (
    <AuthShell
      title="Login"
      subtitle="Masuk ke CodeClass"
      footer={
        <>
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-sky-600 hover:underline">
            Daftar
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin}>
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
        />
        <Input
          label="Password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 6 karakter"
        />
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </PrimaryButton>
      </form>
    </AuthShell>
  )
}