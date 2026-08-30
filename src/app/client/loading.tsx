import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell } from '@/components/ui'
import {
  PageTitleSkeleton,
  MembersGridSkeleton,
  ProjectsGridSkeleton,
  Skeleton,
} from '@/components/skeleton'

export default function Loading() {
  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <div className="flex items-center justify-between gap-3">
          <PageTitleSkeleton />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="mt-10">
          <Skeleton className="h-6 w-24" />
          <div className="mt-4">
            <MembersGridSkeleton />
          </div>
        </div>
        <div className="mt-12">
          <Skeleton className="h-6 w-24" />
          <div className="mt-4">
            <ProjectsGridSkeleton />
          </div>
        </div>
      </Container>
    </PageShell>
  )
}