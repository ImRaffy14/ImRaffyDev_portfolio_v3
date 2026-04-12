import { useSyncExternalStore } from 'react'
import { COVER_BREAKPOINT } from '@/config/coverSections'
import { useCoarsePointer } from '@/hooks/useCoarsePointer'

function subscribeCompact(cb: () => void) {
  const mq = window.matchMedia(COVER_BREAKPOINT)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

function getCompact(): boolean {
  return window.matchMedia(COVER_BREAKPOINT).matches
}

export function useCoverMotionWeak() {
  const coarse = useCoarsePointer()
  const compact = useSyncExternalStore(
    subscribeCompact,
    getCompact,
    () => false,
  )
  return compact || coarse
}
