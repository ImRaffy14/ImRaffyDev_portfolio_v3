import { motion } from 'framer-motion'
import { startTransition, useEffect, useState } from 'react'
import { stripUiMotion } from '@/config/debugMotion'
import { site } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { overlayExitTransition } from '@/lib/motion'

const STORAGE_KEY = 'imraffydev-load-seen'
const MAX_WAIT_MS = 1100

function hasSeenLoad() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function PageLoadOverlay() {
  const reducedMotion = usePrefersReducedMotion()
  const [phase, setPhase] = useState<'show' | 'exit' | 'gone'>(() => {
    if (hasSeenLoad()) return 'gone'
    if (stripUiMotion) {
      markSeen()
      return 'gone'
    }
    return 'show'
  })

  useEffect(() => {
    if (phase !== 'show') return

    if (reducedMotion || stripUiMotion) {
      markSeen()
      startTransition(() => setPhase('gone'))
      return
    }

    let cancelled = false

    const run = async () => {
      const cap = new Promise<void>((r) => setTimeout(r, MAX_WAIT_MS))
      const fonts = document.fonts?.ready ?? Promise.resolve()
      const loaded = new Promise<void>((r) => {
        if (document.readyState === 'complete') r()
        else window.addEventListener('load', () => r(), { once: true })
      })
      await Promise.race([fonts, loaded, cap])
      if (!cancelled) startTransition(() => setPhase('exit'))
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [phase, reducedMotion])

  if (phase === 'gone') return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background px-6"
      aria-hidden={phase === 'exit'}
      aria-busy={phase === 'show'}
      initial={{ opacity: 1 }}
      animate={phase === 'exit' ? { opacity: 0, scale: 0.985 } : { opacity: 1, scale: 1 }}
      transition={overlayExitTransition(reducedMotion)}
      onAnimationComplete={() => {
        if (phase === 'exit') {
          markSeen()
          startTransition(() => setPhase('gone'))
        }
      }}
    >
      <p className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        {site.name}
      </p>
      <div
        className="bg-accent/20 h-0.5 w-32 overflow-hidden rounded-full md:w-40"
        aria-hidden
      >
        <motion.div
          className="bg-accent h-full w-1/3 rounded-full"
          animate={{ x: ['-100%', '300%'] }}
          transition={{
            duration: reducedMotion ? 0 : 1.1,
            repeat: reducedMotion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </motion.div>
  )
}
