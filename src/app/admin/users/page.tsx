import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui'
import { RoleSelect } from './roleselect'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select(
      'id, username, display_name, role, github_url, website_url, skills, created_at'
    )
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Users & roles
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
          Ubah role saja di sini. Create / delete akun tetap lewat database
          Supabase. Client → Member agar bisa kelola project di dashboard
          member.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Skills</th>
              <th className="px-4 py-3 font-medium">Links</th>
              <th className="px-4 py-3 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => {
                const skills = user.skills ?? []
                return (
                  <tr
                    key={user.id}
                    className="border-t border-slate-100 text-slate-700"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {user.display_name}
                      </p>
                      <p className="text-xs text-sky-600">@{user.username}</p>
                    </td>
                    <td className="px-4 py-3">
                      <RoleSelect userId={user.id} currentRole={user.role} />
                    </td>
                    <td className="px-4 py-3">
                      {skills.length > 0 ? (
                        <div className="flex max-w-[200px] flex-wrap gap-1">
                          {skills.slice(0, 3).map((s: string) => (
                            <Badge key={s} tone="slate">
                              {s}
                            </Badge>
                          ))}
                          {skills.length > 3 ? (
                            <Badge tone="slate">+{skills.length - 3}</Badge>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-xs">
                        {user.role === 'member' ? (
                          <Link
                            href={`/members/${user.username}`}
                            target="_blank"
                            className="font-medium text-sky-600 hover:underline"
                          >
                            Profil ↗
                          </Link>
                        ) : null}
                        {user.github_url ? (
                          <a
                            href={user.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:underline"
                          >
                            GitHub ↗
                          </a>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-slate-400"
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