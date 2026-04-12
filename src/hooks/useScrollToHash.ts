import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { LENIS_ANCHOR_OFFSET } from '@/components/layout/SmoothScrollRoot'

/** When `location` is `/` with a hash, scroll to the matching section (retries for lazy-loaded DOM). */
export function useScrollToHash() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  useLayoutEffect(() => {
    if (pathname !== '/' || !hash || hash.length < 2) return
    const id = hash.slice(1)

    const scroll = () => {
      const el = document.getElementById(id)
      if (!el) return false
      if (lenis) {
        lenis.scrollTo(el, { offset: LENIS_ANCHOR_OFFSET, duration: 1.15 })
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return true
    }

    if (scroll()) return
    const tid = window.setTimeout(() => scroll(), 450)
    return () => clearTimeout(tid)
  }, [pathname, hash, lenis])
}
