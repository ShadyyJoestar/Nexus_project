import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui'
import { RoleSelect } from './roleselect'
import UsersToolbar from '@/components/users-toolbar'
import Pagination from '@/components/pagination'
import { Suspense } from 'react'

const PAGE_SIZE = 25

type Props = {
  searchParams: Promise<{ q?: string; role?: string; page?: string }>
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const params = await searchParams
  const q = (params.q ?? '').trim()
  const role = (params.role ?? '').trim()
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select(
      'id, username, display_name, role, github_url, website_url, skills, created_at',
      { count: 'exact' }
    )

  if (role && ['client', 'member', 'admin', 'leader'].includes(role)) {
    query = query.eq('role', role)
  }

  if (q) {
    // Cari di username ATAU display_name
    query = query.or(
      `username.ilike.%${q}%,display_name.ilike.%${q}%`
    )
  }

  const { data: users, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
        Gagal memuat users: {error.message}
      </div>
    )
  }

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Users & roles
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
          Cari dan filter user. Create / delete akun tetap lewat Supabase.
          Ditampilkan {PAGE_SIZE} per halaman.
        </p>
      </div>

      <Suspense fallback={null}>
        <UsersToolbar initialQ={q} initialRole={role} />
      </Suspense>

      <p className="text-sm text-slate-500">
        {total} user ditemukan
        {q ? ` untuk “${q}”` : ''}
        {role ? ` · role ${role}` : ''}
      </p>

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
                        {user.role === 'member' || user.role === 'leader' ? (
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
                  Tidak ada user yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/users"
        q={q || undefined}
        role={role || undefined}
      />
    </div>
  )
}