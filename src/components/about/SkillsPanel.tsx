import { motion, type Variants } from 'framer-motion'
import { useMemo, useState } from 'react'
import { stripUiMotion } from '@/config/debugMotion'
import {
  skillGroups,
  skillIconFallbackSrc,
  skillIconMonoSrc,
  skillIconSrc,
} from '@/data/about'
// import { useTheme } from '@/hooks/useTheme'
import {
  ease,
  motionViewport,
  sectionEyebrowVariants,
  springGentle,
  springHover,
  staggerContainer,
  staggerItem,
} from '@/lib/motion'

type SkillsPanelProps = {
  reducedMotion: boolean
}

function rowChipsVariants(reduced: boolean): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : 0.035,
        delayChildren: reduced ? 0 : 0.06,
      },
    },
  }
}

function skillRowVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduced
        ? { duration: 0.12, ease }
        : {
            ...springGentle,
            staggerChildren: 0.05,
            delayChildren: 0.02,
          },
    },
  }
}

function rowLabelVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, x: reduced ? 0 : -8 },
    visible: {
      opacity: 1,
      x: 0,
      transition: reduced ? { duration: 0.1, ease } : springGentle,
    },
  }
}

function SkillChip({
  name,
  slug,
  reducedMotion,
  variants,
}: {
  name: string
  slug: string
  reducedMotion: boolean
  variants: Variants
}) {
  // const { theme } = useTheme()
  const [attempt, setAttempt] = useState(0)
  const isDark = false // theme === 'dark'

  const src = useMemo(() => {
    const order = isDark
      ? [
          skillIconMonoSrc(slug, true),
          skillIconSrc(slug),
          skillIconFallbackSrc(slug),
        ]
      : [
          skillIconSrc(slug),
          skillIconMonoSrc(slug, false),
          skillIconFallbackSrc(slug),
        ]
    return order[Math.min(attempt, 2)]!
  }, [attempt, slug, isDark])

  const useFileFallback = attempt >= 2

  const inner = (
    <>
      <img
        key={`${slug}-${attempt}`}
        src={src}
        alt=""
        title={name}
        width={24}
        height={24}
        className={`h-6 w-6 max-w-none shrink-0 object-contain ${useFileFallback ? 'dark:invert' : ''}`}
        loading="lazy"
        decoding="async"
        onError={() => setAttempt((a) => (a < 2 ? a + 1 : a))}
      />
      <span className="text-foreground max-w-[9.5rem] break-words text-[0.65rem] leading-tight font-semibold uppercase tracking-wide sm:max-w-[11rem] md:max-w-none md:text-xs">
        {name}
      </span>
    </>
  )

  if (stripUiMotion) {
    return (
      <li
        aria-label={name}
        className="flex min-w-0 items-center gap-2"
      >
        {inner}
      </li>
    )
  }

  return (
    <motion.li
      variants={variants}
      aria-label={name}
      className="flex min-w-0 items-center gap-2"
      whileHover={reducedMotion ? undefined : { y: -2 }}
      transition={springHover}
    >
      {inner}
    </motion.li>
  )
}

export function SkillsPanel({ reducedMotion }: SkillsPanelProps) {
  const cVariants = staggerItem(reducedMotion)
  const rowChipV = rowChipsVariants(reducedMotion)
  const rowV = skillRowVariants(reducedMotion)
  const labelV = rowLabelVariants(reducedMotion)

  if (stripUiMotion) {
    return (
      <div className="w-full min-w-0 text-left">
        <div className="text-muted mb-8 flex items-center gap-4 lg:mb-6">
          <span className="shrink-0 text-xs font-semibold tracking-[0.2em] uppercase">
            Skills
          </span>
          <span className="bg-border/70 h-px min-w-12 flex-1" aria-hidden />
        </div>

        <div className="flex flex-col gap-8 md:gap-10 lg:gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.id}
              className="flex flex-col items-start gap-3 sm:flex-row sm:gap-x-5 md:gap-x-8"
            >
              <h3 className="text-foreground/85 w-full shrink-0 text-left text-base font-bold tracking-[0.12em] uppercase sm:w-[7.25rem] sm:pt-0.5 md:w-32 md:text-lg">
                {group.label}
              </h3>
              <ul
                className="flex w-full min-w-0 flex-1 flex-wrap content-start justify-start gap-x-4 gap-y-3 sm:gap-x-5 sm:gap-y-4"
                role="list"
              >
                {group.skills.map((s) => (
                  <SkillChip
                    key={`${group.id}-${s.slug}`}
                    name={s.name}
                    slug={s.slug}
                    reducedMotion={reducedMotion}
                    variants={cVariants}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="w-full min-w-0 text-left"
      variants={staggerContainer(reducedMotion, 0.06, 0.03)}
      initial="hidden"
      whileInView="visible"
      viewport={motionViewport.skillsPanel}
    >
      <motion.div
        className="text-muted mb-8 flex items-center gap-4 lg:mb-6"
        variants={sectionEyebrowVariants(reducedMotion)}
      >
        <span className="shrink-0 text-xs font-semibold tracking-[0.2em] uppercase">
          Skills
        </span>
        <span className="bg-border/70 h-px min-w-12 flex-1" aria-hidden />
      </motion.div>

      <motion.div
        className="flex flex-col gap-8 md:gap-10 lg:gap-6"
        variants={staggerContainer(reducedMotion, 0.06, 0.04)}
      >
        {skillGroups.map((group) => (
          <motion.div
            key={group.id}
            className="flex flex-col items-start gap-3 sm:flex-row sm:gap-x-5 md:gap-x-8"
            variants={rowV}
          >
            <motion.h3
              className="text-foreground/85 w-full shrink-0 text-left text-base font-bold tracking-[0.12em] uppercase sm:w-[7.25rem] sm:pt-0.5 md:w-32 md:text-lg"
              variants={labelV}
            >
              {group.label}
            </motion.h3>
            <motion.ul
              className="flex w-full min-w-0 flex-1 flex-wrap content-start justify-start gap-x-4 gap-y-3 sm:gap-x-5 sm:gap-y-4"
              role="list"
              variants={rowChipV}
            >
              {group.skills.map((s) => (
                <SkillChip
                  key={`${group.id}-${s.slug}`}
                  name={s.name}
                  slug={s.slug}
                  reducedMotion={reducedMotion}
                  variants={cVariants}
                />
              ))}
            </motion.ul>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
