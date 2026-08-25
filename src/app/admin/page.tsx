import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Hitung jumlah user & project (query sederhana)
  const { count: profileCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('id, username, display_name, role, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-zinc-400">Ringkasan Nexus / CodeClass</p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">Total Members</p>
          <p className="mt-2 text-3xl font-bold">{profileCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">Total Projects</p>
          <p className="mt-2 text-3xl font-bold">{projectCount ?? 0}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-500">Role kamu</p>
          <p className="mt-2 text-3xl font-bold text-indigo-400">admin</p>
        </div>
      </div>

      {/* User terbaru */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold">User terbaru</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-500">
              <tr>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers && recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-zinc-800 text-zinc-300"
                  >
                    <td className="px-4 py-3">@{user.username}</td>
                    <td className="px-4 py-3">{user.display_name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-indigo-500/20 text-indigo-300'
                            : user.role === 'client'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-zinc-700 text-zinc-300'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-zinc-500"
                  >
                    Belum ada user
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}