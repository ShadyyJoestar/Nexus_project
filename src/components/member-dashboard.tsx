'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Project } from '@/types/database'
import { Card, Badge, PrimaryButton, Input } from '@/components/ui'

type Props = {
  profile: Profile
  projects: Project[]
}

function parseList(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function MemberDashboard({ profile, projects: initialProjects }: Props) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)

  // Profile form
  const [displayName, setDisplayName] = useState(profile.display_name ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [githubUrl, setGithubUrl] = useState(profile.github_url ?? '')
  const [skillsText, setSkillsText] = useState((profile.skills ?? []).join(', '))
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [profileError, setProfileError] = useState('')

  // Project form (add / edit)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [githubProject, setGithubProject] = useState('')
  const [liveUrl, setLiveUrl] = useState('')
  const [techText, setTechText] = useState('')
  const [projectLoading, setProjectLoading] = useState(false)
  const [projectError, setProjectError] = useState('')

  function resetProjectForm() {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setGithubProject('')
    setLiveUrl('')
    setTechText('')
    setProjectError('')
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
    setGithubProject(p.github_url ?? '')
    setLiveUrl(p.live_url ?? '')
    setTechText((p.tech_stack ?? []).join(', '))
    setProjectError('')
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
        bio: bio.trim() || null,
        github_url: githubUrl.trim() || null,
        skills: parseList(skillsText),
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    setProfileLoading(false)
    if (error) {
      setProfileError(error.message)
      return
    }
    setProfileMsg('Profil disimpan.')
    router.refresh()
  }

  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setProjectError('Judul wajib diisi')
      return
    }

    setProjectLoading(true)
    setProjectError('')
    const supabase = createClient()

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      github_url: githubProject.trim() || null,
      live_url: liveUrl.trim() || null,
      tech_stack: parseList(techText),
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
    }

    resetProjectForm()
    router.refresh()
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('Hapus project ini?')) return

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
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {displayName || profile.username}
            </h1>
            <Badge tone="teal">Member</Badge>
          </div>
          <p className="mt-1 text-sky-600">@{profile.username}</p>
          <Link
            href={`/members/${profile.username}`}
            className="mt-2 inline-block text-sm font-medium text-slate-500 hover:text-sky-600"
          >
            Lihat profil publik →
          </Link>
        </div>
      </div>

      {/* Edit profile */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900">Edit profil</h2>
        <p className="mt-1 text-sm text-slate-500">
          Info ini tampil di halaman publik kamu.
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
              label="GitHub URL"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
            />
            <Input
              label="Skills (pisahkan dengan koma)"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="TypeScript, Next.js, Laravel"
            />
            {profileError && (
              <p className="mb-3 text-sm text-red-500">{profileError}</p>
            )}
            {profileMsg && (
              <p className="mb-3 text-sm text-emerald-600">{profileMsg}</p>
            )}
            <PrimaryButton type="submit" disabled={profileLoading} className="sm:w-auto">
              {profileLoading ? 'Menyimpan...' : 'Simpan profil'}
            </PrimaryButton>
          </form>
        </Card>
      </section>

      {/* Projects */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Project kamu</h2>
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

        {/* Add / Edit form */}
        {showProjectForm && (
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
                label="Tech / bahasa / framework (pisahkan dengan koma)"
                value={techText}
                onChange={(e) => setTechText(e.target.value)}
                placeholder="Next.js, TypeScript, Supabase"
              />
              <Input
                label="GitHub URL"
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
              {projectError && (
                <p className="mb-3 text-sm text-red-500">{projectError}</p>
              )}
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
        )}

        {/* List */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {projects.length > 0 ? (
            projects.map((p) => {
              const tech = p.tech_stack ?? []
              return (
                <Card key={p.id} className="flex flex-col">
                  <p className="font-semibold text-slate-900">{p.title}</p>
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
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
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
                    <button
                      type="button"
                      onClick={() => openEditProject(p)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-sky-50 hover:text-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(p.id)}
                      className="rounded-lg border border-red-100 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="sm:col-span-2">
              <p className="text-sm text-slate-500">
                Belum ada project. Klik &quot;+ Tambah project&quot; untuk mulai.
              </p>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}