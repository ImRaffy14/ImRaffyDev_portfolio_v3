import { Terminal } from '@/components/cli/Terminal'
import { Container } from '@/components/ui/Container'

export function CliPage() {
  return (
    <section className="flex min-h-0 flex-1 flex-col py-6 md:py-10">
      <Container className="flex min-h-0 flex-1 flex-col gap-4">
        <header>
          <h1 className="font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">CLI</h1>
          <p className="text-muted mt-1 text-sm md:text-base">
            Interactive terminal — try <code className="font-mono text-foreground/90">help</code>.
          </p>
        </header>
        <Terminal />
      </Container>
    </section>
  )
}
