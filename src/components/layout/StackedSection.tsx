import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { SectionDecorParallax } from '@/components/layout/SectionDecorParallax'
import {
  COVER_Z_BASE,
  COVER_Z_STEP,
  coverShellEase,
} from '@/config/coverSections'
import { stripUiMotion } from '@/config/debugMotion'
import { useCoverMotionWeak } from '@/hooks/useCoverMotionWeak'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

type StackedSectionProps = {
  id: string
  stackIndex: number
  'aria-labelledby'?: string
  className?: string
  children: ReactNode
  background?: ReactNode
  dense?: boolean
}

export function StackedSection({
  id,
  stackIndex,
  'aria-labelledby': ariaLabelledBy,
  className,
  children,
  background,
  dense = false,
}: StackedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const weak = useCoverMotionWeak()
  const scrollOff = reducedMotion || stripUiMotion

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const easedProgress = useTransform(scrollYProgress, coverShellEase)

  const yEnd = weak ? -40 : -64
  const opacityEnd = weak ? 0.94 : 0.86
  const scaleEnd = weak ? 0.985 : 0.975

  const y = useTransform(easedProgress, [0, 1], [0, yEnd])
  const opacity = useTransform(easedProgress, [0, 0.75, 1], [1, 1, opacityEnd])
  const scale = useTransform(easedProgress, [0, 1], [1, scaleEnd])

  const z = COVER_Z_BASE + stackIndex * COVER_Z_STEP

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={ariaLabelledBy}
      className="relative isolate min-h-dvh scroll-mt-24"
      style={{ zIndex: z }}
    >
      <motion.div
        className={cn(
          'sticky top-0 z-1 flex min-h-dvh flex-col overflow-hidden bg-background',
          dense ? 'py-16 md:py-20' : 'py-20 md:py-28',
          className,
        )}
        style={scrollOff ? undefined : { y, opacity, scale }}
      >
        {background != null && scrollOff ? (
          <div className="pointer-events-none absolute inset-0 z-0">{background}</div>
        ) : null}
        {background != null && !scrollOff ? (
          <SectionDecorParallax scrollYProgress={scrollYProgress} weak={weak}>
            {background}
          </SectionDecorParallax>
        ) : null}

        <div className="relative z-1 flex min-h-0 flex-1 flex-col">{children}</div>
      </motion.div>
    </section>
  )
}
