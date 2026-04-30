import { useCallback, useState } from 'react'
import type { CliGameId } from '@/lib/cli/cliGames'
import type { CliThemeClasses } from '@/lib/cli/cliThemes'
import { cn } from '@/lib/cn'
import { PongGame } from '@/components/cli/games/PongGame'
import { SnakeGame } from '@/components/cli/games/SnakeGame'
import { TetrisGame } from '@/components/cli/games/TetrisGame'

type Props = {
  id: CliGameId
  theme: CliThemeClasses
  onClose: () => void
}

const titles: Record<CliGameId, string> = {
  snake: 'Snake',
  pong: 'Pong',
  tetris: 'Tetris',
}

export function CliGameShell({ id, theme, onClose }: Props) {
  const [restartKey, setRestartKey] = useState(0)
  const bumpRestart = useCallback(() => setRestartKey((k) => k + 1), [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${titles[id]} mini-game`}
      className="absolute inset-0 z-50 flex flex-col bg-zinc-950/97 p-2 md:p-3"
      tabIndex={-1}
    >
      <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
        <span className={cn('font-mono text-xs tracking-wide', theme.system)}>{titles[id]}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={bumpRestart}
            className={cn(
              'rounded-md px-2 py-1 font-mono text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              theme.headerBtn,
            )}
          >
            Restart
          </button>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'rounded-md px-2 py-1 font-mono text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              theme.headerBtn,
            )}
          >
            Close
          </button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto">
        {id === 'snake' ? <SnakeGame onRestart={bumpRestart} restartKey={restartKey} /> : null}
        {id === 'pong' ? <PongGame onRestart={bumpRestart} restartKey={restartKey} /> : null}
        {id === 'tetris' ? <TetrisGame onRestart={bumpRestart} restartKey={restartKey} /> : null}
      </div>
      <p className={cn('mt-2 shrink-0 text-center font-mono text-[10px] md:text-[11px]', theme.system)}>
        Esc — shell · R — restart
      </p>
    </div>
  )
}
