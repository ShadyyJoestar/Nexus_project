import { createClient } from '@/lib/supabase/server'
import { Card, Badge } from '@/components/ui'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

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
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ringkasan Nexus / CodeClass
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Total Members</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {profileCount ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Total Projects</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {projectCount ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Role kamu</p>
          <p className="mt-2 text-3xl font-bold text-sky-600">admin</p>
        </Card>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">User terbaru</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-sky-100 bg-white shadow-sm">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-sky-50/80 text-slate-500">
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
                    className="border-t border-sky-50 text-slate-700"
                  >
                    <td className="px-4 py-3">@{user.username}</td>
                    <td className="px-4 py-3">{user.display_name}</td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={
                          user.role === 'admin'
                            ? 'sky'
                            : user.role === 'client'
                              ? 'amber'
                              : 'teal'
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-slate-400"
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