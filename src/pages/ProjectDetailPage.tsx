import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from 'react'
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

type OpenImage = (src: string, alt: string) => void

function ImageLightbox({
  image,
  onClose,
}: {
  image: { src: string; alt: string } | null
  onClose: () => void
}) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isHolding, setIsHolding] = useState(false)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!image) return
    setZoom(1)
    setPan({ x: 0, y: 0 })
    setIsHolding(false)
  }, [image])

  useEffect(() => {
    if (!image) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [image, onClose])

  const zoomIn = () => setZoom((v) => Math.min(3, Number((v + 0.25).toFixed(2))))
  const zoomOut = () => setZoom((v) => Math.max(1, Number((v - 0.25).toFixed(2))))
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    panStartRef.current = pan
    setIsHolding(true)
    setZoom(2)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isHolding || zoom <= 1) return
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    const maxX = (rect.width * (zoom - 1)) / 2
    const maxY = (rect.height * (zoom - 1)) / 2
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    const nextX = Math.max(-maxX, Math.min(maxX, panStartRef.current.x + dx))
    const nextY = Math.max(-maxY, Math.min(maxY, panStartRef.current.y + dy))
    setPan({ x: nextX, y: nextY })
  }
  const endHold = () => {
    if (!isHolding) return
    setIsHolding(false)
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  if (!image) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Image preview">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 bg-black/45 p-2 text-white transition-colors hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label="Close image preview"
      >
        <X className="size-5" />
      </button>
      <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-black/50 px-2 py-1 backdrop-blur-sm">
        <button
          type="button"
          onClick={zoomOut}
          disabled={zoom <= 1}
          className="pointer-events-auto inline-flex min-h-9 items-center justify-center rounded-md p-2 text-white transition-colors enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Zoom out"
        >
          <ZoomOut className="size-4" />
        </button>
        <span className="font-mono text-xs text-white tabular-nums">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={zoomIn}
          disabled={zoom >= 3}
          className="pointer-events-auto inline-flex min-h-9 items-center justify-center rounded-md p-2 text-white transition-colors enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Zoom in"
        >
          <ZoomIn className="size-4" />
        </button>
      </div>
      <div
        ref={frameRef}
        className={`max-h-full max-w-6xl select-none overflow-hidden rounded-xl border border-white/20 bg-black/35 p-1 ${isHolding ? 'cursor-grabbing' : 'cursor-zoom-in'}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endHold}
        onPointerCancel={endHold}
        onPointerLeave={endHold}
        style={{ touchAction: 'none' }}
        aria-label="Hold left click to zoom and drag image"
      >
        <img
          src={image.src}
          alt={image.alt}
          className="max-h-[82vh] w-auto max-w-full select-none origin-center rounded-lg object-contain transition-transform duration-200 ease-out"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          loading="eager"
          decoding="async"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  )
}

function ProjectGallery({ images, onOpenImage }: { images: string[]; onOpenImage: OpenImage }) {
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
          className="aspect-video w-full cursor-zoom-in object-cover"
          loading="lazy"
          decoding="async"
          onClick={() => onOpenImage(src, multi ? `Gallery image ${index + 1} of ${count}` : 'Gallery image')}
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

function ProjectCertifications({ images, onOpenImage }: { images: string[]; onOpenImage: OpenImage }) {
  if (images.length === 0) return null

  return (
    <section aria-labelledby="certifications-heading">
      <h2
        id="certifications-heading"
        className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl"
      >
        Certifications
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            className="overflow-hidden rounded-xl border border-border/60 bg-foreground/2"
            onClick={() => onOpenImage(src, `Certification image ${i + 1}`)}
            aria-label={`Open certification image ${i + 1}`}
          >
            <img
              src={src}
              alt={`Certification image ${i + 1}`}
              className="aspect-video w-full cursor-zoom-in object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>
    </section>
  )
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const reducedMotion = usePrefersReducedMotion()
  const location = useLocation()
  const project = slug ? getProjectBySlug(slug) : undefined
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)

  const origin = (location.state as { projectOrigin?: ProjectOrigin } | null)?.projectOrigin
  const backTo = origin === 'archive' ? '/projects' : '/#projects'
  const backLabel = origin === 'archive' ? 'Back to all projects' : 'Back to featured work'
  const openImage = useCallback((src: string, alt: string) => setLightboxImage({ src, alt }), [])
  const closeImage = useCallback(() => setLightboxImage(null), [])

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
            <ProjectGallery key={project.slug} images={project.gallery} onOpenImage={openImage} />
          </section>

          {project.certificationImages && project.certificationImages.length > 0 ? (
            <ProjectCertifications images={project.certificationImages} onOpenImage={openImage} />
          ) : null}

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
        <ImageLightbox image={lightboxImage} onClose={closeImage} />
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
          <ProjectGallery key={project.slug} images={project.gallery} onOpenImage={openImage} />
        </motion.section>

        {project.certificationImages && project.certificationImages.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={t(0.2)}
          >
            <ProjectCertifications images={project.certificationImages} onOpenImage={openImage} />
          </motion.div>
        ) : null}

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
      <ImageLightbox image={lightboxImage} onClose={closeImage} />
    </article>
  )
}
