import { Link } from 'react-router-dom'
import { Container } from '@/components/ui/Container'
import { projects } from '@/data/projects'
import { cn } from '@/lib/cn'

export function ProjectsIndexPage() {
  return (
    <div className="py-14 md:py-20">
      <Container>
        <p className="text-muted font-mono text-[0.65rem] font-semibold tracking-[0.25em] uppercase">
          All projects
        </p>
        <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Work archive
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-base md:text-lg">
          Every case study in one place. Open a project for the full write-up, gallery, and stack.
        </p>

        <ul className="mt-12 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link
                to={`/projects/${p.slug}`}
                className={cn(
                  'group border-border/60 bg-foreground/2 block overflow-hidden rounded-2xl border',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                )}
              >
                <div className="relative aspect-video overflow-hidden bg-border/30">
                  <img
                    src={p.coverImage}
                    alt=""
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <p className="text-muted text-xs font-medium tabular-nums">{p.year}</p>
                  <h2 className="font-display mt-1 text-lg font-semibold tracking-tight text-foreground md:text-xl">
                    {p.title}
                  </h2>
                  <p className="text-muted mt-2 line-clamp-2 text-sm leading-relaxed">{p.shortDescription}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-muted mt-10 text-center text-sm">
          <Link to="/#projects" className="font-medium text-foreground underline-offset-4 hover:underline">
            Back to featured work
          </Link>
        </p>
      </Container>
    </div>
  )
}
