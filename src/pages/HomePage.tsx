import { lazy, Suspense } from 'react'
import { useScrollToHash } from '@/hooks/useScrollToHash'
import { HeroSection } from '@/sections/HeroSection'

const AboutSkillsSection = lazy(() =>
  import('@/sections/AboutSkillsSection').then((m) => ({ default: m.AboutSkillsSection })),
)
const ProjectsSection = lazy(() =>
  import('@/sections/ProjectsSection').then((m) => ({ default: m.ProjectsSection })),
)
const WorkExperienceSection = lazy(() =>
  import('@/sections/WorkExperienceSection').then((m) => ({ default: m.WorkExperienceSection })),
)
const ContactSection = lazy(() =>
  import('@/sections/ContactSection').then((m) => ({ default: m.ContactSection })),
)

export function HomePage() {
  useScrollToHash()

  return (
    <>
      <HeroSection />

      <Suspense fallback={null}>
        <AboutSkillsSection />
        <ProjectsSection />
        <WorkExperienceSection />
        <ContactSection />
      </Suspense>
    </>
  )
}
