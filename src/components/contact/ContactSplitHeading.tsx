import { motion } from 'framer-motion'
import { stripUiMotion } from '@/config/debugMotion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'
import { motionViewport } from '@/lib/motion'

const ease = [0.22, 1, 0.36, 1] as const

const lineParent = {
  hidden: {},
  visible: (delay: number) => ({
    transition: { staggerChildren: 0.055, delayChildren: delay },
  }),
}

const wordChild = {
  hidden: { opacity: 0, y: '110%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease },
  },
}

function WordLine({
  text,
  className,
  delay,
  animate,
}: {
  text: string
  className: string
  delay: number
  animate: boolean
}) {
  const words = text.split(' ')

  if (!animate) {
    return <span className={cn('block', className)}>{text}</span>
  }

  return (
    <motion.span
      className="block"
      variants={lineParent}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={motionViewport.contactSplitHeading}
    >
      <span className={cn('flex flex-wrap', className)}>
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-0.5">
            <motion.span variants={wordChild} className="inline-block pr-[0.22em]">
              {w}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.span>
  )
}

type ContactSplitHeadingProps = {
  id?: string
  line1: string
  line2: string
  className?: string
}

/** Split-word entrance (React Bits SplitText-style) without GSAP Club SplitText. */
export function ContactSplitHeading({ id, line1, line2, className }: ContactSplitHeadingProps) {
  const reducedMotion = usePrefersReducedMotion()
  const animate = !stripUiMotion && !reducedMotion
  const line1Words = line1.split(' ').length
  const line2Delay = animate ? 0.06 + line1Words * 0.055 : 0

  return (
    <h2
      id={id}
      className={cn(
        'font-display mt-6 max-w-xl text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.05] tracking-tight',
        className,
      )}
    >
      <WordLine text={line1} className="text-foreground" delay={0.06} animate={animate} />
      <WordLine
        text={line2}
        className="text-muted mt-1 md:mt-2"
        delay={line2Delay}
        animate={animate}
      />
    </h2>
  )
}
