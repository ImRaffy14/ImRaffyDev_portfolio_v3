import {
  cliAbout,
  cliContact,
  cliExperience,
  cliHelpLines,
  cliProjects,
} from '@/data/cliContent'
import type { CommandContext, CommandHandler, CommandResult } from '@/lib/cli/types'

const commands: Record<string, CommandHandler> = {
  about: (_ctx) => ({ type: 'lines', lines: [...cliAbout.lines] }),
  projects: (_ctx) => ({ type: 'lines', lines: [...cliProjects.lines] }),
  experience: (_ctx) => ({ type: 'lines', lines: [...cliExperience.lines] }),
  contact: (_ctx) => ({ type: 'lines', lines: [...cliContact.lines] }),
  help: (_ctx) => ({ type: 'lines', lines: cliHelpLines() }),
  exit: (_ctx) => ({
    type: 'navigate',
    to: '/',
    message: 'Returning to portfolio…',
  }),
}

export function runCommand(name: string, ctx: CommandContext): CommandResult {
  const handler = commands[name]
  if (!handler) {
    return {
      type: 'lines',
      lines: [
        `command not found: ${name}`,
        'Type `help` for available commands.',
      ],
    }
  }
  return handler(ctx)
}
