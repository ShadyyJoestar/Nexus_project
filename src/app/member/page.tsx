import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function MemberPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')
  if (profile.role === 'admin') redirect('/admin')
  if (profile.role === 'client') redirect('/client')

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('profile_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-semibold">
          Nexus
        </Link>
        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">
          Member
        </span>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pb-16">
        <h1 className="text-3xl font-bold">
          Halo, {profile.display_name}
        </h1>
        <p className="mt-1 text-zinc-400">@{profile.username}</p>
        {profile.bio && (
          <p className="mt-4 max-w-xl text-zinc-300">{profile.bio}</p>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Project kamu</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {projects && projects.length > 0 ? (
              projects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
                >
                  <p className="font-semibold">{p.title}</p>
                  {p.description && (
                    <p className="mt-2 text-sm text-zinc-400">{p.description}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-zinc-500">
                Belum ada project. (Nanti bisa ditambah dari dashboard member)
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}