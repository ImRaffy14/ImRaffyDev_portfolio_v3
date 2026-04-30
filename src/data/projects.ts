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
      img('v1777488358/aba963f4-274d-4969-acf1-8d91dff0775a_iafqe0.jpg'),
      img('v1777488359/f0a2ad07-201b-453f-a538-03a9cd52d954_sh9tiu.jpg'),
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
    slug: 'coaching-system-students-mobile-app',
    title: 'Coaching System | Students Mobile App',
    year: 2026,
    shortDescription:
      'A coaching management platform with a Coach Panel and a mobile Student App, designed to track progress, manage tasks, and improve student performance through structured coaching and peer accountability features.',
  
    description:
      'A full-stack coaching system consisting of a web-based Coach Panel and a mobile Student Application. Coaches can manage students, assign tasks, monitor progress, and provide structured guidance through an organized dashboard.\n\nThe Student Mobile App allows users to follow assigned tasks, update progress, and stay aligned with their coaching goals in real-time. It also introduces a Buddy System feature, enabling students to pair up, track each other’s progress, and encourage accountability.\n\nThis social and interactive approach helps improve consistency, motivation, and performance by combining personal coaching with peer support. The system is designed to create a more engaging and collaborative learning environment between coaches and students.',
  
    coverImage: img('v1777486877/coach_1_dnvred.jpg'),
  
    gallery: [
      img('v1777489316/coach_9_mvmbqc.jpg'),
      img('v1777489346/coach_10_xkjenv.jpg'),
      img('v1777489408/coach_11_bjhvcg.jpg'),
      img('v1777486878/coach_5_j9lw13.jpg'),
      img('v1777486878/coach_6_ojmqox.jpg'),
      img('v1777486879/coach_8_mhyyue.jpg'),
    ],
  
    highlights: [
      'Coach Panel for student management and progress tracking',
      'Mobile Student App for task execution and updates',
      'Real-time progress monitoring and performance insights',
      'Buddy System for peer accountability and motivation',
      'Task assignment and structured coaching workflow',
      'Improved engagement through interactive mobile learning experience',
    ],
  
    techStack: ['React Native', 'Expo', 'Laravel', 'React TypeScript', 'HeidiSQL'],
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
    coverImage: img('v1777486879/slate_1_yzvchr.jpg'),
    gallery: [
      img('v1777486879/slate_2_yg13t4.jpg'),
      img('v1777486879/slate_3_nn9fsv.jpg'),
      img('v1777486879/slate_5_mq4mvg.jpg'),
      img('v1777486879/slate_4_mhpvrf.jpg'),
      img('v1777486879/slate_6_u8umaw.jpg'),
      img('v1777486880/slate_7_lgbdqy.jpg'),
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
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
