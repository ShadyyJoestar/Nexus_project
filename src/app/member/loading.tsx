import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell } from '@/components/ui'
import {
  ProfileHeaderSkeleton,
  FormSkeleton,
  ProjectsGridSkeleton,
  Skeleton,
} from '@/components/skeleton'

export default function Loading() {
  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <ProfileHeaderSkeleton />
        <div className="mt-10 space-y-10">
          <div>
            <Skeleton className="h-6 w-28" />
            <Skeleton className="mt-1 h-4 w-48" />
            <div className="mt-4">
              <FormSkeleton />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-36 rounded-xl" />
            </div>
            <div className="mt-4">
              <ProjectsGridSkeleton />
            </div>
          </div>
        </div>
      </Container>
    </PageShell>
  )
}