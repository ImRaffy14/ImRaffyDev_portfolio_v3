/** Set `VITE_STRIP_UI_MOTION=true` in `.env.local` to disable Framer/scroll-linked UI motion for profiling (HeroIDE WebGL unchanged). */
export const stripUiMotion = import.meta.env.VITE_STRIP_UI_MOTION === 'true'
