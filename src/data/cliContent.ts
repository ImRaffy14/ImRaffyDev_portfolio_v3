/**
 * Placeholder copy for the CLI. Swap with real site/project data later without
 * changing command wiring.
 */
export const cliAbout = {
  lines: [
    'Raffy Uanan — Full Stack Developer',
    'Building scalable web & mobile apps with focus on performance, systems, and clarity.',
    'Type `projects` for work samples, `experience` for timeline, `contact` to connect.',
  ],
} as const

export const cliProjects = {
  lines: [
    'Featured work (placeholder):',
    '  • Orbit Dashboard — edge ops & live charts',
    '  • Ledger Lite — bookkeeping API + admin',
    '  • Northwind Mobile — offline-first sales',
    '  • Pulse Retention — cohort experiments',
    '',
    'Open the Projects section on the main site for full case studies.',
  ],
} as const

export const cliExperience = {
  lines: [
    'Work history (placeholder):',
    '  2023 — Present · Senior Software Engineer · Acme Labs',
    '    Shipping product surfaces, design systems, and infra glue.',
    '  2020 — 2023 · Software Engineer · Northwind Digital',
    '    Full-stack features, API design, and performance passes.',
    '',
    'See Experience on the homepage for the real timeline.',
  ],
} as const

export const cliContact = {
  lines: [
    'Contact (placeholder):',
    '  Email: hello@example.com',
    '  GitHub · LinkedIn · X — links on the main site footer / contact.',
    '',
    'Use the contact form on the homepage for project inquiries.',
  ],
} as const

export function cliHelpLines(): string[] {
  return [
    'Commands:',
    '  about       Personal intro',
    '  projects    Project list snapshot',
    '  experience  Work history snapshot',
    '  contact     Contact details',
    '  help        Show this list',
    '  clear       Clear transcript (banner returns)',
    '  theme       Change CLI colors (alias: colors)',
    '  games       Desktop mini-games (snake, pong, tetris)',
    '  exit        Return to the portfolio',
    '',
    'Tip: command names are case-insensitive. Try theme list',
  ]
}
