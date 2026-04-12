/** Simple Icons slug — see https://simpleicons.org/ */
export type SkillChip = {
  name: string
  slug: string
}

export type SkillGroup = {
  id: string
  label: string
  skills: SkillChip[]
}

/** Primary CDN; SkillChip falls back to jsDelivr on error. */
export function skillIconSrc(slug: string) {
  return `https://cdn.simpleicons.org/${encodeURIComponent(slug)}`
}

/** Monochrome from same CDN — visible on light/dark UI (brand URL may fail or be too low-contrast). */
export function skillIconMonoSrc(slug: string, dark: boolean) {
  const hex = dark ? 'fafafa' : '18181b'
  return `https://cdn.simpleicons.org/${encodeURIComponent(slug)}/${hex}`
}

export function skillIconFallbackSrc(slug: string) {
  return `https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/${encodeURIComponent(slug)}.svg`
}

export const about = {
  title: 'About',
  subtitle: 'Builder, problem-solver, lifelong learner',
  paragraphs: [
    "I'm a full-stack developer who enjoys turning complex requirements into clear, maintainable systems. I care about performance, DX, and shipping things people actually use.",
    'Most of my work sits at the intersection of web platforms, APIs, and real-time features—whether that means optimizing queries, hardening auth flows, or polishing UI states.',
    'Outside of tickets and PRs, I like exploring new tooling, contributing to internal standards, and mentoring where I can.',
  ],
} as const

/** Add rows freely — chips wrap per row on narrow viewports. */
export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'JavaScript', slug: 'javascript' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'React', slug: 'react' },
      { name: 'Next.js', slug: 'nextdotjs' },
      { name: 'Tailwind CSS', slug: 'tailwindcss' },
      { name: 'Vite', slug: 'vite' },
      { name: 'Framer Motion', slug: 'framer' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node.js', slug: 'nodedotjs' },
      { name: 'Laravel', slug: 'laravel' },
      { name: 'PHP', slug: 'php' },
      { name: 'GraphQL', slug: 'graphql' },
      { name: 'Express', slug: 'express' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    skills: [
      { name: 'MySQL', slug: 'mysql' },
      { name: 'PostgreSQL', slug: 'postgresql' },
      { name: 'MongoDB', slug: 'mongodb' },
      { name: 'Redis', slug: 'redis' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git', slug: 'git' },
      { name: 'Docker', slug: 'docker' },
      { name: 'AWS', slug: 'amazonaws' },
      { name: 'Playwright', slug: 'playwright' },
      { name: 'React Query', slug: 'reactquery' },
      { name: 'Zod', slug: 'zod' },
    ],
  },
]
