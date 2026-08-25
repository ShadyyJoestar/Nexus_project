'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const supabase = createClient()
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '')

    // Cukup signUp — profile dibuat otomatis oleh trigger
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: cleanUsername,
          display_name: displayName || cleanUsername,
        },
      },
    })

    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    // Kalau session langsung ada (email confirm dimatiin), update username/display_name
    if (data.user && data.session) {
      await supabase
        .from('profiles')
        .update({
          username: cleanUsername,
          display_name: displayName || cleanUsername,
        })
        .eq('id', data.user.id)

      setLoading(false)
      router.push('/client')
      router.refresh()
      return
    }

    // Kalau email confirmation masih nyala
    setLoading(false)
    setMessage(
      'Akun berhasil dibuat. Cek email untuk konfirmasi, lalu login.'
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            Nexus
          </Link>
          <p className="mt-2 text-sm text-zinc-400">Daftar akun CodeClass</p>
        </div>

        <form
          onSubmit={handleRegister}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8"
        >
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Username
          </label>
          <input
            type="text"
            required
            minLength={3}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="revan"
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Nama tampilan
          </label>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Revan"
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
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
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
          {message && <p className="mb-4 text-sm text-emerald-400">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-500 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:opacity-50"
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}