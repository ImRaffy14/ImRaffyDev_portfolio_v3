import { motion } from 'framer-motion'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { stripUiMotion } from '@/config/debugMotion'
import { cn } from '@/lib/cn'
import { springCard } from '@/lib/motion'

type ProjectCardProps = {
  slug: string
  title: string
  shortDescription: string
  coverImage: string
  reducedMotion: boolean
}

export const ProjectCard = memo(function ProjectCard({
  slug,
  title,
  shortDescription,
  coverImage,
  reducedMotion,
}: ProjectCardProps) {
  const hover = !reducedMotion

  const card = (
    <Link
        to={`/projects/${slug}`}
        className={cn(
          'group border-border/60 bg-foreground/2 block h-full overflow-hidden rounded-2xl border',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        )}
      >
        <div className="relative aspect-video w-full overflow-hidden bg-border/30">
          <img
            src={coverImage}
            alt=""
            className={cn(
              'h-full w-full object-cover',
              hover &&
                'origin-center transition-[transform,opacity] duration-500 ease-out will-change-transform group-hover:scale-[1.03]',
            )}
            loading="lazy"
            decoding="async"
          />
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60',
              'transition-opacity duration-300 group-hover:opacity-90',
            )}
            aria-hidden
          />
          <div
            className={cn(
              'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
              'bg-background/25',
            )}
            aria-hidden
          />
        </div>
        <div className="p-5 md:p-6">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">
            {title}
          </h3>
          <p className="text-muted mt-2 line-clamp-3 text-sm leading-relaxed md:text-base">
            {shortDescription}
          </p>
        </div>
      </Link>
  )

  if (stripUiMotion) {
    return <div className="h-full">{card}</div>
  }

  return (
    <motion.div
      className="h-full"
      whileHover={hover ? { y: -4, scale: 1.02 } : undefined}
      transition={springCard}
    >
      {card}
    </motion.div>
  )
})
