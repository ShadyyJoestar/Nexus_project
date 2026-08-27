import { createClient } from '@/lib/supabase/server'
import { RoleSelect } from './roleselect'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('id, username, display_name, role, github_url, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Users</h1>
      <p className="mt-1 text-sm text-slate-500">
        Ubah role user di sini. Client → Member biar dia masuk halaman member
        saat login lagi.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-sky-100 bg-white shadow-sm">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-sky-50/80 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-sky-50 text-slate-700"
                >
                  <td className="px-4 py-3">@{user.username}</td>
                  <td className="px-4 py-3">{user.display_name}</td>
                  <td className="px-4 py-3">
                    <RoleSelect userId={user.id} currentRole={user.role} />
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
  )
}