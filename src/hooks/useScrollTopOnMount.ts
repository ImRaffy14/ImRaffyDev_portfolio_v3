import { useLenis } from 'lenis/react'
import { useLayoutEffect } from 'react'

/** Run after the route has mounted (avoids scrolling while the previous page is still exiting). */
export function useScrollTopOnMount() {
  const lenis = useLenis()

  useLayoutEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true })
      return
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [lenis])
}
