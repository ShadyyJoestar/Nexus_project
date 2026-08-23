export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
            Project Management
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Nexus
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
            A simple workspace for managing projects, tasks, and ideas.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-lg bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200">
              Get Started
            </button>

            <button className="rounded-lg border border-zinc-800 px-5 py-3 font-medium text-zinc-300 transition hover:bg-zinc-900">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}