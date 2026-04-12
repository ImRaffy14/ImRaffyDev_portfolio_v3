import { useMemo } from 'react'

/** Skip mounting WebGL for save-data preference or very constrained devices. */
export function useHeroIdeSkipWebGL(): boolean {
  return useMemo(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-data: reduce)').matches)
      return true
    const cores = navigator.hardwareConcurrency
    if (typeof cores === 'number' && cores <= 2) return true
    const mem = (
      navigator as Navigator & { deviceMemory?: number }
    ).deviceMemory
    if (typeof mem === 'number' && mem <= 4) return true
    return false
  }, [])
}
