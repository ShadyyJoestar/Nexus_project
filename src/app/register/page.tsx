'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthShell, Input, PrimaryButton } from '@/components/ui'
import { useLocale } from '@/components/locale-provider'

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLocale()
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '')
    const supabase = createClient()
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
    setMessage(
      t('locale' as never) // fallback message
    )
    setMessage('Akun dibuat. Cek email untuk konfirmasi, lalu login.')
  }

  return (
    <AuthShell
      title={t('registerTitle')}
      subtitle={t('registerSubtitle')}
      footer={
        <>
          {t('hasAccount')}{' '}
          <Link
            href="/login"
            className="font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            {t('login')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister}>
        <Input
          label={t('username')}
          type="text"
          required
          minLength={3}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="revan"
        />
        <Input
          label={t('displayName')}
          type="text"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Revan"
        />
        <Input
          label={t('email')}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
        />
        <Input
          label={t('password')}
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        {error ? <p className="mb-4 text-sm text-red-500">{error}</p> : null}
        {message ? (
          <p className="mb-4 text-sm text-emerald-600">{message}</p>
        ) : null}
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? t('registering') : t('register')}
        </PrimaryButton>
      </form>
    </AuthShell>
  )
}