export type CliGameId = 'snake' | 'pong' | 'tetris'

export const CLI_GAME_IDS: CliGameId[] = ['snake', 'pong', 'tetris']

export function isCliGameId(s: string): s is CliGameId {
  return (CLI_GAME_IDS as string[]).includes(s)
}

/** Mini-games need a wide viewport and a non-coarse primary pointer (mouse / trackpad). */
export function canPlayCliGames(): boolean {
  if (typeof window === 'undefined') return false
  if (window.innerWidth < 768) return false
  if (window.matchMedia('(pointer: coarse)').matches) return false
  return true
}

export function cliGamesBlockedMessage(): string {
  return 'Mini-games are desktop-only: use a mouse or trackpad on a screen at least 768px wide.'
}
