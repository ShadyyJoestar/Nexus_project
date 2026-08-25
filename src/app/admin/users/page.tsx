import { createClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('id, username, display_name, role, github_url, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      <p className="mt-1 text-zinc-400">
        Semua member & client. Ubah role lewat database dulu (sementara).
      </p>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Username</th>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">GitHub</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
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
                    {user.github_url ? (
                      <a
                        href={user.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:underline"
                      >
                        Link
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(user.created_at).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
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
  )
}