export type UserRole = 'client' | 'member' | 'admin'

export type Profile = {
  id: string
  username: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  github_url: string | null
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
  github_url: string | null
  live_url: string | null
  tech_stack: string[]
  created_at: string
  updated_at: string
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'>
export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>
export type ProjectUpdate = Partial<Omit<Project, 'id' | 'profile_id' | 'created_at'>>