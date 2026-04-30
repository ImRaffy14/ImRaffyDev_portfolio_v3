import { useLenis } from 'lenis/react'
import { useCallback } from 'react'
import { scrollToSection } from '@/lib/scrollToSection'

/** Smooth scroll to hash on home when Lenis is active; otherwise native behavior. */
export function useLenisHashClick() {
  const lenis = useLenis()

  return useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute('href') ?? ''
      if (!lenis) return

      let id: string | null = null
      if (href.startsWith('/#')) {
        if (window.location.pathname !== '/') return
        id = href.slice(2)
      } else if (href.startsWith('#') && href.length > 1) {
        if (window.location.pathname !== '/') return
        id = href.slice(1)
      }
      if (!id) return

      e.preventDefault()
      scrollToSection(id, { lenis })
    },
    [lenis],
  )
}
