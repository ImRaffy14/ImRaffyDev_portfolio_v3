import { useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { RefObject } from 'react'

export function useHeroParallax(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  return useTransform(scrollYProgress, [0, 1], enabled ? [0, 36] : [0, 0])
}
