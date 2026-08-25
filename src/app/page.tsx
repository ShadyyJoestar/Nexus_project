import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar sederhana */}
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold tracking-tight">Nexus</span>
        <Link
          href="/login"
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
        >
          Login
        </Link>
      </nav>

      {/* Hero */}
      <div className="mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-center px-6">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-indigo-400">
            CodeClass Community
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Showcase your
            <span className="block text-indigo-400">coding journey</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-zinc-400">
            Platform buat member CodeClass punya profil developer sendiri
            dan nampilin project yang udah dibuat.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-400"
            >
              Get Started
            </Link>

            <Link
              href="/members"
              className="rounded-lg border border-zinc-700 px-6 py-3 font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
            >
              Lihat Members
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}