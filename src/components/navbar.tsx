import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Container from '@/components/container'
import MobileNav from '@/components/mobilenav'
import PrefsToggles from '@/components/prefs-toggles'
import NavbarLabels from '@/components/navbar-labels'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role: string | null = null
  let displayName: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, display_name, username')
      .eq('id', user.id)
      .single()

    role = profile?.role ?? null
    displayName = profile?.display_name || profile?.username || null
  }

  const dashboardHref =
    role === 'leader'
      ? '/leader'
      : role === 'admin'
        ? '/admin'
        : role === 'member'
          ? '/member'
          : role === 'client'
            ? '/client'
            : '/login'

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <Container className="flex h-14 items-center justify-between sm:h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-teal-400 text-sm font-bold text-white">
            N
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100 sm:text-lg">
            Nexus
          </span>
          <span className="hidden text-xs font-medium text-sky-500 sm:inline">
            CodeClass
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavbarLabels
            user={!!user}
            displayName={displayName}
            dashboardHref={dashboardHref}
          />
          <div className="ml-2">
            <PrefsToggles />
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <PrefsToggles />
          <MobileNav
            user={!!user}
            displayName={displayName}
            dashboardHref={dashboardHref}
          />
        </div>
      </Container>
    </header>
  )
}