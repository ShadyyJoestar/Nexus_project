'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Project, ProjectStatus } from '@/types/database'
import { Card, Badge, PrimaryButton, Input } from '@/components/ui'

type Props = {
  profile: Profile
  projects: Project[]
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'published', label: 'Published' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
]

function statusTone(
  status: ProjectStatus
): 'sky' | 'teal' | 'emerald' | 'amber' | 'slate' {
  switch (status) {
    case 'completed':
      return 'emerald'
    case 'in_progress':
      return 'amber'
    case 'archived':
      return 'slate'
    default:
      return 'teal'
  }
}

function parseList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function emptyToNull(value: string): string | null {
  const t = value.trim()
  return t ? t : null
}

export default function MemberDashboard({
  profile,
  projects: initialProjects,
}: Props) {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  // Profile
  const [displayName, setDisplayName] = useState(profile.display_name ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '')
  const [githubUrl, setGithubUrl] = useState(profile.github_url ?? '')
  const [websiteUrl, setWebsiteUrl] = useState(profile.website_url ?? '')
  const [skillsText, setSkillsText] = useState(
    (profile.skills ?? []).join(', ')
  )
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [profileError, setProfileError] = useState('')

  // Project form
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [githubProject, setGithubProject] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [techText, setTechText] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('published')
  const [projectLoading, setProjectLoading] = useState(false)
  const [projectError, setProjectError] = useState('')
  const [projectMsg, setProjectMsg] = useState('')

  function resetProjectForm() {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setThumbnailUrl('')
    setProjectUrl('')
    setGithubProject('')
    setLiveUrl('')
    setTechText('')
    setStatus('published')
    setProjectError('')
    setProjectMsg('')
    setShowProjectForm(false)
  }

  function openAddProject() {
    resetProjectForm()
    setShowProjectForm(true)
  }

  function openEditProject(p: Project) {
    setEditingId(p.id)
    setTitle(p.title)
    setDescription(p.description ?? '')
    setThumbnailUrl(p.thumbnail_url ?? '')
    setProjectUrl(p.project_url ?? '')
    setGithubProject(p.github_url ?? '')
    setLiveUrl(p.live_url ?? '')
    setTechText((p.tech_stack ?? []).join(', '))
    setStatus(p.status ?? 'published')
    setProjectError('')
    setProjectMsg('')
    setShowProjectForm(true)
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg('')
    setProfileError('')

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim() || profile.username,
        bio: emptyToNull(bio),
        avatar_url: emptyToNull(avatarUrl),
        github_url: emptyToNull(githubUrl),
        website_url: emptyToNull(websiteUrl),
        skills: parseList(skillsText),
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    setProfileLoading(false)
    if (error) {
      setProfileError(error.message)
      return
    }
    setProfileMsg('Profil berhasil disimpan.')
    router.refresh()
  }

  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setProjectError('Judul project wajib diisi.')
      return
    }

    setProjectLoading(true)
    setProjectError('')
    setProjectMsg('')

    const supabase = createClient()
    const payload = {
      title: title.trim(),
      description: emptyToNull(description),
      thumbnail_url: emptyToNull(thumbnailUrl),
      project_url: emptyToNull(projectUrl),
      github_url: emptyToNull(githubProject),
      live_url: emptyToNull(liveUrl),
      tech_stack: parseList(techText),
      status,
      updated_at: new Date().toISOString(),
    }

    if (editingId) {
      const { data, error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', editingId)
        .eq('profile_id', profile.id)
        .select('*')
        .single()

      setProjectLoading(false)
      if (error) {
        setProjectError(error.message)
        return
      }
      setProjects((prev) =>
        prev.map((p) => (p.id === editingId ? (data as Project) : p))
      )
      setProjectMsg('Project berhasil diupdate.')
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...payload,
          profile_id: profile.id,
        })
        .select('*')
        .single()

      setProjectLoading(false)
      if (error) {
        setProjectError(error.message)
        return
      }
      setProjects((prev) => [data as Project, ...prev])
      setProjectMsg('Project berhasil ditambahkan.')
    }

    resetProjectForm()
    router.refresh()
  }

  async function handleDeleteProject(id: string, projectTitle: string) {
    const ok = window.confirm(
      `Hapus project "${projectTitle}"?\nTindakan ini tidak bisa dibatalkan.`
    )
    if (!ok) return

    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('profile_id', profile.id)

    if (error) {
      alert(error.message)
      return
    }

    setProjects((prev) => prev.filter((p) => p.id !== id))
    if (editingId === id) resetProjectForm()
    router.refresh()
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={displayName || profile.username}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-sky-100 sm:h-16 sm:w-16"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-400 text-lg font-bold text-white sm:h-16 sm:w-16 sm:text-xl">
              {(displayName || profile.username).charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {displayName || profile.username}
              </h1>
              <Badge tone="teal">Member</Badge>
            </div>
            <p className="mt-0.5 text-sky-600">@{profile.username}</p>
            <Link
              href={`/members/${profile.username}`}
              className="mt-2 inline-block text-sm font-medium text-slate-500 transition hover:text-sky-600"
            >
              Lihat profil publik →
            </Link>
          </div>
        </div>
      </div>

      {/* Edit profile */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900">Edit profil</h2>
        <p className="mt-1 text-sm text-slate-500">
          Informasi ini tampil di halaman publik kamu.
        </p>
        <Card className="mt-4">
          <form onSubmit={handleSaveProfile}>
            <Input
              label="Nama tampilan"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Revan"
            />
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Student & developer..."
                className="w-full rounded-xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />
            </div>
            <Input
              label="Avatar URL"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
            />
            <Input
              label="GitHub URL"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
            />
            <Input
              label="Website URL"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://yoursite.com"
            />
            <Input
              label="Skills (pisahkan dengan koma)"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="TypeScript, Next.js, Laravel"
            />
            {profileError ? (
              <p className="mb-3 text-sm text-red-500">{profileError}</p>
            ) : null}
            {profileMsg ? (
              <p className="mb-3 text-sm text-emerald-600">{profileMsg}</p>
            ) : null}
            <PrimaryButton
              type="submit"
              disabled={profileLoading}
              className="sm:w-auto"
            >
              {profileLoading ? 'Menyimpan...' : 'Simpan profil'}
            </PrimaryButton>
          </form>
        </Card>
      </section>

      {/* Projects */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Project kamu
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {projects.length} project
            </p>
          </div>
          <button
            type="button"
            onClick={openAddProject}
            className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-sky-600 hover:to-teal-500"
          >
            + Tambah project
          </button>
        </div>

        {showProjectForm ? (
          <Card className="mt-4">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              {editingId ? 'Edit project' : 'Project baru'}
            </h3>
            <form onSubmit={handleSaveProject}>
              <Input
                label="Judul *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nexus"
                required
              />
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Deskripsi
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Platform profile dan project showcase untuk CodeClass."
                  className="w-full rounded-xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>
              <Input
                label="Tech stack / bahasa / framework (pisahkan dengan koma)"
                value={techText}
                onChange={(e) => setTechText(e.target.value)}
                placeholder="Next.js, TypeScript, Supabase, Tailwind"
              />
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as ProjectStatus)
                  }
                  className="w-full rounded-xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Thumbnail URL (opsional)"
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
              />
              <Input
                label="Project URL (opsional)"
                type="url"
                value={projectUrl}
                onChange={(e) => setProjectUrl(e.target.value)}
                placeholder="https://..."
              />
              <Input
                label="GitHub URL (opsional)"
                type="url"
                value={githubProject}
                onChange={(e) => setGithubProject(e.target.value)}
                placeholder="https://github.com/user/repo"
              />
              <Input
                label="Live Demo URL (opsional)"
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
              />
              {projectError ? (
                <p className="mb-3 text-sm text-red-500">{projectError}</p>
              ) : null}
              {projectMsg ? (
                <p className="mb-3 text-sm text-emerald-600">{projectMsg}</p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <PrimaryButton
                  type="submit"
                  disabled={projectLoading}
                  className="sm:w-auto"
                >
                  {projectLoading
                    ? 'Menyimpan...'
                    : editingId
                      ? 'Update project'
                      : 'Simpan project'}
                </PrimaryButton>
                <button
                  type="button"
                  onClick={resetProjectForm}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </Card>
        ) : null}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {projects.length > 0 ? (
            projects.map((p) => {
              const tech = p.tech_stack ?? []
              return (
                <Card key={p.id} className="flex flex-col">
                  {p.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.thumbnail_url}
                      alt={p.title}
                      className="mb-3 h-36 w-full rounded-xl object-cover"
                    />
                  ) : null}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900">{p.title}</p>
                    <Badge tone={statusTone(p.status ?? 'published')}>
                      {(p.status ?? 'published').replace('_', ' ')}
                    </Badge>
                  </div>
                  {p.description ? (
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
                      {p.description}
                    </p>
                  ) : (
                    <div className="flex-1" />
                  )}
                  {tech.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {tech.map((t) => (
                        <Badge key={t} tone="teal">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {p.project_url ? (
                      <a
                        href={p.project_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-600 hover:underline"
                      >
                        Project
                      </a>
                    ) : null}
                    {p.github_url ? (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-sky-600 hover:underline"
                      >
                        GitHub
                      </a>
                    ) : null}
                    {p.live_url ? (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-teal-600 hover:underline"
                      >
                        Live Demo
                      </a>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/members/${profile.username}`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEditProject(p)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(p.id, p.title)}
                      className="rounded-lg border border-red-100 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="sm:col-span-2">
              <p className="text-sm text-slate-500">
                Belum ada project. Klik &quot;+ Tambah project&quot; untuk
                mulai membagikan karya kamu.
              </p>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}