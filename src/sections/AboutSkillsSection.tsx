import { AboutIntro } from '@/components/about/AboutIntro'
import { SkillsPanel } from '@/components/about/SkillsPanel'
import { StackedSection } from '@/components/layout/StackedSection'
import { Container } from '@/components/ui/Container'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function AboutSkillsSection() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <StackedSection
      id="about"
      stackIndex={0}
      aria-labelledby="about-heading"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14 xl:gap-16">
          <AboutIntro reducedMotion={reducedMotion} />
          <div className="flex w-full min-w-0 flex-col rounded-2xl border border-border/60 bg-foreground/2 p-5 sm:p-6 md:p-6 lg:p-7">
            <SkillsPanel reducedMotion={reducedMotion} />
          </div>
        </div>
      </Container>
    </StackedSection>
  )
}
