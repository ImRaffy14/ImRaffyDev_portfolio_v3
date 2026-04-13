import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

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
