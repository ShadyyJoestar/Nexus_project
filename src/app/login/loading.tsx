import { PageShell, Card } from '@/components/ui'
import { Skeleton } from '@/components/skeleton'

export default function Loading() {
  return (
    <PageShell>
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Card className="p-6 sm:p-8">
            <div className="space-y-4">
              <div>
                <Skeleton className="mb-2 h-3 w-14" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <div>
                <Skeleton className="mb-2 h-3 w-20" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </div>
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}