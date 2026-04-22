export const cliAbout = {
  lines: [
    'Raffy Uanan — Full Stack Developer',
    'I’m a Full Stack Developer focused on building scalable, real-time, and user-centered digital experiences.',
    'With over two years of hands-on experience, I work across the full stack—leveraging modern technologies like MongoDB, Express.js, React, and Node.js to deliver high-performance applications.',
    'Since 2022, I’ve collaborated with clients to turn ideas into practical, production-ready systems.',
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
    '',
    'Open the Projects section on the main site for full case studies.',
  ],
} as const

export const cliExperience = {
  lines: [
    'Work history:',
    '  2025 — Present · Full Stack Developer · Socia IT Solutions',
    '  2025 — 2025 · Frontend Developer · Ichico Solutions',
    '  2022 — Present · Freelance Full-Stack Developer',
    '',
    'See Experience on the homepage for full details and key achievements.',
  ],
} as const

export const cliContact = {
  lines: [
    'Contact:',
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
