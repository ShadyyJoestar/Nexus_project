'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthShell, Input, PrimaryButton } from '@/components/ui'

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

    if (cleanUsername.length < 3) {
      setLoading(false)
      setError('Username minimal 3 karakter (huruf/angka/underscore)')
      return
    }

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

    if (data.user && data.session) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: cleanUsername,
          display_name: displayName || cleanUsername,
        })
        .eq('id', data.user.id)

      if (updateError) {
        const { error: insertError } = await supabase.from('profiles').insert({
          id: data.user.id,
          username: cleanUsername,
          display_name: displayName || cleanUsername,
          role: 'client',
          skills: [],
        })
        if (insertError) {
          setLoading(false)
          setError(insertError.message)
          return
        }
      }

      setLoading(false)
      router.push('/client')
      router.refresh()
      return
    }

    setLoading(false)
    setMessage('Akun dibuat. Cek email untuk konfirmasi, lalu login.')
  }

  return (
    <AuthShell
      title="Daftar"
      subtitle="Buat akun CodeClass"
      footer={
        <>
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-sky-600 hover:underline">
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister}>
        <Input
          label="Username"
          type="text"
          required
          minLength={3}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="revan"
        />
        <Input
          label="Nama tampilan"
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Revan"
        />
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
        {message && <p className="mb-4 text-sm text-emerald-600">{message}</p>}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? 'Mendaftar...' : 'Daftar'}
        </PrimaryButton>
      </form>
    </AuthShell>
  )
}