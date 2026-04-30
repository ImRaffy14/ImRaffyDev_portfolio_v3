import { motion } from 'framer-motion'
import { stripUiMotion } from '@/config/debugMotion'
import { about } from '@/data/about'
import {
  motionViewport,
  sectionEyebrowVariants,
  sectionLeadVariants,
  sectionTitleVariants,
  staggerContainer,
  staggerItem,
} from '@/lib/motion'

type AboutIntroProps = {
  reducedMotion: boolean
}

export function AboutIntro({ reducedMotion }: AboutIntroProps) {
  if (stripUiMotion) {
    return (
      <div className="flex w-full max-w-xl flex-col justify-center lg:justify-start lg:self-start">
        <div className="text-muted mb-6 flex items-center gap-4">
          <span className="shrink-0 text-xs font-semibold tracking-[0.2em] uppercase">
            {about.title}
          </span>
          <span className="bg-border/70 h-px min-w-12 flex-1" aria-hidden />
        </div>
        <h2
          id="about-heading"
          className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl"
        >
          {about.title}
        </h2>
        <p className="text-accent mt-3 text-lg font-medium md:text-xl">{about.subtitle}</p>
        <div className="mt-6 space-y-4 md:mt-8 md:space-y-5">
          {about.paragraphs.map((p, i) => (
            <p key={i} className="text-muted text-[0.95rem] leading-relaxed md:text-lg">
              {p}
            </p>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="flex w-full max-w-xl flex-col justify-center lg:justify-start lg:self-start"
      variants={staggerContainer(reducedMotion, 0.07, 0.02)}
      initial="hidden"
      whileInView="visible"
      viewport={motionViewport.aboutIntro}
    >
      <motion.div
        className="text-muted mb-6 flex items-center gap-4"
        variants={sectionEyebrowVariants(reducedMotion)}
      >
        <span className="shrink-0 text-xs font-semibold tracking-[0.2em] uppercase">
          {about.title}
        </span>
        <span className="bg-border/70 h-px min-w-12 flex-1" aria-hidden />
      </motion.div>
      <motion.h2
        id="about-heading"
        className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl"
        variants={sectionTitleVariants(reducedMotion)}
      >
        {about.title}
      </motion.h2>
      <motion.p
        className="text-accent mt-3 text-lg font-medium md:text-xl"
        variants={sectionLeadVariants(reducedMotion, reducedMotion ? 0 : 0.04)}
      >
        {about.subtitle}
      </motion.p>
      <motion.div
        className="mt-6 space-y-4 md:mt-8 md:space-y-5"
        variants={staggerContainer(reducedMotion, 0.08, 0.06)}
      >
        {about.paragraphs.map((p, i) => (
          <motion.p
            key={i}
            className="text-muted text-[0.95rem] leading-relaxed md:text-lg"
            variants={staggerItem(reducedMotion)}
            custom={i}
          >
            {p}
          </motion.p>
        ))}
      </motion.div>
    </motion.div>
  )
}
