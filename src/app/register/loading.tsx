import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell } from '@/components/ui'
import { Skeleton } from '@/components/skeleton'

export default function Loading() {
  return (
    <PageShell>
      <Navbar />
      <Container className="pb-16 pt-12 sm:pb-24 sm:pt-20">
        <div className="max-w-4xl space-y-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-12 w-full max-w-xl" />
          <Skeleton className="h-12 w-3/4 max-w-lg" />
          <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
          <Skeleton className="h-5 w-4/5 max-w-xl" />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-12 w-full rounded-xl sm:w-40" />
            <Skeleton className="h-12 w-full rounded-xl sm:w-44" />
          </div>
        </div>
      </Container>
    </PageShell>
  )
}