import type { Transition, Variants } from 'framer-motion'

/** whileInView presets — no `once`; animations replay on every enter/exit */
export const motionViewport = {
  aboutIntro: { amount: 0.12, margin: '-90px' },
  skillsPanel: { amount: 0.08, margin: '-87px' },
  contactSplitHeading: { amount: 0.35, margin: '-100px 0px' },
  workSection: { margin: '-100px', amount: 0.15 },
  workTimeline: { amount: 0.09, margin: '-10%' },
  contactColumnPrimary: { margin: '-60px', amount: 0.15 },
  standard: { margin: '-40px', amount: 0.12 },
  projectDetail: { amount: 0.12, margin: '-8%' },
} as const

/** Primary site easing — matches section components */
export const ease = [0.22, 1, 0.36, 1] as const

export const duration = {
  page: 0.36,
  pageReduced: 0.12,
  overlay: 0.45,
  overlayReduced: 0.08,
} as const

/** Springs: GPU-friendly, no linear motion */
export const springReveal = {
  type: 'spring',
  stiffness: 320,
  damping: 38,
  mass: 0.88,
} as const satisfies Transition

export const springGentle = {
  type: 'spring',
  stiffness: 280,
  damping: 34,
} as const satisfies Transition

export const springHover = {
  type: 'spring',
  stiffness: 420,
  damping: 30,
} as const satisfies Transition

export const springCard = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
} as const satisfies Transition

export function pageVariants(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 1, y: 0 },
    }
  }
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }
}

export function pageTransition(reducedMotion: boolean) {
  return {
    duration: reducedMotion ? duration.pageReduced : duration.page,
    ease,
  } as const
}

export function overlayExitTransition(reducedMotion: boolean) {
  return {
    duration: reducedMotion ? duration.overlayReduced : duration.overlay,
    ease,
  } as const
}

/** Section eyebrow / label row */
export function sectionEyebrowVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 12, scale: reduced ? 1 : 1.01 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: reduced ? { duration: 0.12, ease } : springReveal,
    },
  }
}

/** Section h2 */
export function sectionTitleVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 22, scale: reduced ? 1 : 1.02 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: reduced ? { duration: 0.14, ease } : springReveal,
    },
  }
}

/** Section intro copy */
export function sectionLeadVariants(reduced: boolean, delay = 0): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduced
        ? { duration: 0.12, ease, delay }
        : { ...springGentle, delay },
    },
  }
}

/** Stagger wrapper for lists / paragraphs */
export function staggerContainer(reduced: boolean, stagger = 0.07, delayChildren = 0.04): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delayChildren,
      },
    },
  }
}

export function staggerItem(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 18, scale: reduced ? 1 : 0.99 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: reduced ? { duration: 0.14, ease } : springGentle,
    },
  }
}

/** Timeline rows — enter (parent uses staggerContainer + single whileInView) */
export function timelineItemVariants(reduced: boolean): Variants {
  return {
    hidden: {
      opacity: 0,
      x: reduced ? 0 : -12,
      y: reduced ? 0 : 8,
      scale: reduced ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: reduced ? { duration: 0.12, ease } : springGentle,
    },
  }
}

/** Project grid cards — enter */
export function cardEnterVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 26, scale: reduced ? 1 : 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: reduced ? { duration: 0.16, ease } : springReveal,
    },
  }
}

/** Hero “scene” — optional exit when scrolling away (once: false) */
export function heroSectionVariants(reduced: boolean): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 1, y: 0, scale: 1 },
      visible: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 1, y: 0, scale: 1 },
    }
  }
  return {
    hidden: { opacity: 0.4, y: 24, scale: 0.99 },
    visible: { opacity: 1, y: 0, scale: 1, transition: springReveal },
    exit: {
      opacity: 0.5,
      y: 18,
      scale: 0.995,
      transition: { duration: 0.4, ease },
    },
  }
}
