import { FeaturedProjects } from '@/components/projects/FeaturedProjects'
import { StackedSection } from '@/components/layout/StackedSection'
import { Container } from '@/components/ui/Container'
import { stripUiMotion } from '@/config/debugMotion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function ProjectsSection() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <StackedSection
      id="projects"
      stackIndex={1}
      aria-labelledby="projects-heading"
      background={
        <div className="relative min-h-full w-full">
          <div className="from-accent/8 absolute inset-0 bg-linear-to-bl via-transparent to-transparent dark:from-accent/5" />
          <div className="bg-foreground/3 dark:bg-foreground/5 absolute bottom-[12%] -left-[10%] h-[min(38vh,320px)] w-[min(42vw,340px)] rounded-full" />
        </div>
      }
    >
      <Container>
        <FeaturedProjects reducedMotion={reducedMotion} animateIntro={!stripUiMotion} />
      </Container>
    </StackedSection>
  )
}
