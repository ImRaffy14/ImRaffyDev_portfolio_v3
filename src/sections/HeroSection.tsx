import { ChevronDown } from 'lucide-react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { lazy, Suspense, useRef, type MouseEvent } from 'react'
import { BitsErrorBoundary } from '@/components/bits/BitsErrorBoundary'
import { HeroCanvasFallback } from '@/components/bits/HeroCanvasFallback'
import { Container } from '@/components/ui/Container'
import { stripUiMotion } from '@/config/debugMotion'
import { site } from '@/data/site'
import { useCoarsePointer } from '@/hooks/useCoarsePointer'
import { useHeroIdeSkipWebGL } from '@/hooks/useHeroIdeSkipWebGL'
import { useHeroParallax } from '@/hooks/useHeroParallax'
import { useLenisHashClick } from '@/hooks/useLenisHashClick'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { springGentle, springReveal } from '@/lib/motion'

const HeroIDE = lazy(() =>
  import('@/components/three/HeroIDE').then((m) => ({ default: m.HeroIDE })),
)

function HeroScrollDown({
  reducedMotion,
  onHashNav,
}: {
  reducedMotion: boolean
  onHashNav: (e: MouseEvent<HTMLAnchorElement>) => void
}) {
  const icon = (
    <ChevronDown className="size-7 sm:size-8" strokeWidth={2.25} aria-hidden />
  )
  return (
    <div className="pointer-events-auto absolute bottom-20 left-0 right-0 z-20 flex justify-center md:bottom-24">
      <a
        href="#about"
        onClick={onHashNav}
        className={cn(
          'text-muted-foreground hover:text-foreground flex flex-col items-center gap-1.5 rounded-full px-4 py-3 transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        )}
        aria-label="Scroll to About section"
      >
        {reducedMotion ? (
          icon
        ) : (
          <motion.span
            className="inline-flex"
            animate={{ y: [0, 9, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
            }}
          >
            {icon}
          </motion.span>
        )}
        <span className="font-mono text-[0.65rem] font-semibold tracking-[0.2em] uppercase opacity-80 sm:text-xs">
          Scroll
        </span>
      </a>
    </div>
  )
}

function HeroIdeColumn({ reducedMotion }: { reducedMotion: boolean }) {
  const ideSurfaceRef = useRef<HTMLDivElement>(null)
  const skipWebGL = useHeroIdeSkipWebGL()

  return (
    <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
      <div
        ref={ideSurfaceRef}
        className="relative h-[min(62vh,520px)] w-full max-w-2xl min-h-[300px] bg-transparent lg:h-[min(82vh,720px)] lg:max-w-none lg:min-h-[440px]"
      >
        {reducedMotion || skipWebGL ? (
          <HeroCanvasFallback />
        ) : (
          <BitsErrorBoundary fallback={<HeroCanvasFallback />}>
            <Suspense fallback={<HeroCanvasFallback />}>
              <HeroIDE
                reducedMotion={reducedMotion}
                containerRef={ideSurfaceRef}
              />
            </Suspense>
          </BitsErrorBoundary>
        )}
      </div>
    </div>
  )
}

function HeroSectionStrip() {
  const reducedMotion = usePrefersReducedMotion()
  const onHashNav = useLenisHashClick()

  return (
    <section
      id="hero"
      className="relative z-[1] -mt-14 min-h-dvh scroll-mt-14 overflow-hidden bg-background"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 z-1">
        <div
          className="absolute inset-0 opacity-40 dark:opacity-35"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--hero-grid-line) 1px, transparent 1px),
              linear-gradient(to bottom, var(--hero-grid-line) 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col justify-center pt-20 pb-24 md:pt-24 md:pb-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-10">
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <div>
                <p className="text-muted text-sm font-medium tracking-wide md:text-base">
                  {site.hero.greeting}
                </p>
                <h1 className="font-display mt-2 text-[clamp(2.5rem,7vw,4.25rem)] font-bold leading-[1.02] tracking-tight text-foreground">
                  {site.hero.headline}
                </h1>
                <p className="text-accent mt-3 text-lg font-semibold tracking-tight md:text-xl">
                  {site.hero.role}
                </p>
                <p className="text-muted mx-auto mt-5 max-w-md text-base leading-relaxed md:text-lg lg:mx-0">
                  {site.hero.tagline}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 md:mt-10 lg:justify-start">
                  <a
                    href="#projects"
                    onClick={onHashNav}
                    className={cn(
                      'inline-flex h-12 min-h-11 cursor-pointer items-center justify-center rounded-xl px-7 text-base font-semibold transition-opacity hover:opacity-90',
                      'bg-foreground text-background',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    )}
                  >
                    View Projects
                  </a>
                </div>
              </div>
            </div>
            <HeroIdeColumn reducedMotion={reducedMotion} />
          </div>
        </Container>
      </div>
      <HeroScrollDown reducedMotion={reducedMotion} onHashNav={onHashNav} />
    </section>
  )
}

function HeroSectionMotion() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const onHashNav = useLenisHashClick()
  const coarsePointer = useCoarsePointer()
  const parallaxY = useHeroParallax(sectionRef, !reducedMotion)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const nudgeX = useSpring(rawX, { stiffness: 280, damping: 30 })
  const nudgeY = useSpring(rawY, { stiffness: 280, damping: 30 })

  const pointerNudge = !reducedMotion && !coarsePointer

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!pointerNudge || !sectionRef.current) return
    const r = sectionRef.current.getBoundingClientRect()
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
    rawX.set(nx * 4)
    rawY.set(ny * 4)
  }

  const onPointerLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const slideY = reducedMotion ? 0 : 24
  const slideX = reducedMotion ? 0 : -20

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative z-[1] -mt-14 min-h-dvh scroll-mt-14 overflow-hidden bg-background"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-1"
        style={{ y: parallaxY }}
      >
        <div
          className="absolute inset-0 opacity-40 dark:opacity-35"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--hero-grid-line) 1px, transparent 1px),
              linear-gradient(to bottom, var(--hero-grid-line) 1px, transparent 1px)
            `,
            backgroundSize: '56px 56px',
          }}
        />
      </motion.div>

      <div className="relative z-10 flex min-h-dvh flex-col justify-center pt-20 pb-24 md:pt-24 md:pb-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-10">
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <motion.div style={{ x: nudgeX, y: nudgeY }}>
                <motion.p
                  className="text-muted text-sm font-medium tracking-wide md:text-base"
                  initial={{ opacity: 0, y: slideY }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    reducedMotion
                      ? { duration: 0.2 }
                      : { ...springGentle, delay: 0 }
                  }
                >
                  {site.hero.greeting}
                </motion.p>

                <motion.h1
                  className="font-display mt-2 text-[clamp(2.5rem,7vw,4.25rem)] font-bold leading-[1.02] tracking-tight text-foreground"
                  initial={{ opacity: 0, x: slideX, scale: reducedMotion ? 1 : 1.02 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={
                    reducedMotion
                      ? { duration: 0.2, delay: 0.05 }
                      : { ...springReveal, delay: 0.06 }
                  }
                >
                  {site.hero.headline}
                </motion.h1>

                <motion.p
                  className="text-accent mt-3 text-lg font-semibold tracking-tight md:text-xl"
                  initial={{ opacity: 0, y: slideY }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    reducedMotion
                      ? { duration: 0.2, delay: 0.12 }
                      : { ...springGentle, delay: 0.12 }
                  }
                >
                  {site.hero.role}
                </motion.p>

                <motion.p
                  className="text-muted mx-auto mt-5 max-w-md text-base leading-relaxed md:text-lg lg:mx-0"
                  initial={{ opacity: 0, y: slideY }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    reducedMotion
                      ? { duration: 0.2, delay: 0.18 }
                      : { ...springGentle, delay: 0.18 }
                  }
                >
                  {site.hero.tagline}
                </motion.p>

                <motion.div
                  className="mt-8 flex flex-wrap justify-center gap-3 md:mt-10 lg:justify-start"
                  initial={{ opacity: 0, y: slideY }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    reducedMotion
                      ? { duration: 0.2, delay: 0.24 }
                      : { ...springGentle, delay: 0.24 }
                  }
                >
                  <motion.a
                    href="#projects"
                    onClick={onHashNav}
                    className={cn(
                      'inline-flex h-12 min-h-11 cursor-pointer items-center justify-center rounded-lg px-7 text-base font-semibold transition-opacity hover:opacity-90',
                      'bg-foreground text-background',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    )}
                    whileHover={reducedMotion ? undefined : { scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 32 }}
                  >
                    View Projects
                  </motion.a>
                </motion.div>
              </motion.div>
            </div>

            <HeroIdeColumn reducedMotion={reducedMotion} />
          </div>
        </Container>
      </div>
      <HeroScrollDown reducedMotion={reducedMotion} onHashNav={onHashNav} />
    </section>
  )
}

export function HeroSection() {
  return stripUiMotion ? <HeroSectionStrip /> : <HeroSectionMotion />
}
