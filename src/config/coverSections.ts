/**
 * Viewport model (Approach A): outer `<section>` uses `min-h-dvh` so each scene is at least
 * one full viewport while content can grow taller—no clipping or nested scroll inside sections.
 * Cinematic overlap comes from sticky shells + z-index, not fixed `h-dvh` panels.
 *
 * Sticky cover sections: monotonic z below Layout header (`z-20`). Hero stays `z-[1]`.
 */
export const COVER_Z_BASE = 10
export const COVER_Z_STEP = 1

export const COVER_BREAKPOINT = '(max-width: 767px)'

/** Ease-out cubic on clamped scroll segment → shell exit accelerates late, feels smoother. */
export function coverShellEase(t: number): number {
  const x = Math.min(1, Math.max(0, t))
  return 1 - (1 - x) ** 3
}
