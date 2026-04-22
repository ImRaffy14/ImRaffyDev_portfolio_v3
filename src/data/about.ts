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
  subtitle:
    'I’m a Full Stack Developer focused on building scalable, real-time, and user-centered digital experiences.',
  paragraphs: [
    'With over two years of hands-on experience, I work across the full stack—leveraging modern technologies like MongoDB, Express.js, React, and Node.js to deliver high-performance applications.',
    'Since 2022, I’ve collaborated with clients to turn ideas into practical, production-ready systems.',
    'I also bring solid knowledge in server management and system design, allowing me to approach projects with both technical depth and real-world practicality.',
  ],
} as const

/** Add rows freely — chips wrap per row on narrow viewports. */
export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'React', slug: 'react' },
      { name: 'Vue', slug: 'vuedotjs' },
      { name: 'Tailwind', slug: 'tailwindcss' },
      { name: 'Bootstrap', slug: 'bootstrap' },
      { name: 'Html', slug: 'html5' },
      { name: 'Css', slug: 'css3' },
      { name: 'javascript', slug: 'javascript' },
      { name: 'next js', slug: 'nextdotjs' },
      { name: 'Typescript', slug: 'typescript' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      { name: 'Node js', slug: 'nodedotjs' },
      { name: 'Express', slug: 'express' },
      { name: 'Laravel', slug: 'laravel' },
      { name: 'PHP', slug: 'php' },
      { name: 'Go lang', slug: 'go' },
    ],
  },
  {
    id: 'database',
    label: 'Database',
    skills: [
      { name: 'MySQL', slug: 'mysql' },
      { name: 'Mongo DB', slug: 'mongodb' },
      { name: 'Redis', slug: 'redis' },
      { name: 'Prisma (ORM)', slug: 'prisma' },
      { name: 'Drizzle (ORM)', slug: 'drizzle' },
      { name: 'Maria DB', slug: 'mariadb' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    skills: [
      { name: 'Git', slug: 'git' },
      { name: 'Docker', slug: 'docker' },
      { name: 'Aws', slug: 'amazonaws' },
      { name: 'TensorFlow', slug: 'tensorflow' },
      { name: 'Linux', slug: 'linux' },
      { name: 'Nginx', slug: 'nginx' },
    ],
  },
]
