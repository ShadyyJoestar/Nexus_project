import Link from 'next/link'

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/70 via-white to-teal-50/40 text-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      {children}
    </div>
  )
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-sky-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  )
}

export function Badge({
  children,
  tone = 'sky',
}: {
  children: React.ReactNode
  tone?: 'sky' | 'teal' | 'emerald' | 'amber' | 'slate'
}) {
  const tones: Record<string, string> = {
    sky: 'bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:ring-sky-900',
    teal: 'bg-teal-50 text-teal-700 ring-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:ring-teal-900',
    emerald:
      'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-900',
    amber:
      'bg-amber-50 text-amber-800 ring-amber-100 dark:bg-amber-950/60 dark:text-amber-300 dark:ring-amber-900',
    slate:
      'bg-slate-50 text-slate-600 ring-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function PrimaryButton({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`w-full rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-sky-600 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({
  label,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="mb-4">
      {label ? (
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      ) : null}
      <input
        className={`w-full rounded-xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:ring-sky-900/40 ${className}`}
        {...props}
      />
    </div>
  )
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <PageShell>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-teal-400 text-sm font-bold text-white">
            N
          </span>
          <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Nexus
          </span>
        </Link>
        <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer ? (
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {footer}
          </p>
        ) : null}
      </div>
    </PageShell>
  )
}

type AccentTone = 'sky' | 'teal' | 'emerald' | 'amber' | 'rose' | 'violet'

const ACCENTS: Record<AccentTone, { bar: string; text: string }> = {
  sky: { bar: 'bg-sky-500', text: 'text-sky-600 dark:text-sky-400' },
  teal: { bar: 'bg-teal-500', text: 'text-teal-600 dark:text-teal-400' },
  emerald: { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  amber: { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  rose: { bar: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
  violet: { bar: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400' },
}

export function StatCard({
  label,
  value,
  hint,
  tone = 'sky',
}: {
  label: string
  value: React.ReactNode
  hint?: string
  tone?: AccentTone
}) {
  const accent = ACCENTS[tone]
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 pt-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-1 ${accent.bar}`}
      />
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${accent.text}`}>
        {value}
      </p>
      {hint ? (
        <p className="mt-1 truncate text-xs text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Tabs({
  items,
}: {
  items: { href: string; label: string; active: boolean }[]
}) {
  return (
    <nav
      aria-label="Bagian halaman"
      className="inline-flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? 'page' : undefined}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
            item.active
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

const AVATAR_COLORS = [
  'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
]

export function Avatar({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const initials = (parts[0]?.[0] ?? '?') + (parts[1]?.[0] ?? '')
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % AVATAR_COLORS.length
  return (
    <span
      aria-hidden="true"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold uppercase ${AVATAR_COLORS[hash]}`}
    >
      {initials}
    </span>
  )
}