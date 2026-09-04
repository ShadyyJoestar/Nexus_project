'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getRedirectPath } from '@/lib/auth'
import type { UserRole } from '@/types/database'
import { AuthShell, Input, PrimaryButton } from '@/components/ui'
import { useLocale } from '@/components/locale-provider'

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLocale()
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
      title={t('loginTitle')}
      subtitle={t('loginSubtitle')}
      footer={
        <>
          {t('noAccount')}{' '}
          <Link
            href="/register"
            className="font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            {t('register')}
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin}>
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
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? t('signingIn') : t('login')}
        </PrimaryButton>
      </form>
    </AuthShell>
  )
}