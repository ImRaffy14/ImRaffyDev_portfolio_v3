import { ArrowUpRight, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactSocialRow } from '@/components/contact/ContactSocialRow'
import { ContactSplitHeading } from '@/components/contact/ContactSplitHeading'
import { StackedSection } from '@/components/layout/StackedSection'
import { Container } from '@/components/ui/Container'
import { stripUiMotion } from '@/config/debugMotion'
import { site } from '@/data/site'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  motionViewport,
  sectionEyebrowVariants,
  sectionLeadVariants,
  staggerContainer,
  staggerItem,
} from '@/lib/motion'

const featuredWorkBackground = (
  <div className="relative min-h-full w-full">
    <div className="from-accent/8 absolute inset-0 bg-linear-to-bl via-transparent to-transparent dark:from-accent/5" />
    <div className="bg-foreground/3 dark:bg-foreground/5 absolute bottom-[12%] -left-[10%] h-[min(38vh,320px)] w-[min(42vw,340px)] rounded-full" />
  </div>
)

export function ContactSection() {
  const reducedMotion = usePrefersReducedMotion()
  const { eyebrow, headlineLine1, headlineLine2, intro, formEyebrow } = site.contact

  const rightHeader = (
    <div className="text-muted grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-border/50 pb-6">
      <Mail className="size-5 shrink-0 text-foreground/70" aria-hidden />
      <span className="font-mono text-center text-[0.65rem] font-semibold tracking-[0.22em] uppercase">
        {formEyebrow}
      </span>
      <ArrowUpRight className="size-5 shrink-0 opacity-50" aria-hidden />
    </div>
  )

  if (stripUiMotion) {
    return (
      <StackedSection
        id="contact"
        stackIndex={3}
        dense
        aria-labelledby="contact-heading"
        background={featuredWorkBackground}
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">
            <div className="min-w-0">
              <div className="text-muted flex items-center gap-4">
                <span className="shrink-0 font-mono text-[0.65rem] font-semibold tracking-[0.25em] uppercase">
                  {eyebrow}
                </span>
                <span className="bg-border/60 h-px min-w-8 flex-1" aria-hidden />
              </div>
              <ContactSplitHeading
                id="contact-heading"
                line1={headlineLine1}
                line2={headlineLine2}
              />
              <p className="text-muted mt-6 max-w-md text-sm leading-relaxed md:text-base">
                {intro}
              </p>
              <ContactSocialRow className="mt-10" />
            </div>
            <div className="min-w-0 pt-10 lg:pt-0">
              {rightHeader}
              <ContactForm className="mx-auto mt-8 max-w-none" />
            </div>
          </div>
        </Container>
      </StackedSection>
    )
  }

  return (
    <StackedSection
      id="contact"
      stackIndex={3}
      dense
      aria-labelledby="contact-heading"
      background={featuredWorkBackground}
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20">
          <motion.div
            className="min-w-0"
            variants={staggerContainer(reducedMotion, 0.07, 0.04)}
            initial="hidden"
            whileInView="visible"
            viewport={motionViewport.contactColumnPrimary}
          >
            <motion.div
              className="text-muted flex items-center gap-4"
              variants={sectionEyebrowVariants(reducedMotion)}
            >
              <span className="shrink-0 font-mono text-[0.65rem] font-semibold tracking-[0.25em] uppercase">
                {eyebrow}
              </span>
              <span className="bg-border/60 h-px min-w-8 flex-1" aria-hidden />
            </motion.div>
            <ContactSplitHeading
              id="contact-heading"
              line1={headlineLine1}
              line2={headlineLine2}
            />
            <motion.p
              className="text-muted mt-6 max-w-md text-sm leading-relaxed md:text-base"
              variants={sectionLeadVariants(reducedMotion, reducedMotion ? 0 : 0.08)}
            >
              {intro}
            </motion.p>
            <motion.div variants={staggerItem(reducedMotion)} className="mt-10">
              <ContactSocialRow />
            </motion.div>
          </motion.div>

          <motion.div
            className="min-w-0 pt-10 lg:pt-0"
            variants={staggerItem(reducedMotion)}
            initial="hidden"
            whileInView="visible"
            viewport={motionViewport.standard}
          >
            {rightHeader}
            <ContactForm className="mx-auto mt-8 max-w-none" />
          </motion.div>
        </div>
      </Container>
    </StackedSection>
  )
}
