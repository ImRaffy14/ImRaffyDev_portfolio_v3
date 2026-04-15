import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { stripUiMotion } from '@/config/debugMotion'
import { getProjectBySlug } from '@/data/projects'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { ease, springReveal } from '@/lib/motion'
import type { ProjectOrigin } from '@/lib/projectNav'

const backLinkClass =
  'text-muted hover:text-foreground -mx-1 inline-flex min-h-10 items-center gap-2 rounded-lg px-1 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const galleryNavBtnClass =
  'border-border/60 bg-background/85 text-foreground hover:bg-background absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const GALLERY_REGION_ID = 'project-detail-gallery'

function ProjectGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0)
  const count = images.length
  const multi = count > 1

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? count - 1 : i - 1))
  }, [count])

  const goNext = useCallback(() => {
    setIndex((i) => (i >= count - 1 ? 0 : i + 1))
  }, [count])

  useEffect(() => {
    if (!multi) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [multi, goPrev, goNext])

  if (count === 0) return null

  const src = images[index]!

  return (
    <div className="relative mt-6" role={multi ? 'region' : undefined} aria-label={multi ? 'Gallery images' : undefined}>
      <div
        id={GALLERY_REGION_ID}
        className="relative overflow-hidden rounded-xl border border-border/60 bg-foreground/2"
      >
        <img
          src={src}
          alt={multi ? `Gallery image ${index + 1} of ${count}` : 'Gallery image'}
          className="aspect-video w-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {multi ? (
          <>
            <button
              type="button"
              className={`${galleryNavBtnClass} left-2 md:left-3`}
              onClick={goPrev}
              aria-controls={GALLERY_REGION_ID}
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" strokeWidth={2} />
            </button>
            <button
              type="button"
              className={`${galleryNavBtnClass} right-2 md:right-3`}
              onClick={goNext}
              aria-controls={GALLERY_REGION_ID}
              aria-label="Next image"
            >
              <ChevronRight className="size-6" strokeWidth={2} />
            </button>
            <p
              className="text-muted pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/85 px-2.5 py-0.5 font-mono text-xs tabular-nums backdrop-blur-sm"
              aria-live="polite"
            >
              {index + 1} / {count}
            </p>
          </>
        ) : null}
      </div>
    </div>
  )
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const reducedMotion = usePrefersReducedMotion()
  const location = useLocation()
  const project = slug ? getProjectBySlug(slug) : undefined

  const origin = (location.state as { projectOrigin?: ProjectOrigin } | null)?.projectOrigin
  const backTo = origin === 'archive' ? '/projects' : '/#projects'
  const backLabel = origin === 'archive' ? 'Back to all projects' : 'Back to featured work'

  if (!project) {
    return <Navigate to="/#projects" replace />
  }

  if (stripUiMotion) {
    return (
      <article className="py-12 md:py-16">
        <Container className="max-w-4xl space-y-10 md:space-y-12">
          <div>
            <Link to={backTo} className={backLinkClass}>
              <ArrowLeft className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
              <span>{backLabel}</span>
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
            <ProjectGallery key={project.slug} images={project.gallery} />
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
        <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={t(0)}>
          <Link to={backTo} className={backLinkClass}>
            <ArrowLeft className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
            <span>{backLabel}</span>
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

        <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={t(0.14)}>
          <p className="text-muted max-w-none text-base leading-relaxed md:text-lg">{project.description}</p>
        </motion.div>

        <motion.section
          aria-labelledby="gallery-heading"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.18)}
        >
          <h2 id="gallery-heading" className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            Gallery
          </h2>
          <ProjectGallery key={project.slug} images={project.gallery} />
        </motion.section>

        <motion.section
          aria-labelledby="highlights-heading"
          initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={t(0.22)}
        >
          <h2 id="highlights-heading" className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
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
          <h2 id="stack-heading" className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
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
