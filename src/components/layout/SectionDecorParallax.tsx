import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { ReactNode } from 'react'

type SectionDecorParallaxProps = {
  scrollYProgress: MotionValue<number>
  weak: boolean
  children: ReactNode
}

/** Decor drifts with scroll (slower rate than shell exit) so depth reads clearly while scrolling. */
export function SectionDecorParallax({
  scrollYProgress,
  weak,
  children,
}: SectionDecorParallaxProps) {
  const end = weak ? 40 : 72
  const y = useTransform(scrollYProgress, [0, 1], [0, end])

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ y }}
      aria-hidden
    >
      {children}
    </motion.div>
  )
}
