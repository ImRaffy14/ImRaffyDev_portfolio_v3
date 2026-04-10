import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { site } from '@/data/site'

type LayoutProps = {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="border-border/60 sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md dark:border-border/50 dark:bg-background/70">
        <Container className="flex h-14 items-center justify-between gap-4 md:h-16">
          <span className="font-display text-sm font-semibold tracking-tight md:text-base">
            {site.name}
          </span>
          <div className="flex items-center gap-3">
            <nav className="text-muted hidden text-xs sm:block md:text-sm" aria-label="Primary">
              <span className="opacity-70">Menu soon</span>
            </nav>
            <ThemeToggle />
          </div>
        </Container>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-border border-t py-8">
        <Container>
          <p className="text-muted text-center text-sm">
            © {new Date().getFullYear()} {site.name}
          </p>
        </Container>
      </footer>
    </div>
  )
}
