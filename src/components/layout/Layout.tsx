import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NavMenuOverlay, NavMenuTrigger } from '@/components/layout/NavMenuOverlay'
import { PageLoadOverlay } from '@/components/layout/PageLoadOverlay'
import { SocialDock } from '@/components/layout/SocialDock'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Container } from '@/components/ui/Container'
import { site } from '@/data/site'

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <PageLoadOverlay />
      <SocialDock />
      <NavMenuOverlay open={navOpen} onClose={() => setNavOpen(false)} />
      <header className="border-border/60 sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md dark:border-border/50 dark:bg-background/70">
        <Container className="flex h-14 items-center justify-between gap-4 md:h-16">
          <Link
            to="/"
            onClick={() => setNavOpen(false)}
            className="font-display text-sm font-semibold tracking-tight text-foreground md:text-base"
          >
            {site.name}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NavMenuTrigger
              open={navOpen}
              onOpen={() => setNavOpen(true)}
              onClose={() => setNavOpen(false)}
            />
          </div>
        </Container>
      </header>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>

      <footer className="py-7">
        <Container>
          <p className="text-muted text-center text-sm">
            © {new Date().getFullYear()} {site.name}
          </p>
        </Container>
      </footer>
    </div>
  )
}
