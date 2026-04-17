import type { NavigateFunction } from 'react-router-dom'
import type { CliGameId } from '@/lib/cli/cliGames'
import type { CliThemeId } from '@/lib/cli/cliThemes'

export type TranscriptEntry = {
  id: string
  kind: 'input' | 'output' | 'system' | 'ascii'
  text: string
}

export type CommandResult =
  | { type: 'lines'; lines: string[] }
  | { type: 'navigate'; to: string; message?: string }
  | { type: 'close' }
  | { type: 'clear' }
  | { type: 'theme'; theme: CliThemeId }
  | { type: 'game'; id: CliGameId }

export type CommandContext = {
  navigate: NavigateFunction
  embedded?: boolean
  args?: string[]
}

export type CommandHandler = (ctx: CommandContext) => CommandResult
