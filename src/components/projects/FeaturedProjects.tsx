import { AnimatePresence, motion } from 'framer-motion'
import { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { stripUiMotion } from '@/config/debugMotion'
import { projects, type Project } from '@/data/projects'
import { cn } from '@/lib/cn'
import {
  ease,
  motionViewport,
  sectionEyebrowVariants,
  sectionLeadVariants,
  sectionTitleVariants,
  staggerContainer,
} from '@/lib/motion'

const WHEEL_ACCUM_THRESHOLD = 28

type FeaturedProjectsProps = {
  reducedMotion: boolean
  animateIntro: boolean
}

const ShowcaseImage = forwardRef<
  HTMLDivElement,
  {
    project: Project
    index: number
    total: number
    reducedMotion: boolean
  }
>(function ShowcaseImage({ project, index, total, reducedMotion }, ref) {
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
  const progressPct = ((index + 1) / total) * 100

  const img = (
    <img
      src={project.coverImage}
      alt=""
      className="size-full object-cover"
      loading={index === 0 ? 'eager' : 'lazy'}
      decoding="async"
    />
  )

  return (
    <div
      ref={ref}
      className="relative aspect-4/5 min-h-[280px] w-full overflow-hidden rounded-2xl bg-neutral-900 sm:min-h-[360px] lg:aspect-auto lg:min-h-[min(72vh,640px)] lg:max-h-[min(72vh,640px)]"
    >
      {stripUiMotion || reducedMotion ? (
        <div className="absolute inset-0">{img}</div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={project.slug}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {img}
          </motion.div>
        </AnimatePresence>
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/50"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 flex flex-col p-5 sm:p-7 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <p className="font-mono text-xs font-medium tracking-widest text-white/70">{counter}</p>
        </div>

        <div className="mt-6 max-w-xl">
          <h3 className="font-display text-xl font-bold tracking-[0.12em] text-white uppercase sm:text-2xl md:text-3xl">
            {project.title}
          </h3>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
            {project.techStack.slice(0, 6).map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-white/35 bg-white/10 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wider text-white uppercase backdrop-blur-sm"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto space-y-3">
          <p className="text-[0.65rem] font-medium tracking-[0.2em] text-white/55 uppercase">
            Scroll preview to change project · click to open
          </p>
          <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <Link
        to={`/projects/${project.slug}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={`Open ${project.title} case study`}
      >
        <span className="sr-only">View project</span>
      </Link>
    </div>
  )
})

ShowcaseImage.displayName = 'ShowcaseImage'

export function FeaturedProjects({ reducedMotion, animateIntro }: FeaturedProjectsProps) {
  const [active, setActive] = useState(0)
  const total = projects.length
  const current = projects[active] ?? projects[0]!
  const showcaseRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  const accRef = useRef(0)

  useLayoutEffect(() => {
    activeRef.current = active
  }, [active])

  useLayoutEffect(() => {
    const el = showcaseRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      const i = activeRef.current
      const atStart = i <= 0
      const atEnd = i >= total - 1

      if (atStart && e.deltaY < 0) {
        accRef.current = 0
        return
      }
      if (atEnd && e.deltaY > 0) {
        accRef.current = 0
        return
      }

      e.preventDefault()
      e.stopPropagation()

      accRef.current += e.deltaY
      if (Math.abs(accRef.current) < WHEEL_ACCUM_THRESHOLD) return

      const dir = accRef.current > 0 ? 1 : -1
      accRef.current = 0
      setActive((prev) => Math.min(total - 1, Math.max(0, prev + dir)))
    }

    el.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => el.removeEventListener('wheel', onWheel, { capture: true })
  }, [total])

  const intro = (
    <>
      <div className="text-muted mb-8 flex items-center gap-4 lg:mb-10">
        <span className="shrink-0 font-mono text-[0.65rem] font-semibold tracking-[0.25em] uppercase">
          Selected projects
        </span>
        <span className="bg-border/70 h-px min-w-8 flex-1" aria-hidden />
      </div>
      <h2
        id="projects-heading"
        className="font-display text-3xl font-bold tracking-[0.08em] text-foreground uppercase sm:text-4xl md:text-5xl"
      >
        Featured work
      </h2>
      <p className="text-muted mt-5 max-w-md text-sm leading-relaxed md:text-base">
        Hover a row to preview. Scroll the large preview to step through projects—at the first or
        last project, scroll passes through to the page.
      </p>
    </>
  )

  const list = (
    <nav className="mt-10" aria-label="Project list">
      <ul className="flex flex-col gap-0 border-t border-border/60">
        {projects.map((p, i) => {
          const isActive = i === active
          return (
            <li key={p.slug} className="border-b border-border/60 last:border-b-0">
              <Link
                to={`/projects/${p.slug}`}
                className={cn(
                  'group flex items-center gap-4 py-4 pr-2 transition-colors md:gap-5 md:py-5',
                  'focus-visible:bg-foreground/5 rounded-lg focus-visible:outline-none',
                  isActive ? 'bg-foreground/3' : 'hover:bg-foreground/4',
                )}
                onMouseEnter={() => {
                  accRef.current = 0
                  setActive(i)
                }}
                onFocus={() => {
                  accRef.current = 0
                  setActive(i)
                }}
              >
                <span
                  className={cn(
                    'size-2 shrink-0 rounded-sm transition-colors',
                    isActive ? 'bg-foreground' : 'bg-transparent ring-1 ring-border/80',
                  )}
                  aria-hidden
                />
                <div className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-border/40 sm:h-12 sm:w-18">
                  <img
                    src={p.coverImage}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <span
                  className={cn(
                    'min-w-0 flex-1 font-mono text-[0.7rem] font-semibold leading-snug tracking-[0.14em] uppercase sm:text-xs',
                    isActive ? 'text-foreground' : 'text-muted group-hover:text-foreground',
                  )}
                >
                  {p.title}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      <Link
        to="/projects"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-8 text-xs font-semibold tracking-[0.2em] text-background uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        View all
      </Link>
    </nav>
  )

  const splitMotion = animateIntro && !reducedMotion && !stripUiMotion

  const split = (
    <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start lg:gap-12 xl:gap-16">
      {splitMotion ? (
        <>
          <motion.div
            className="order-2 min-w-0 lg:order-1"
            initial={{ opacity: 0, x: -44 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={motionViewport.standard}
            transition={{ duration: 0.55, ease }}
          >
            {list}
          </motion.div>
          <motion.div
            className="order-1 min-w-0 lg:sticky lg:top-28 lg:order-2 lg:self-start"
            initial={{ opacity: 0, x: 44 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={motionViewport.standard}
            transition={{ duration: 0.55, delay: 0.08, ease }}
          >
            <ShowcaseImage
              ref={showcaseRef}
              project={current}
              index={active}
              total={total}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        </>
      ) : (
        <>
          <div className="order-2 min-w-0 lg:order-1">{list}</div>
          <div className="order-1 min-w-0 lg:sticky lg:top-28 lg:order-2 lg:self-start">
            <ShowcaseImage
              ref={showcaseRef}
              project={current}
              index={active}
              total={total}
              reducedMotion={reducedMotion}
            />
          </div>
        </>
      )}
    </div>
  )

  if (!animateIntro) {
    return (
      <div>
        {intro}
        {split}
      </div>
    )
  }

  return (
    <div>
      <motion.div
        variants={staggerContainer(reducedMotion, 0.06, 0.02)}
        initial="hidden"
        whileInView="visible"
        viewport={motionViewport.standard}
      >
        <motion.div
          className="text-muted mb-8 flex items-center gap-4 lg:mb-10"
          variants={sectionEyebrowVariants(reducedMotion)}
        >
          <span className="shrink-0 font-mono text-[0.65rem] font-semibold tracking-[0.25em] uppercase">
            Selected projects
          </span>
          <span className="bg-border/70 h-px min-w-8 flex-1" aria-hidden />
        </motion.div>
        <motion.h2
          id="projects-heading"
          className="font-display text-3xl font-bold tracking-[0.08em] text-foreground uppercase sm:text-4xl md:text-5xl"
          variants={sectionTitleVariants(reducedMotion)}
        >
          Featured work
        </motion.h2>
        <motion.p
          className="text-muted mt-5 max-w-md text-sm leading-relaxed md:text-base"
          variants={sectionLeadVariants(reducedMotion, reducedMotion ? 0 : 0.04)}
        >
          Hover a row to preview. Scroll the large preview to step through projects—at the first or
          last project, scroll passes through to the page.
        </motion.p>
      </motion.div>
      {split}
    </div>
  )
}
