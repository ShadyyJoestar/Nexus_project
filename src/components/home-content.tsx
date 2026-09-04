'use client'

import Link from 'next/link'
import Container from '@/components/container'
import { useLocale } from '@/components/locale-provider'

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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-7">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        {number}
      </div>
      <h3 className="mt-5 text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
        {desc}
      </p>
    </div>
  )
}

export default function HomeContent() {
  const { t } = useLocale()

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-900/30 sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute -right-12 top-32 h-48 w-48 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-900/25 sm:h-64 sm:w-64" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-emerald-100/50 blur-3xl dark:bg-emerald-900/20" />

        <Container className="relative pb-16 pt-12 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-medium text-sky-600 dark:text-sky-400 sm:text-base">
              {t('welcomeEyebrow')}
            </p>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              {t('heroTitle')}
              <span className="mt-2 block bg-gradient-to-r from-sky-500 to-teal-400 bg-clip-text text-transparent sm:mt-3">
                {t('heroHighlight')}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg sm:leading-8">
              {t('heroDesc')}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row">
              <Link
                href="/projects"
                className="rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-sky-200 transition hover:from-sky-600 hover:to-teal-500 dark:shadow-none"
              >
                {t('explore')}
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-sky-700 dark:hover:bg-slate-800"
              >
                {t('joinCommunity')}
              </Link>
            </div>
          </div>

          <div className="mt-12 grid max-w-3xl gap-4 border-t border-slate-100 pt-7 dark:border-slate-800 sm:mt-16 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('featureMembers')}
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                {t('featureMembersDesc')}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('featureProjects')}
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                {t('featureProjectsDesc')}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t('featureShare')}
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                {t('featureShareDesc')}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Welcome / Inside */}
      <section className="border-t border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40">
        <Container className="py-14 sm:py-18 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">
              {t('insideCodeClass')}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {t('insideTitle')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              {t('insideDesc')}
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sm font-bold text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                ✦
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t('meetPeople')}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t('meetPeopleDesc')}
              </p>
              <Link
                href="/members"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 transition hover:gap-2 dark:text-sky-400"
              >
                {t('meetMembersCta')}
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-sm font-bold text-teal-600 dark:bg-teal-950 dark:text-teal-400">
                ↗
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                {t('seeWhatTheyBuild')}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t('seeWhatTheyBuildDesc')}
              </p>
              <Link
                href="/projects"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 transition hover:gap-2 dark:text-teal-400"
              >
                {t('exploreProjectsCta')}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t border-slate-100 dark:border-slate-800">
        <Container className="py-14 sm:py-18 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-sky-600 dark:text-sky-400">
              {t('yourPlace')}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {t('buildSpaceTitle')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              {t('buildSpaceDesc')}
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              number="01"
              title={t('featProfile')}
              desc={t('featProfileDesc')}
            />
            <FeatureCard
              number="02"
              title={t('featProjects')}
              desc={t('featProjectsDesc')}
            />
            <FeatureCard
              number="03"
              title={t('featCommunity')}
              desc={t('featCommunityDesc')}
            />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-100 dark:border-slate-800">
        <Container className="py-14 sm:py-18 lg:py-20">
          <div className="overflow-hidden rounded-3xl bg-slate-900 px-6 py-11 text-white dark:bg-slate-950 dark:ring-1 dark:ring-slate-800 sm:px-12 sm:py-14 lg:px-16">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-sky-300">
                {t('ctaEyebrow')}
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {t('ctaTitle')}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                {t('ctaDesc')}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  {t('joinCodeClass')}
                </Link>
                <Link
                  href="/projects"
                  className="rounded-xl border border-slate-700 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {t('exploreNexus')}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <footer className="border-t border-slate-100 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:py-8 sm:text-sm">
        Nexus · CodeClass
      </footer>
    </>
  )
}