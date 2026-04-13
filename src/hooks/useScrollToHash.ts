import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { scrollToSection } from '@/lib/scrollToSection'

/** When `location` is `/` with a hash, scroll to the matching section (retries for lazy-loaded DOM). */
export function useScrollToHash() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  useLayoutEffect(() => {
    if (pathname !== '/' || !hash || hash.length < 2) return
    const id = hash.slice(1)

    const scroll = () => scrollToSection(id, { lenis })

    if (scroll()) return
    const tid = window.setTimeout(() => scroll(), 450)
    return () => clearTimeout(tid)
  }, [pathname, hash, lenis])
}
