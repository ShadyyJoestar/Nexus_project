import Navbar from '@/components/navbar'
import Container from '@/components/container'
import { PageShell } from '@/components/ui'
import { PageTitleSkeleton, ProjectsGridSkeleton } from '@/components/skeleton'

export default function Loading() {
  return (
    <PageShell>
      <Navbar />
      <Container className="py-8 sm:py-12">
        <PageTitleSkeleton />
        <div className="mt-8 sm:mt-10">
          <ProjectsGridSkeleton count={6} />
        </div>
      </Container>
    </PageShell>
  )
}