export const cliAbout = {
  lines: [
    'Raffy Uanan — Full Stack Developer & Aspiring AI Engineer',
    'I’m a Full Stack Developer transitioning into AI Engineering, building scalable, real-time systems while going deeper into LLMs, AI tooling, and automation.',
    'I work across the full stack with MongoDB, Express.js, React, and Node.js, plus server management and system design.',
    'Claude is a core part of my dev workflow, and I use Obsidian to store notes and per-project context.',
    'Type `projects` for work samples, `experience` for timeline, `contact` to connect.',
  ],
} as const

export const cliProjects = {
  lines: [
    'Featured work:',
    '  • JJM Manufacturing Finance Management System (2024)',
    '  • Pilot Area Community Chapter System (2022)',
    '  • Nodado Finance Management System (2024)',
    '  • SLATE HR Management System (2026)',
    '  • Coaching System | Students Mobile App (2026)',
    '',
    'Open the Projects section on the main site for full case studies.',
  ],
} as const

export const cliExperience = {
  lines: [
    'Work history:',
    '  2025 — Present · Senior Full Stack Developer · Socia IT Solutions',
    '  2025 — 2025 · Intern Front End Developer · Ichico Solutions',
    '  2022 — Present · Freelance Full-Stack Developer',
    '',
    'See Experience on the homepage for full details and key achievements.',
  ],
} as const

export const cliContact = {
  lines: [
    'Contact:',
    '  Email: raffysolis123@gmail.com',
    '  GitHub · Facebook · Instagram · Discord — links on the SocialDock.',
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
