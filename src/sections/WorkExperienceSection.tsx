import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { StackedSection } from '@/components/layout/StackedSection'
import { Container } from '@/components/ui/Container'
import { stripUiMotion } from '@/config/debugMotion'
import { experienceItems } from '@/data/experience'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  motionViewport,
  sectionEyebrowVariants,
  sectionTitleVariants,
  staggerContainer,
  timelineItemVariants,
} from '@/lib/motion'

export function WorkExperienceSection() {
  const reducedMotion = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start end', 'end start'],
  })
  const glowTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  if (stripUiMotion) {
    return (
      <StackedSection
        id="experience"
        stackIndex={2}
        aria-labelledby="experience-heading"
      >
        <Container>
          <div>
            <div className="text-muted mb-10 flex items-center gap-4 md:mb-12">
              <span className="shrink-0 text-xs font-semibold tracking-[0.2em] uppercase">
                Experience
              </span>
              <span className="bg-border/70 h-px min-w-12 flex-1" aria-hidden />
            </div>

            <h2
              id="experience-heading"
              className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl"
            >
              Work experience
            </h2>
          </div>

          <div className="relative mt-14 md:mt-16">
            <div
              className="bg-border/80 absolute top-2 bottom-2 left-[0.6rem] w-px md:left-[0.7rem]"
              aria-hidden
            />
            <ol className="relative list-none space-y-12 md:space-y-14">
              {experienceItems.map((item) => (
                <li key={item.id} className="relative min-w-0 pl-10 md:pl-12">
                  <div
                    className="border-background bg-accent ring-border/60 absolute top-1.5 left-[0.125rem] z-10 size-3 rounded-full border-2 shadow-sm ring-2 md:left-[0.2rem] md:size-3.5"
                    aria-hidden
                  />
                  <p className="text-muted text-xs font-medium tabular-nums tracking-wide uppercase">
                    {item.start} — {item.end}
                    {item.location ? ` · ${item.location}` : ''}
                  </p>
                  <h3 className="font-display mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {item.role}
                  </h3>
                  <p className="text-accent mt-0.5 text-base font-medium">{item.company}</p>
                  <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed md:text-base">
                    {item.summary}
                  </p>
                  {item.bullets && item.bullets.length > 0 ? (
                    <ul className="text-muted mt-4 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed md:text-base">
                      {item.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </StackedSection>
    )
  }

  return (
    <StackedSection
      id="experience"
      stackIndex={2}
      aria-labelledby="experience-heading"
    >
      <Container>
        <motion.div
          variants={staggerContainer(reducedMotion, 0.06, 0.02)}
          initial="hidden"
          whileInView="visible"
          viewport={motionViewport.workSection}
        >
          <motion.div
            className="text-muted mb-10 flex items-center gap-4 md:mb-12"
            variants={sectionEyebrowVariants(reducedMotion)}
          >
            <span className="shrink-0 text-xs font-semibold tracking-[0.2em] uppercase">
              Experience
            </span>
            <span className="bg-border/70 h-px min-w-12 flex-1" aria-hidden />
          </motion.div>

          <motion.h2
            id="experience-heading"
            className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl"
            variants={sectionTitleVariants(reducedMotion)}
          >
            Work experience
          </motion.h2>
        </motion.div>

        <div ref={trackRef} className="relative mt-14 md:mt-16">
          <div
            className="bg-border/80 absolute top-2 bottom-2 left-[0.6rem] w-px md:left-[0.7rem]"
            aria-hidden
          />
          {!reducedMotion ? (
            <motion.div
              className="pointer-events-none absolute top-2 bottom-2 left-[0.6rem] z-1 w-px md:left-[0.7rem]"
              aria-hidden
            >
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ top: glowTop }}
              >
                <div className="h-10 w-px rounded-full bg-accent blur-[2px] shadow-[0_0_14px_3px_var(--accent-muted),0_0_28px_10px_color-mix(in_srgb,var(--accent)_28%,transparent)]" />
              </motion.div>
            </motion.div>
          ) : null}
          <motion.ol
            className="relative list-none space-y-12 md:space-y-14"
            variants={staggerContainer(reducedMotion, reducedMotion ? 0 : 0.08, reducedMotion ? 0 : 0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={motionViewport.workTimeline}
          >
            {experienceItems.map((item) => (
              <motion.li
                key={item.id}
                className="relative min-w-0 pl-10 md:pl-12"
                variants={timelineItemVariants(reducedMotion)}
              >
                <div
                  className="border-background bg-accent ring-border/60 absolute top-1.5 left-[0.125rem] z-10 size-3 rounded-full border-2 shadow-sm ring-2 md:left-[0.2rem] md:size-3.5"
                  aria-hidden
                />
                <p className="text-muted text-xs font-medium tabular-nums tracking-wide uppercase">
                  {item.start} — {item.end}
                  {item.location ? ` · ${item.location}` : ''}
                </p>
                <h3 className="font-display mt-2 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  {item.role}
                </h3>
                <p className="text-accent mt-0.5 text-base font-medium">{item.company}</p>
                <p className="text-muted mt-3 max-w-2xl text-sm leading-relaxed md:text-base">
                  {item.summary}
                </p>
                {item.bullets && item.bullets.length > 0 ? (
                  <ul className="text-muted mt-4 max-w-2xl list-disc space-y-2 pl-5 text-sm leading-relaxed md:text-base">
                    {item.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </Container>
    </StackedSection>
  )
}
