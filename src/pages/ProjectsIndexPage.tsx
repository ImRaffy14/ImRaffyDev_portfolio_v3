import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { stripUiMotion } from '@/config/debugMotion'
import { projects } from '@/data/projects'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ease } from '@/lib/motion'
import { projectNavState } from '@/lib/projectNav'
import { cn } from '@/lib/cn'

const backLinkClass = cn(
  'text-muted hover:text-foreground -mx-1 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 py-2 text-sm font-medium transition-colors',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
)

function ProjectGridLink({ p }: { p: (typeof projects)[number] }) {
  return (
    <Link
      to={`/projects/${p.slug}`}
      state={projectNavState.archive}
      className={cn(
        'group border-border/60 bg-foreground/2 block overflow-hidden rounded-xl border sm:rounded-2xl',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
      )}
    >
      <div className="relative aspect-video overflow-hidden bg-border/30">
        <img
          src={p.coverImage}
          alt=""
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <p className="text-muted text-xs font-medium tabular-nums">{p.year}</p>
        <h2 className="font-display mt-1 text-base font-semibold tracking-tight text-foreground sm:text-lg md:text-xl">
          {p.title}
        </h2>
        <p className="text-muted mt-2 line-clamp-2 text-sm leading-relaxed">{p.shortDescription}</p>
      </div>
    </Link>
  )
}

export function ProjectsIndexPage() {
  const reducedMotion = usePrefersReducedMotion()
  const animate = !stripUiMotion && !reducedMotion

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.08 },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.42, ease },
    },
  }

  return (
    <div className="py-6 pb-12 sm:py-14 md:py-20">
      <Container>
        <Link to="/#projects" className={backLinkClass}>
          <ArrowLeft className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
          <span>Back to featured work</span>
        </Link>

        <header className="mt-6 sm:mt-8 md:mt-10">
          <p className="text-muted font-mono text-[0.65rem] font-semibold tracking-[0.25em] uppercase">
            All projects
          </p>
          <h1 className="font-display mt-3 text-2xl font-bold tracking-tight text-foreground sm:mt-4 sm:text-3xl md:text-4xl">
            Work archive
          </h1>
          <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed sm:text-base md:text-lg">
            Every case study in one place. Open a project for the full write-up, gallery, and stack.
          </p>
        </header>

        {animate ? (
          <motion.ul
            className="mt-8 grid list-none gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((p) => (
              <motion.li key={p.slug} variants={rowVariants} className="min-w-0">
                <ProjectGridLink p={p} />
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <ul className="mt-8 grid list-none gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
            {projects.map((p) => (
              <li key={p.slug} className="min-w-0">
                <ProjectGridLink p={p} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  )
}
