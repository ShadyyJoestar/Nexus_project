import Link from 'next/link'
import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { Analytics } from '@vercel/analytics/next'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />
      <Analytics />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-8 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute -right-12 top-32 h-48 w-48 rounded-full bg-teal-200/40 blur-3xl sm:h-64 sm:w-64" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />

        <Container className="relative pb-16 pt-10 sm:pb-24 sm:pt-16 lg:pt-24">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-sky-600 sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
            CodeClass
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            See what{' '}
            <span className="bg-gradient-to-r from-sky-500 to-teal-400 bg-clip-text text-transparent">
              CodeClass
            </span>{' '}
            is building.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8">
            Nexus is where CodeClass members share who they are, what they
            build, and where to find their work. Explore projects, discover
            developers, and put your own work on display.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row">
            <Link
              href="/projects"
              className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-600 hover:to-teal-500"
            >
              Explore projects
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
            >
              Create your profile
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-100 pt-6 text-sm text-slate-500 sm:mt-14 sm:pt-7">
            <span>
              <strong className="font-semibold text-slate-700">Profiles</strong>{' '}
              from CodeClass members
            </span>
            <span>
              <strong className="font-semibold text-slate-700">Projects</strong>{' '}
              with GitHub & live demos
            </span>
            <span>
              <strong className="font-semibold text-slate-700">One place</strong>{' '}
              to find the community
            </span>
          </div>
        </Container>
      </section>

      {/* Explore / Build */}
      <section className="border-t border-slate-100 bg-slate-50/60">
        <Container className="py-14 sm:py-18 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-600">Nexus</p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              A place for the work behind CodeClass.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Some people come here to see what others are making. Others come
              to share their own work. Nexus gives both sides a place to start.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2">
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md sm:p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sm font-bold text-sky-600">
                01
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Explore what members build
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Browse projects from CodeClass members and see the technologies,
                repositories, and live demos behind them.
              </p>

              <Link
                href="/projects"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 transition group-hover:gap-2"
              >
                Browse projects
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-md sm:p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-sm font-bold text-teal-600">
                02
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Put your work out there
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Create your CodeClass profile, add your skills, and keep the
                projects you are proud of in one place.
              </p>

              <Link
                href="/register"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 transition group-hover:gap-2"
              >
                Create your profile
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t border-slate-100">
        <Container className="py-14 sm:py-18 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-600">What you can do</p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Your profile. Your projects. Your work.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Nexus keeps the important parts of your developer profile
              together, without turning it into another complicated dashboard.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              number="01"
              title="Build your profile"
              desc="Tell people who you are, what you work with, and where they can find you."
            />

            <FeatureCard
              number="02"
              title="Show your projects"
              desc="Add the projects you have built with descriptions, tech stacks, GitHub repositories, and live demos."
            />

            <FeatureCard
              number="03"
              title="Discover other members"
              desc="Find developers from CodeClass, explore their work, and see what the community is working on."
            />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100">
        <Container className="py-14 sm:py-18 lg:py-20">
          <div className="overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-12 sm:py-12 lg:px-16">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-sky-300">
                For CodeClass members
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Got something you built?
                <br />
                Put it on Nexus.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                Set up your profile, add your projects, and give your work a
                place people can actually find.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Create your profile
                </Link>

                <Link
                  href="/projects"
                  className="rounded-xl border border-slate-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Explore projects
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400 sm:py-8 sm:text-sm">
        Nexus · CodeClass
      </footer>
    </div>
  )
}

function FeatureCard({
  number,
  title,
  desc,
}: {
  number: string
  title: string
  desc: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-7">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-xs font-bold text-slate-500">
        {number}
      </div>

      <h3 className="mt-5 text-base font-semibold text-slate-900 sm:text-lg">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
    </div>
  )
}

