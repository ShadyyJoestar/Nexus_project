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