import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { scrollToSection } from '@/lib/scrollToSection'

const MAX_ATTEMPTS = 80

/** When `location` is `/` with a hash, scroll to the matching section (retries for lazy-loaded DOM). */
export function useScrollToHash() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  useLayoutEffect(() => {
    if (pathname !== '/' || !hash || hash.length < 2) return
    const id = hash.slice(1)
    let cancelled = false
    let attempts = 0
    let tid: ReturnType<typeof setTimeout>

    const tick = () => {
      if (cancelled) return
      if (scrollToSection(id, { lenis })) return
      attempts += 1
      if (attempts >= MAX_ATTEMPTS) return
      tid = window.setTimeout(tick, 40 + Math.min(attempts * 3, 120))
    }

    tick()
    return () => {
      cancelled = true
      clearTimeout(tid)
    }
  }, [pathname, hash, lenis])
}
