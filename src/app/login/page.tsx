'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getRedirectPath } from '@/lib/auth'
import type { UserRole } from '@/types/database'

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

    // Ambil role dari profiles
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
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Nexus
          </Link>
          <p className="mt-2 text-sm text-zinc-400">
            Login ke CodeClass
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
        >
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
          />

          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
          />

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Belum punya akun?{' '}
          <Link href="/register" className="text-indigo-400 hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </main>
  )
}