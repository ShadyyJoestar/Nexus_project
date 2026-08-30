export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-sky-100/80 ${className}`}
      aria-hidden
    />
  )
}

export function MemberCardSkeleton() {
  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-4 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-14 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-5/6" />
      <div className="mt-4 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  )
}

export function MembersGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <MemberCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProjectsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <div className="flex items-start gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl sm:h-20 sm:w-20" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-4 w-64 max-w-full" />
        </div>
      </div>
    </div>
  )
}

export function PageTitleSkeleton() {
  return (
    <div className="max-w-2xl space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72 max-w-full" />
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="space-y-4">
        <div>
          <Skeleton className="mb-2 h-3 w-24" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div>
          <Skeleton className="mb-2 h-3 w-16" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
        <div>
          <Skeleton className="mb-2 h-3 w-28" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
    </div>
  )
}