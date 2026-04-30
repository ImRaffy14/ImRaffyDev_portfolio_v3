import { type RefObject, useEffect, useState } from 'react'

/** True when the hero 3D surface is visible in the viewport and the document tab is active. */
export function useHeroIdeSurfaceActive(
  ref: RefObject<Element | null | undefined>,
): boolean {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let ioIntersecting = false

    const sync = () => {
      const vis = document.visibilityState === 'visible'
      const next = ioIntersecting && vis
      setActive((prev) => (prev === next ? prev : next))
    }

    const io = new IntersectionObserver(
      ([e]) => {
        ioIntersecting = e?.isIntersecting ?? false
        sync()
      },
      { root: null, rootMargin: '64px 0px', threshold: 0 },
    )
    io.observe(el)
    requestAnimationFrame(sync)

    const onVis = () => sync()
    document.addEventListener('visibilitychange', onVis)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [ref])

  return active
}
