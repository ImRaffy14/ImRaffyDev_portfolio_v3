import {
  cliAbout,
  cliContact,
  cliExperience,
  cliHelpLines,
  cliProjects,
} from '@/data/cliContent'
import { CLI_GAME_IDS } from '@/lib/cli/cliGames'
import { CLI_THEME_IDS, isCliThemeId } from '@/lib/cli/cliThemes'
import type { CliGameId } from '@/lib/cli/cliGames'
import type { CommandContext, CommandHandler, CommandResult } from '@/lib/cli/types'

function gameLaunch(id: CliGameId): CommandResult {
  return { type: 'game', id }
}

function themeCommand(ctx: CommandContext): CommandResult {
  const sub = ctx.args?.[0]?.toLowerCase()
  if (!sub || sub === 'list') {
    return {
      type: 'lines',
      lines: [
        'Themes:',
        ...CLI_THEME_IDS.map((id) => `  ${id}`),
        '',
        'Usage: theme <name>   (alias: colors <name>)',
        'Example: theme matrix',
      ],
    }
  }
  if (!isCliThemeId(sub)) {
    return {
      type: 'lines',
      lines: [`Unknown theme: ${sub}. Try theme list.`],
    }
  }
  return { type: 'theme', theme: sub }
}

const commands: Record<string, CommandHandler> = {
  about: (_ctx) => ({ type: 'lines', lines: [...cliAbout.lines] }),
  projects: (_ctx) => ({ type: 'lines', lines: [...cliProjects.lines] }),
  experience: (_ctx) => ({ type: 'lines', lines: [...cliExperience.lines] }),
  contact: (_ctx) => ({ type: 'lines', lines: [...cliContact.lines] }),
  help: (_ctx) => ({ type: 'lines', lines: cliHelpLines() }),
  clear: () => ({ type: 'clear' }),
  games: () => ({
    type: 'lines',
    lines: [
      'Desktop mini-games:',
      ...CLI_GAME_IDS.map((g) => `  ${g}`),
      '',
      'Run: snake | pong | tetris',
      'ESC or Close returns to the shell.',
    ],
  }),
  snake: () => gameLaunch('snake'),
  pong: () => gameLaunch('pong'),
  tetris: () => gameLaunch('tetris'),
  theme: themeCommand,
  colors: themeCommand,
  exit: (ctx) =>
    ctx.embedded
      ? { type: 'close' }
      : {
          type: 'navigate',
          to: '/',
          message: 'Returning to portfolio…',
        },
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
