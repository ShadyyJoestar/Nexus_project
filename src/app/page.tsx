import Link from 'next/link'
import Navbar from '@/components/navbar'
import Container from '@/components/container'



export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute -right-12 top-32 h-48 w-48 rounded-full bg-teal-200/40 blur-3xl sm:h-64 sm:w-64" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />

        <Container className="relative pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pt-20">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-sky-600 sm:mb-4 sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            CodeClass Community Platform
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Discover work built by
            <span className="mt-1 block bg-gradient-to-r from-sky-500 to-teal-400 bg-clip-text text-transparent sm:mt-0">
              CodeClass developers
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            Nexus is the official home for CodeClass members to showcase their
            projects, share their profiles, and grow as developers — and for
            visitors to explore what the community is building.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link
              href="/projects"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-600 hover:to-teal-500"
            >
              Explore projects
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-sky-200 bg-white px-6 py-3.5 text-center text-sm font-semibold text-sky-700 transition hover:border-sky-300 hover:bg-sky-50"
            >
              Join CodeClass
            </Link>
          </div>

          <div className="mt-10 flex flex-col gap-3 text-sm text-slate-500 sm:mt-14 sm:flex-row sm:flex-wrap sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700 sm:text-sm">
                Browse
              </span>
              <span className="text-xs sm:text-sm">
                View member projects & profiles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-teal-100 px-2 py-1 text-xs font-semibold text-teal-700 sm:text-sm">
                Showcase
              </span>
              <span className="text-xs sm:text-sm">
                Publish your own work
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 sm:text-sm">
                Connect
              </span>
              <span className="text-xs sm:text-sm">
                Be part of the community
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Two paths */}
      <section className="border-t border-sky-50 bg-gradient-to-b from-sky-50/80 to-white">
        <Container className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
              Two ways to engage
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:mt-3 sm:text-base">
              Whether you are exploring or building, Nexus is designed for both
              visitors and CodeClass members.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/50 sm:p-8">
              <div className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-sky-400 to-sky-500" />
              <h3 className="text-lg font-semibold text-slate-900">
                Explore the work
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Browse projects built by CodeClass members — from learning
                experiments to production-ready apps. See the stack, the repo,
                and the live demo.
              </p>
              <Link
                href="/projects"
                className="mt-5 inline-block text-sm font-semibold text-sky-600 hover:underline"
              >
                View projects →
              </Link>
            </div>

            <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm shadow-teal-100/50 sm:p-8">
              <div className="mb-4 h-1 w-12 rounded-full bg-gradient-to-r from-teal-400 to-teal-500" />
              <h3 className="text-lg font-semibold text-slate-900">
                Join as a member
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Create your developer profile, list your skills, and publish
                the projects you have built. Grow with the CodeClass community.
              </p>
              <Link
                href="/register"
                className="mt-5 inline-block text-sm font-semibold text-teal-600 hover:underline"
              >
                Create an account →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t border-sky-50">
        <Container className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
              Built for a developer community
            </h2>
            <p className="mt-2 text-sm text-slate-600 sm:mt-3 sm:text-base">
              Nexus is more than a directory — it is a shared space for
              CodeClass to present real work.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            <FeatureCard
              title="Member profiles"
              desc="Each member has a public profile with skills, bio, and links — so the community can learn who is behind the work."
              accent="sky"
            />
            <FeatureCard
              title="Project showcase"
              desc="Publish projects with description, tech stack, GitHub repository, and live demo in one clean card."
              accent="teal"
            />
            <FeatureCard
              title="Community visibility"
              desc="Visitors can explore what CodeClass is building. Members can stay accountable and inspired by each other."
              accent="emerald"
            />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-sky-50 bg-gradient-to-b from-white to-sky-50/50">
        <Container className="py-12 sm:py-16 lg:py-20">
          <div className="rounded-2xl bg-gradient-to-r from-sky-500 via-sky-400 to-teal-400 px-6 py-10 text-center text-white shadow-lg shadow-sky-200/50 sm:rounded-3xl sm:px-12 sm:py-12">
            <h2 className="text-xl font-bold sm:text-2xl lg:text-3xl">
              Ready to join CodeClass on Nexus?
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-sky-50 sm:mt-3 sm:text-base">
              Create your account, set up your profile, and start showcasing
              the projects you build with the community.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:mt-8 sm:flex-row">
              <Link
                href="/register"
                className="inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-sky-600 transition hover:bg-sky-50"
              >
                Join CodeClass
              </Link>
              <Link
                href="/projects"
                className="inline-block rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Browse projects
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <footer className="border-t border-sky-100 py-6 text-center text-xs text-slate-400 sm:py-8 sm:text-sm">
        Nexus · Official community platform for CodeClass
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
    <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/50 sm:p-6">
      <div
        className={`mb-3 h-1 w-10 rounded-full bg-gradient-to-r ${bar} sm:mb-4 sm:w-12`}
      />
      <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  )
}