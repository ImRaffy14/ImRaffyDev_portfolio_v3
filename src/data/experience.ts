export type ExperienceItem = {
  id: string
  role: string
  company: string
  location?: string
  start: string
  end: string
  summary: string
  bullets?: string[]
}

export const experienceItems: ExperienceItem[] = [
  {
    id: 'senior-platform',
    role: 'Senior Full Stack Engineer',
    company: 'Northline Systems',
    location: 'Remote',
    start: '2023',
    end: 'Present',
    summary:
      'Owns core web platform features, API design, and performance budgets for a multi-tenant SaaS product.',
    bullets: [
      'Led migration of legacy modules to a typed React + Vite stack with shared design tokens',
      'Cut p95 API latency for high-traffic endpoints through caching and query shaping',
      'Mentors junior engineers on testing, reviews, and release hygiene',
    ],
  },
  {
    id: 'fullstack-product',
    role: 'Full Stack Developer',
    company: 'Kite Labs',
    location: 'Singapore',
    start: '2020',
    end: '2023',
    summary:
      'Built customer-facing dashboards and internal ops tools for a logistics analytics startup.',
    bullets: [
      'Shipped real-time shipment tracking with WebSockets and resilient reconnect flows',
      'Introduced contract tests between services to reduce cross-team regressions',
      'Partnered with design on accessible UI patterns and motion-reduced alternatives',
    ],
  },
  {
    id: 'backend-contract',
    role: 'Backend Engineer (Contract)',
    company: 'Harbor Health APIs',
    location: 'Remote',
    start: '2019',
    end: '2020',
    summary:
      'Delivered FHIR-adjacent REST APIs and integration adapters for a healthcare pilot.',
    bullets: [
      'Implemented OAuth2-scoped access and audit logging for PHI-adjacent data',
      'Documented integration playbooks for hospital IT partners',
    ],
  },
  {
    id: 'junior-web',
    role: 'Junior Web Developer',
    company: 'Studio Meridian',
    location: 'Manila',
    start: '2017',
    end: '2019',
    summary:
      'Maintained marketing sites and small Laravel apps for agency clients.',
    bullets: [
      'Automated content deployments with CI and staging previews',
      'Built reusable form and newsletter components across client themes',
    ],
  },
]
