import Link from 'next/link'
import Navbar from '@/components/navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* soft blobs */}
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-sky-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-40 h-64 w-64 rounded-full bg-teal-200/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-start px-6 pb-24 pt-16 sm:pt-24">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-600">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            CodeClass Community Platform
          </p>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Tempat member CodeClass
            <span className="block bg-gradient-to-r from-sky-500 to-teal-400 bg-clip-text text-transparent">
              nunjukin karya coding-nya
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Punya profil developer sendiri, kumpulin project, kasih link GitHub
            & demo — biar komunitas bisa saling lihat progress dan inspirasi.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-600 hover:to-teal-500"
            >
              Mulai gratis
            </Link>
            <Link
              href="/members"
              className="rounded-xl border border-sky-200 bg-white px-6 py-3.5 text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-50"
            >
              Lihat members
            </Link>
          </div>

          {/* mini stats */}
          <div className="mt-14 flex flex-wrap gap-6 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-sky-100 px-2 py-1 font-semibold text-sky-700">
                Profile
              </span>
              <span>Username, bio, skills</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-teal-100 px-2 py-1 font-semibold text-teal-700">
                Projects
              </span>
              <span>Showcase + GitHub</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">
                Community
              </span>
              <span>CodeClass members</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-sky-50 bg-gradient-to-b from-sky-50/80 to-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Bukan cuma landing page komunitas
            </h2>
            <p className="mt-3 text-slate-600">
              Nexus dibuat biar setiap member punya ruang sendiri buat
              nunjukin perjalanan coding-nya.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Developer profile"
              desc="Username, avatar, bio, skills, dan link GitHub dalam satu halaman."
              accent="sky"
            />
            <FeatureCard
              title="Project showcase"
              desc="Simpan project, stack, repo, dan live demo biar gampang dipamerin."
              accent="teal"
            />
            <FeatureCard
              title="Community first"
              desc="Lihat member lain, saling explore karya, tumbuh bareng CodeClass."
              accent="emerald"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-sky-50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl bg-gradient-to-r from-sky-500 via-sky-400 to-teal-400 px-8 py-12 text-center text-white shadow-lg shadow-sky-200/50 sm:px-12">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Siap nunjukin project kamu?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sky-50">
              Daftar sekarang, lengkapi profil, terus publish karya pertama kamu
              di Nexus.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
            >
              Buat akun Nexus
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-sky-100 py-8 text-center text-sm text-slate-400">
        Nexus · CodeClass Community
      </footer>
    </div>
  )
}

function FeatureCard({
  title,
  desc,
  accent,
}: {
  title: string
  desc: string
  accent: 'sky' | 'teal' | 'emerald'
}) {
  const bar =
    accent === 'sky'
      ? 'from-sky-400 to-sky-500'
      : accent === 'teal'
        ? 'from-teal-400 to-teal-500'
        : 'from-emerald-400 to-emerald-500'

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/50">
      <div className={`mb-4 h-1 w-12 rounded-full bg-gradient-to-r ${bar}`} />
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  )
}