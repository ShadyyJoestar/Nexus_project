import Link from 'next/link'

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/60 via-white to-teal-50/30 text-slate-800">
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
      className={`rounded-2xl border border-sky-100 bg-white p-5 shadow-sm shadow-sky-100/60 sm:p-6 ${className}`}
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
  const map = {
    sky: 'bg-sky-100 text-sky-700',
    teal: 'bg-teal-100 text-teal-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-600',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${map[tone]}`}
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
      {...props}
      className={`w-full rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition hover:from-sky-600 hover:to-teal-500 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export function Input({
  label,
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        {...props}
        className={`w-full rounded-xl border border-sky-100 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 ${className}`}
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
  subtitle: string
  children: React.ReactNode
  footer: React.ReactNode
}) {
  return (
    <PageShell>
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-teal-400 text-sm font-bold text-white">
                N
              </span>
              <span className="text-xl font-semibold tracking-tight text-slate-800">
                Nexus
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-500">{subtitle}</p>
            <h1 className="mt-1 text-lg font-semibold text-slate-800">{title}</h1>
          </div>

          <Card className="p-6 sm:p-8">{children}</Card>

          <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
        </div>
      </div>
    </PageShell>
  )
}