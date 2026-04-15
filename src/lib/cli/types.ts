import type { NavigateFunction } from 'react-router-dom'

export type TranscriptEntry = {
  id: string
  kind: 'input' | 'output' | 'system'
  text: string
}

export type CommandResult =
  | { type: 'lines'; lines: string[] }
  | { type: 'navigate'; to: string; message?: string }

export type CommandContext = {
  navigate: NavigateFunction
}

export type CommandHandler = (ctx: CommandContext) => CommandResult
