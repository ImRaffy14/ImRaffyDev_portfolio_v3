export type Project = {
  slug: string
  title: string
  year: number
  shortDescription: string
  description: string
  coverImage: string
  gallery: string[]
  certificationImages?: string[]
  highlights: string[]
  techStack: string[]
}

const img = (seed: string) =>
  `https://res.cloudinary.com/dpyhkumle/image/upload/${seed}`

export const projects: Project[] = [
  {
    slug: 'jjm-manufacturing-finance-management-system',
    title: 'JJM Manufacturing Finance Management System',
    year: 2024,
    shortDescription:
      'A capstone and client-based project designed to streamline financial operations for a manufacturing firm. Key features include automated financial tracking and a machine learning-powered AI for anomaly detection to enhance accuracy and security.',
    description:
      'A capstone and client-based project designed to streamline financial operations for a manufacturing firm. Key features include automated financial tracking and a machine learning-powered AI for anomaly detection to enhance accuracy and security.\n\n(This project is able us to showcase this in a organized by the Singapore institute of Multidisciplinary Professions and Ascendence Asia International Research Institute)',
    coverImage: img('v1777466014/jjm_1_p4hpo0.png'),
    gallery: [
      img('v1777466017/jjm_3_ombw7p.png'),
      img('v1777466014/jjm_2_brulu3.png'),
      img('v1777466018/jjm_4_agjpmk.png'),
      img('v1777466019/jjm_5_zslgx3.png'),
      img('v1777466020/jjm_6_lyaavc.png'),
    ],
    certificationImages: [
      img('jjm-manufacturing-finance-management-system-certification-1'),
      img('jjm-manufacturing-finance-management-system-certification-2'),
    ],
    highlights: [
      'Automated financial tracking system',
      'AI-powered anomaly detection for accuracy and security',
      'Real-world manufacturing finance optimization',
      'Academic and institutional showcase project (Singapore institute + Ascendence Asia)',
    ],
    techStack: ['React', 'Node JS', 'Mongo DB', 'TensorFlow', 'tailwind', 'express'],
  },
  {
    slug: 'pilot-area-community-chapter-system',
    title: 'Pilot Area Community Chapter System',
    year: 2022,
    shortDescription:
      'A private system built to manage residents, funds, and attendance for our community chapter. It streamlines administrative tasks with features like resident database management, financial tracking, and attendance monitoring—showcasing my ability to develop tailored, efficient solutions.',
    description:
      'A private system built to manage residents, funds, and attendance for our community chapter. It streamlines administrative tasks with features like resident database management, financial tracking, and attendance monitoring—showcasing my ability to develop tailored, efficient solutions.',
    coverImage: img('v1777466013/pacc_1_nkvvib.png'),
    gallery: [
      img('v1777466013/pacc_3_dxqzlv.png'),
      img('v1777466014/pacc_2_wr1xgi.png'),
    ],
    highlights: [
      'Resident database management system',
      'Financial tracking and monitoring',
      'Attendance automation system',
      'Administrative workflow optimization',
    ],
    techStack: ['HTML', 'CSS', 'BOOTSTRAP', 'PHP', 'MYSQL', 'JAVASCRIPT'],
  },
  {
    slug: 'nodado-finance-management-system',
    title: 'Nodado Finance Management System',
    year: 2024,
    shortDescription:
      'A custom financial management system developed for Nodado General Hospital to streamline and centralize financial operations. The system includes an AI-integrated chatbot capable of summarizing expenses, revenue, sales, and overall financial data in real time, enabling faster insights and better decision-making. It also handles budgeting, expense tracking, and financial reporting, improving overall efficiency, accuracy, and transparency in hospital fund management.',
    description:
      'A custom financial management system developed for Nodado General Hospital to streamline and centralize financial operations. The system includes an AI-integrated chatbot capable of summarizing expenses, revenue, sales, and overall financial data in real time, enabling faster insights and better decision-making. It also handles budgeting, expense tracking, and financial reporting, improving overall efficiency, accuracy, and transparency in hospital fund management.',
    coverImage: img('v1777466013/nodado_1_uzhib9.png'),
    gallery: [
      img('v1777466012/nodado_3_shqg2f.png'),
      img('v1777466012/nodado_2_szuvgr.png'),
      img('v1777466012/nodado_4_gzlgxi.png'),
    ],
    highlights: [
      'AI-powered chatbot for real-time financial summaries (expenses, revenue, sales)',
      'Automated budget and expense tracking system',
      'Centralized financial reporting and data management',
      'Improved decision-making through instant financial insights',
      'Enhanced transparency and operational efficiency in hospital fund management',
    ],
    techStack: ['React', 'Node JS', 'Mongo DB', 'Express', 'Tailwind'],
  },
  {
    slug: 'slate-hr-management-system',
    title: 'SLATE HR Management System',
    year: 2026,
    shortDescription:
      'AI-integrated HR performance platform designed to monitor, evaluate, and enhance employee performance within an organization. SLATE-HR helps HR teams and managers track progress, identify high-performing employees, and make data-driven promotion decisions based on clear performance metrics.\n\nIt leverages AI to deliver intelligent insights into performance trends, enabling more accurate evaluations, early detection of high-potential talent, and more effective performance enhancement strategies.',
    description:
      'AI-integrated HR performance platform designed to monitor, evaluate, and enhance employee performance within an organization. SLATE-HR helps HR teams and managers track progress, identify high-performing employees, and make data-driven promotion decisions based on clear performance metrics.\n\nIt leverages AI to deliver intelligent insights into performance trends, enabling more accurate evaluations, early detection of high-potential talent, and more effective performance enhancement strategies.',
    coverImage: img('slate-hr-management-system-cover'),
    gallery: [
      img('slate-hr-management-system-g1'),
      img('slate-hr-management-system-g2'),
      img('slate-hr-management-system-g3'),
    ],
    highlights: [
      'AI-powered HR performance analytics',
      'Employee evaluation and tracking system',
      'Data-driven promotion decision support',
      'Talent identification and performance insights',
    ],
    techStack: [
      'React',
      'Typescript',
      'Tailwind',
      'Node jS',
      'Express',
      'Prisma',
      'Mongo DB',
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
