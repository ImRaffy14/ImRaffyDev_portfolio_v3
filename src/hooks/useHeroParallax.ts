import { useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { RefObject } from 'react'

/** Element-scoped `useScroll` tracks layout vs the target ref, so parallax stays correct with Lenis (no reliance on raw window scroll alone). */

export function useHeroParallax(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  return useTransform(scrollYProgress, [0, 1], enabled ? [0, 56] : [0, 0])
}
