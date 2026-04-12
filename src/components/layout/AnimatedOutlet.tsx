import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { Navigate, useLocation, useRoutes } from 'react-router-dom'
import { stripUiMotion } from '@/config/debugMotion'
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

export function AnimatedOutlet() {
  const location = useLocation()
  const reducedMotion = usePrefersReducedMotion()

  const element = useRoutes(
    [
      { path: '/', element: <HomePage /> },
      {
        path: '/projects',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <ProjectsIndexPage />
          </Suspense>
        ),
      },
      {
        path: '/projects/:slug',
        element: (
          <Suspense fallback={<RouteFallback />}>
            <ProjectDetailPage />
          </Suspense>
        ),
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
    location,
  )

  if (stripUiMotion) {
    return <div className="min-w-0 flex-1">{element}</div>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="min-w-0 flex-1"
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
