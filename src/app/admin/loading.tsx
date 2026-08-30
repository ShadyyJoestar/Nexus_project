import { Card } from '@/components/ui'
import { Skeleton } from '@/components/skeleton'

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-56" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-9 w-16" />
          </Card>
        ))}
      </div>
      <div className="mt-10">
        <Skeleton className="h-6 w-32" />
        <div className="mt-4 overflow-hidden rounded-2xl border border-sky-100 bg-white p-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}