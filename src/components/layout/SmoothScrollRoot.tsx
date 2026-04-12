import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/** Matches `scroll-padding-top` in index.css (sticky header clearance). */
export const LENIS_ANCHOR_OFFSET = -88

type SmoothScrollRootProps = {
  children: ReactNode
}

export function SmoothScrollRoot({ children }: SmoothScrollRootProps) {
  const reducedMotion = usePrefersReducedMotion()

  if (reducedMotion) {
    return children
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.05,
        syncTouch: true,
        syncTouchLerp: 0.08,
      }}
    >
      {children}
    </ReactLenis>
  )
}
