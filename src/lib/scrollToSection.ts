import type Lenis from 'lenis'

const DURATION = 1.15

type ScrollToSectionOpts = {
  lenis: Lenis | null | undefined
  extraOffset?: number
}

/** Hash / in-page nav: Lenis uses html scroll-padding + target scroll-margin; avoid duplicate programmatic offset. */
export function scrollToSection(id: string, { lenis, extraOffset = 0 }: ScrollToSectionOpts) {
  const el = document.getElementById(id)
  if (!el) return false

  if (lenis) {
    lenis.scrollTo(el, {
      offset: extraOffset,
      duration: DURATION,
    })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return true
}
