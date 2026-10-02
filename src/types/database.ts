export type UserRole = 'client' | 'member' | 'admin' | 'leader'

export type ProjectStatus =
  | 'in_progress'
  | 'completed'
  | 'archived'
  | 'published'

export type Profile = {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  github_url: string | null
  website_url: string | null
  skills: string[]
  role: UserRole
  created_at: string
  updated_at: string
}

export type Project = {
  id: string
  profile_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  project_url: string | null
  github_url: string | null
  live_url: string | null
  tech_stack: string[]
  status: ProjectStatus
  created_at: string
  updated_at: string
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>
export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'role'>>
export type ProjectUpdate = Partial<
  Omit<Project, 'id' | 'profile_id' | 'created_at'>
>

// ===== Absensi =====
export type AbsensiStatus = 'hadir' | 'izin' | 'sakit' | 'alpha'

export type EkskulStudent = {
  id: string
  full_name: string
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type AbsensiSession = {
  id: string
  session_date: string // YYYY-MM-DD
  title: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type AbsensiRecord = {
  id: string
  session_id: string
  student_id: string
  status: AbsensiStatus
  note: string | null
  updated_by: string | null
  updated_at: string
}