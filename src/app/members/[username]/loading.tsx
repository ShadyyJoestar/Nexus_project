import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell } from '@/components/ui'
import {
  ProfileHeaderSkeleton,
  ProjectsGridSkeleton,
  Skeleton,
} from '@/components/skeleton'

export default function Loading() {
  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <ProfileHeaderSkeleton />
        <div className="mt-8">
          <Skeleton className="h-3 w-16" />
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-14 rounded-full" />
          </div>
        </div>
        <div className="mt-10">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="mt-1 h-4 w-36" />
          <div className="mt-5">
            <ProjectsGridSkeleton />
          </div>
        </div>
      </Container>
    </PageShell>
  )
}