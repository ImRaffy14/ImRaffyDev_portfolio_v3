import { motion, useMotionValue, useSpring } from 'framer-motion'
import { lazy, Suspense, useRef } from 'react'
import { BitsErrorBoundary } from '@/components/bits/BitsErrorBoundary'
import { HeroCanvasFallback } from '@/components/bits/HeroCanvasFallback'
import { Container } from '@/components/ui/Container'
import { site } from '@/data/site'
import { useCoarsePointer } from '@/hooks/useCoarsePointer'
import { useHeroParallax } from '@/hooks/useHeroParallax'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

const HeroIDE = lazy(() =>
  import('@/components/three/HeroIDE').then((m) => ({ default: m.HeroIDE })),
)

const itemEase = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()
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
      className="relative -mt-14 min-h-dvh scroll-mt-14 overflow-hidden bg-background"
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

      <div className="relative z-10 flex min-h-dvh flex-col justify-center pt-20 pb-14 md:pt-24 md:pb-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10 xl:gap-10">
            <div className="order-2 text-center lg:order-1 lg:text-left">
              <motion.div style={{ x: nudgeX, y: nudgeY }}>
                <motion.p
                  className="text-muted text-sm font-medium tracking-wide md:text-base"
                  initial={{ opacity: 0, y: slideY }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reducedMotion ? 0.2 : 0.55, ease: itemEase }}
                >
                  {site.hero.greeting}
                </motion.p>

                <motion.h1
                  className="font-display mt-2 text-[clamp(2.5rem,7vw,4.25rem)] font-bold leading-[1.02] tracking-tight text-foreground"
                  initial={{ opacity: 0, x: slideX }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: reducedMotion ? 0.2 : 0.65,
                    ease: itemEase,
                    delay: reducedMotion ? 0 : 0.05,
                  }}
                >
                  {site.hero.headline}
                </motion.h1>

                <motion.p
                  className="text-accent mt-3 text-lg font-semibold tracking-tight md:text-xl"
                  initial={{ opacity: 0, y: slideY }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reducedMotion ? 0.2 : 0.6,
                    ease: itemEase,
                    delay: reducedMotion ? 0 : 0.12,
                  }}
                >
                  {site.hero.role}
                </motion.p>

                <motion.p
                  className="text-muted mx-auto mt-5 max-w-md text-base leading-relaxed md:text-lg lg:mx-0"
                  initial={{ opacity: 0, y: slideY }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reducedMotion ? 0.2 : 0.6,
                    ease: itemEase,
                    delay: reducedMotion ? 0 : 0.18,
                  }}
                >
                  {site.hero.tagline}
                </motion.p>

                <motion.div
                  className="mt-8 flex flex-wrap justify-center gap-3 md:mt-10 lg:justify-start"
                  initial={{ opacity: 0, y: slideY }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reducedMotion ? 0.2 : 0.6,
                    ease: itemEase,
                    delay: reducedMotion ? 0 : 0.24,
                  }}
                >
                  <motion.a
                    href="#projects"
                    className={cn(
                      'inline-flex h-12 cursor-pointer items-center justify-center rounded-xl px-7 text-base font-semibold transition-opacity hover:opacity-90',
                      'bg-foreground text-background',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                    )}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 520, damping: 32 }}
                  >
                    View Projects
                  </motion.a>
                </motion.div>
              </motion.div>
            </div>

            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="relative h-[min(62vh,520px)] w-full max-w-2xl min-h-[300px] bg-transparent lg:h-[min(82vh,720px)] lg:max-w-none lg:min-h-[440px]">
                {reducedMotion ? (
                  <HeroCanvasFallback />
                ) : (
                  <BitsErrorBoundary fallback={<HeroCanvasFallback />}>
                    <Suspense fallback={<HeroCanvasFallback />}>
                      <HeroIDE reducedMotion={reducedMotion} />
                    </Suspense>
                  </BitsErrorBoundary>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}
