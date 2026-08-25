'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setMessage('Cek email kamu! Kita udah kirim link login.')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Nexus
          </Link>
          <p className="mt-2 text-sm text-zinc-400">
            Login pake email buat masuk ke CodeClass
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

          {error && (
            <p className="mb-4 text-sm text-red-400">{error}</p>
          )}
          {message && (
            <p className="mb-4 text-sm text-emerald-400">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Link Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Setelah login, akun kamu bakal ditinjau admin dulu
          sebelum bisa akses penuh.
        </p>
      </div>
    </main>
  )
}