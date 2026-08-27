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
        <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute -right-12 top-32 h-48 w-48 rounded-full bg-teal-200/40 blur-3xl sm:h-64 sm:w-64" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-emerald-100/50 blur-3xl" />

        <Container className="relative pb-16 pt-12 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-medium text-sky-600 sm:text-base">
              Welcome to CodeClass
            </p>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Learn. Build. Share.
              <span className="mt-2 block bg-gradient-to-r from-sky-500 to-teal-400 bg-clip-text text-transparent sm:mt-3">
                Welcome to our community.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              CodeClass is a community for people who learn and build with
              technology. Nexus is where our members share their profiles,
              projects, and the things they have built along the way.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row">
              <Link
                href="/projects"
                className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-600 hover:to-teal-500"
              >
                Explore CodeClass
              </Link>

              <Link
                href="/register"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              >
                Join the community
              </Link>
            </div>
          </div>

          <div className="mt-12 grid max-w-3xl gap-4 border-t border-slate-100 pt-7 sm:mt-16 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Meet members
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Get to know the people behind CodeClass.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Explore projects
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                See what members are learning and building.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Share your work
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                Give your projects a place to be seen.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Welcome */}
      <section className="border-t border-slate-100 bg-slate-50/60">
        <Container className="py-14 sm:py-18 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-600">
              Inside CodeClass
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              There is more to CodeClass than just learning.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              We learn by doing. We build things, try new ideas, make mistakes,
              and keep improving. Nexus gives those things a place to live.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sm font-bold text-sky-600">
                ✦
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                Meet the people
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Explore profiles from CodeClass members and see what they are
                interested in, what they work with, and what they have built.
              </p>

              <Link
                href="/members"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 transition hover:gap-2"
              >
                Meet the members
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-sm font-bold text-teal-600">
                ↗
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                See what they build
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                From small experiments to complete applications, browse the
                projects members have chosen to share with the community.
              </p>

              <Link
                href="/projects"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 transition hover:gap-2"
              >
                Explore projects
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
            <p className="text-sm font-semibold text-sky-600">
              Your place in CodeClass
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Build your own space here.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Your profile is more than a username. It is a place to introduce
              yourself and keep track of the work you are proud of.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              number="01"
              title="Your profile"
              desc="Introduce yourself, list the technologies you use, and let other members know what you are interested in."
            />

            <FeatureCard
              number="02"
              title="Your projects"
              desc="Showcase the things you have built and connect them to their GitHub repositories or live demos."
            />

            <FeatureCard
              number="03"
              title="Your community"
              desc="Discover other members, explore their work, and see what everyone else is learning and building."
            />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100">
        <Container className="py-14 sm:py-18 lg:py-20">
          <div className="overflow-hidden rounded-3xl bg-slate-900 px-6 py-11 text-white sm:px-12 sm:py-14 lg:px-16">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-sky-300">
                Welcome to CodeClass
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Ready to be part of it?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                Create your profile, share what you build, and see what the
                rest of CodeClass is working on.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Join CodeClass
                </Link>

                <Link
                  href="/projects"
                  className="rounded-xl border border-slate-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Explore Nexus
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
