import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Navigate, useLocation, useRoutes } from 'react-router-dom'
import { stripUiMotion } from '@/config/debugMotion'
import { useScrollTopOnMount } from '@/hooks/useScrollTopOnMount'
import { HomePage } from '@/pages/HomePage'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { pageTransition, pageVariants } from '@/lib/motion'

const ProjectsIndexPage = lazy(() =>
  import('@/pages/ProjectsIndexPage').then((m) => ({ default: m.ProjectsIndexPage })),
)
const ProjectDetailPage = lazy(() =>
  import('@/pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
)

function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] w-full items-center justify-center px-4">
      <p className="text-muted text-sm">Loading…</p>
    </div>
  )
}

function ProjectsIndexRoute() {
  useScrollTopOnMount()
  return (
    <Suspense fallback={<RouteFallback />}>
      <ProjectsIndexPage />
    </Suspense>
  )
}

function ProjectDetailRoute() {
  useScrollTopOnMount()
  return (
    <Suspense fallback={<RouteFallback />}>
      <ProjectDetailPage />
    </Suspense>
  )
}

function CliRoute() {
  return <Navigate to="/" replace state={{ openCli: true }} />
}

export function AnimatedOutlet() {
  const location = useLocation()
  const reducedMotion = usePrefersReducedMotion()

  const element = useRoutes(
    [
      { path: '/', element: <HomePage /> },
      {
        path: '/projects',
        element: <ProjectsIndexRoute />,
      },
      {
        path: '/projects/:slug',
        element: <ProjectDetailRoute />,
      },
      { path: '/cli', element: <CliRoute /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
    location,
  )

  if (stripUiMotion) {
    return <div className="flex min-h-0 min-w-0 flex-1 flex-col">{element}</div>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="flex min-h-0 min-w-0 flex-1 flex-col"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants(reducedMotion)}
        transition={pageTransition(reducedMotion)}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  )
}
