import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()
  const navigate = useNavigate()
  const [cliFromRoute, setCliFromRoute] = useState(false)

  const onCliRouteConsumed = useCallback(() => setCliFromRoute(false), [])

  useEffect(() => {
    const s = location.state as { openCli?: boolean } | undefined
    if (s?.openCli) {
      setCliFromRoute(true)
      navigate('/', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  return (
    <>
      <HeroSection cliOpenFromRoute={cliFromRoute} onCliRouteConsumed={onCliRouteConsumed} />

      <Suspense fallback={null}>
        <AboutSkillsSection />
        <ProjectsSection />
        <WorkExperienceSection />
        <ContactSection />
      </Suspense>
    </>
  )
}
