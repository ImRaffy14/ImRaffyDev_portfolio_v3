import { motion } from 'framer-motion'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { stripUiMotion } from '@/config/debugMotion'
import { getProjectBySlug } from '@/data/projects'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  ease,
  motionViewport,
  springReveal,
  staggerContainer,
  staggerItem,
} from '@/lib/motion'

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const reducedMotion = usePrefersReducedMotion()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) {
    return <Navigate to="/#projects" replace />
  }

  if (stripUiMotion) {
    return (
      <article className="py-12 md:py-16">
        <Container className="max-w-4xl space-y-10 md:space-y-12">
          <div>
            <Link
              to="/#projects"
              className="text-muted hover:text-foreground text-sm font-medium transition-colors"
            >
              ← Back to projects
            </Link>
          </div>

          <header className="space-y-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {project.title}
            </h1>
            <p className="text-muted text-sm font-medium tabular-nums md:text-base">{project.year}</p>
          </header>

          <div className="overflow-hidden rounded-2xl border border-border/60 bg-foreground/2">
            <img
              src={project.coverImage}
              alt=""
              className="aspect-video w-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>

          <div>
            <p className="text-muted max-w-none text-base leading-relaxed md:text-lg">
              {project.description}
            </p>
          </div>

          <section aria-labelledby="gallery-heading">
            <h2
              id="gallery-heading"
              className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
            >
              Gallery
            </h2>
            <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2">
              {project.gallery.map((src) => (
                <li
                  key={src}
                  className="overflow-hidden rounded-xl border border-border/60 bg-foreground/2"
                >
                  <img
                    src={src}
                    alt=""
                    className="aspect-video w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="highlights-heading">
            <h2
              id="highlights-heading"
              className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
            >
              Highlights
            </h2>
            <ul className="text-muted mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed md:text-lg">
              {project.highlights.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="stack-heading">
            <h2
              id="stack-heading"
              className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
            >
              Tech stack
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <li
                  key={tech}
                  className="border-border/60 bg-foreground/4 rounded-full border px-3 py-1 text-sm font-medium text-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </article>
    )
  }

  const t = (delay = 0) => ({
    duration: reducedMotion ? 0.12 : 0.5,
    ease,
    delay: reducedMotion ? 0 : delay,
  })

  const imgReveal = reducedMotion ? { duration: 0.12 } : springReveal

  return (
    <article className="py-12 md:py-16">
      <Container className="max-w-4xl space-y-10 md:space-y-12">
        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0)}
        >
          <Link
            to="/#projects"
            className="text-muted hover:text-foreground text-sm font-medium transition-colors"
          >
            ← Back to projects
          </Link>
        </motion.div>

        <header className="space-y-3">
          <motion.h1
            className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.04)}
          >
            {project.title}
          </motion.h1>
          <motion.p
            className="text-muted text-sm font-medium tabular-nums md:text-base"
            initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.08)}
          >
            {project.year}
          </motion.p>
        </header>

        <motion.div
          className="overflow-hidden rounded-2xl border border-border/60 bg-foreground/2"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 16, scale: reducedMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={t(0.1)}
        >
          <motion.img
            src={project.coverImage}
            alt=""
            className="aspect-video w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            initial={reducedMotion ? false : { scale: 1.04, opacity: 0.88 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={imgReveal}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.14)}
        >
          <p className="text-muted max-w-none text-base leading-relaxed md:text-lg">
            {project.description}
          </p>
        </motion.div>

        <motion.section
          aria-labelledby="gallery-heading"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.18)}
        >
          <h2
            id="gallery-heading"
            className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
          >
            Gallery
          </h2>
          <motion.ul
            className="mt-6 grid list-none gap-4 sm:grid-cols-2"
            variants={staggerContainer(reducedMotion, reducedMotion ? 0 : 0.06, reducedMotion ? 0 : 0.04)}
            initial="hidden"
            whileInView="visible"
            viewport={motionViewport.projectDetail}
          >
            {project.gallery.map((src) => (
              <motion.li
                key={src}
                className="overflow-hidden rounded-xl border border-border/60 bg-foreground/2"
                variants={staggerItem(reducedMotion)}
              >
                <img
                  src={src}
                  alt=""
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </motion.li>
            ))}
          </motion.ul>
        </motion.section>

        <motion.section
          aria-labelledby="highlights-heading"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.22)}
        >
          <h2
            id="highlights-heading"
            className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
          >
            Highlights
          </h2>
          <ul className="text-muted mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed md:text-lg">
            {project.highlights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          aria-labelledby="stack-heading"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.26)}
        >
          <h2
            id="stack-heading"
            className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
          >
            Tech stack
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <li
                key={tech}
                className="border-border/60 bg-foreground/4 rounded-full border px-3 py-1 text-sm font-medium text-foreground"
              >
                {tech}
              </li>
            ))}
          </ul>
        </motion.section>
      </Container>
    </article>
  )
}
