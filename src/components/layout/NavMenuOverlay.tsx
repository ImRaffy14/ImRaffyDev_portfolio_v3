import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { stripUiMotion } from '@/config/debugMotion'
import { site } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

export const SITE_NAV_MENU_ID = 'site-primary-nav-menu'

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contacts' },
] as const

export function NavMenuTrigger({
  open,
  onOpen,
  onClose,
}: {
  open: boolean
  onOpen: () => void
  onClose: () => void
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={SITE_NAV_MENU_ID}
      aria-label={open ? 'Close menu' : 'Open menu'}
      onClick={() => (open ? onClose() : onOpen())}
      className="text-foreground hover:bg-foreground/5 flex size-11 items-center justify-center rounded-lg border border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {open ? (
        <X className="size-5" strokeWidth={1.75} aria-hidden />
      ) : (
        <Menu className="size-5" strokeWidth={1.75} aria-hidden />
      )}
    </button>
  )
}

type NavMenuOverlayProps = {
  open: boolean
  onClose: () => void
}

export function NavMenuOverlay({ open, onClose }: NavMenuOverlayProps) {
  const reducedMotion = usePrefersReducedMotion()
  const navigate = useNavigate()
  const { pathname, hash } = useLocation()

  const motionOk = !stripUiMotion && !reducedMotion

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const go = (sectionId: (typeof sections)[number]['id']) => {
    onClose()
    navigate({ pathname: '/', hash: `#${sectionId}` }, { replace: pathname === '/' })
  }

  const isActive = (sectionId: string) => {
    if (sectionId === 'projects' && pathname.startsWith('/projects')) return true
    if (pathname !== '/') return false
    if (sectionId === 'hero') return hash === '' || hash === '#hero'
    return hash === `#${sectionId}`
  }

  const inner = (
    <>
      <div
        className="absolute inset-0 bg-[#f4f1ea]/93 backdrop-blur-xl dark:bg-zinc-950/93"
        aria-hidden
      />

      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex justify-end p-5 md:p-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="text-foreground/80 hover:text-foreground flex size-11 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <X className="size-5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>

        <nav
          className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 px-6 pb-16"
          aria-label="Primary"
        >
          {sections.map((item, i) => {
            const active = isActive(item.id)
            const btn = (
              <button
                type="button"
                onClick={() => go(item.id)}
                className={cn(
                  'font-display relative py-2 text-4xl font-bold tracking-[0.12em] uppercase transition-colors sm:text-5xl md:text-6xl',
                  active ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/70',
                )}
              >
                {item.label}
                {active ? (
                  <span
                    className="bg-foreground absolute bottom-0 left-0 right-0 mx-auto h-px max-w-[min(100%,12rem)]"
                    aria-hidden
                  />
                ) : null}
              </button>
            )

            if (!motionOk) {
              return <div key={item.id}>{btn}</div>
            }

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.1 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {btn}
              </motion.div>
            )
          })}

          {motionOk ? (
            <motion.div
              className="mt-10 flex w-full max-w-sm flex-col items-center gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="bg-foreground/15 h-px w-full max-w-48" aria-hidden />
              <p className="text-foreground/50 font-display text-sm font-semibold tracking-tight">
                {site.name}
              </p>
            </motion.div>
          ) : (
            <div className="mt-10 flex w-full max-w-sm flex-col items-center gap-4">
              <span className="bg-foreground/15 h-px w-full max-w-48" aria-hidden />
              <p className="text-foreground/50 font-display text-sm font-semibold tracking-tight">
                {site.name}
              </p>
            </div>
          )}
        </nav>
      </div>
    </>
  )

  const portal = (
    <AnimatePresence>
      {open ? (
        motionOk ? (
          <motion.div
            key="nav-overlay"
            id={SITE_NAV_MENU_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-100 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            {inner}
          </motion.div>
        ) : (
          <div
            key="nav-overlay-static"
            id={SITE_NAV_MENU_ID}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-100 flex flex-col"
          >
            {inner}
          </div>
        )
      ) : null}
    </AnimatePresence>
  )

  return createPortal(portal, document.body)
}
