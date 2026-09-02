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
        <Skeleton className="mb-6 h-6 w-48" />
        <ProfileHeaderSkeleton />
        <div className="mt-10 space-y-10">
          <FormSkeleton />
          <ProjectsGridSkeleton />
        </div>
      </Container>
    </PageShell>
  )
}