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
    'I’m a Full Stack Developer transitioning into AI Engineering—building scalable, real-time systems while going deeper into LLMs, AI tooling, and automation.',
  paragraphs: [
    'With years of hands-on experience, I work across the full stack—leveraging modern technologies like MongoDB, Express.js, React, and Node.js to deliver high-performance applications, and I bring solid knowledge in server management and system design.',
    'I’m now focused on AI Engineering—learning how LLMs work under the hood and using AI tools to build smarter workflows and automations that make development faster and more reliable.',
    'I integrate AI tools into my everyday workflow to work faster and keep my projects well-organized.',
    'Since 2022, I’ve collaborated with clients to turn ideas into practical, production-ready systems—now with AI woven into how I design and ship them.',
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
    id: 'ai',
    label: 'AI & Automation',
    skills: [
      { name: 'Claude', slug: 'claude' },
      { name: 'OpenAI', slug: 'openai' },
      { name: 'n8n', slug: 'n8n' },
      { name: 'Obsidian', slug: 'obsidian' },
      { name: 'Python', slug: 'python' },
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
