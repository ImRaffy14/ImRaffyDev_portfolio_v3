export type Project = {
  slug: string
  title: string
  year: number
  shortDescription: string
  description: string
  coverImage: string
  gallery: string[]
  highlights: string[]
  techStack: string[]
}

const img = (seed: string, w = 1200, h = 675) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`

export const projects: Project[] = [
  {
    slug: 'orbit-dashboard',
    title: 'Orbit Dashboard',
    year: 2025,
    shortDescription:
      'Operations console for monitoring fleets of edge devices with live charts and alerts.',
    description:
      'Orbit is a placeholder operations dashboard concept. It aggregates telemetry from distributed nodes, surfaces anomaly scores, and lets operators drill into incident timelines. The UI prioritizes scanability: dense tables, sparkline summaries, and a unified search palette. This write-up describes goals, constraints, and technical tradeoffs for a production build.',
    coverImage: img('orbit-dashboard-cover'),
    gallery: [
      img('orbit-dashboard-g1'),
      img('orbit-dashboard-g2'),
      img('orbit-dashboard-g3'),
    ],
    highlights: [
      'Sub-second refresh for KPI tiles with incremental polling',
      'Role-aware views with saved filter presets per team',
      'Export pipelines for weekly executive PDF summaries',
    ],
    techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'TanStack Query'],
  },
  {
    slug: 'ledger-lite',
    title: 'Ledger Lite',
    year: 2024,
    shortDescription:
      'Minimal double-entry bookkeeping API and admin UI for small studios.',
    description:
      'Ledger Lite is a fictional accounting toolkit for creative shops. It models accounts, journal lines, and reporting periods with strict validation. The admin UI walks bookkeepers through reconciliation flows and highlights discrepancies before close. Placeholder copy stands in for case studies and client names.',
    coverImage: img('ledger-lite-cover'),
    gallery: [img('ledger-lite-g1'), img('ledger-lite-g2')],
    highlights: [
      'Immutable journal postings with compensating entries only',
      'Multi-currency support with daily rate snapshots',
      'Audit trail export compatible with external compliance tools',
    ],
    techStack: ['Node.js', 'PostgreSQL', 'GraphQL', 'React', 'Zod'],
  },
  {
    slug: 'northwind-mobile',
    title: 'Northwind Mobile',
    year: 2024,
    shortDescription:
      'Field sales companion for offline catalogs, quotes, and signature capture.',
    description:
      'Northwind Mobile imagines a sales rep app that works on patchy connectivity. Reps browse product bundles, assemble quotes, and collect signatures. Sync resolves conflicts with server-wins for pricing and client-wins for notes. Images and screenshots here are placeholders only.',
    coverImage: img('northwind-mobile-cover'),
    gallery: [img('northwind-mobile-g1'), img('northwind-mobile-g2'), img('northwind-mobile-g3'), img('northwind-mobile-g4')],
    highlights: [
      'Offline-first SQLite cache with background sync',
      'Camera-based SKU lookup with fuzzy matching',
      'Biometric lock and per-territory data partitions',
    ],
    techStack: ['React Native', 'TypeScript', 'Expo', 'SQLite', 'REST'],
  },
  {
    slug: 'pulse-retention',
    title: 'Pulse Retention',
    year: 2023,
    shortDescription:
      'Lifecycle messaging experiments with cohort dashboards and holdout analysis.',
    description:
      'Pulse Retention is a placeholder growth-engineering project. It ties event streams to cohort funnels, runs message experiments, and compares holdout groups. Operators can define guardrails so aggressive tests never blast sensitive segments. All metrics and brands shown are fictitious.',
    coverImage: img('pulse-retention-cover'),
    gallery: [img('pulse-retention-g1'), img('pulse-retention-g2')],
    highlights: [
      'Bayesian early stopping for in-flight experiments',
      'Consent-aware audience builder with policy tags',
      'Slack and email digests for experiment owners',
    ],
    techStack: ['Next.js', 'Python', 'BigQuery', 'dbt', 'Airflow'],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
