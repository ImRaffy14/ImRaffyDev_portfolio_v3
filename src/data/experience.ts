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
    id: 'socia-it-solutions',
    role: 'Senior Full Stack Developer',
    company: 'Socia IT Solutions',
    start: '2025',
    end: 'Present',
    summary:
      'Lead full stack development across frontend, backend, and DevOps—driving the team’s workflow while owning server-side infrastructure on AWS to keep projects shipping reliably.',
    bullets: [
      'Lead the development team—managing workflow, monitoring progress, and assigning and tracking tasks to keep delivery on schedule',
      'Own server-side and DevOps infrastructure on AWS, working with EC2, S3, IVS, and EventBridge for event and webhook handling',
      'Built and scaled a real-time streaming platform with a focus on performance and reliability',
      'Drive code reviews and engineering standards to raise code quality and team velocity',
    ],
  },
  {
    id: 'ichico-solutions',
    role: 'Intern Front End Developer',
    company: 'Ichico Solutions',
    start: '2025',
    end: '2025',
    summary:
      'Contributed to the development and management of a SaaS project using Next js.',
    bullets: [
      'Developed the Point-of-Sale (POS) and Kiosk modules for a SaaS-based application as part of a frontend internship',
      'Built responsive and user-friendly interfaces tailored for real-time transactions and self-service interactions',
      'Implemented lightweight client-side algorithms to handle user input validation, item selection, and basic calculations',
      'Ensured smooth integration with backend services and contributed to an agile development workflow',
    ],
  },
  {
    id: 'freelance-full-stack-developer',
    role: 'Freelance Full-Stack Developer',
    company: 'Freelance Full-Stack Developer',
    start: '2022',
    end: 'Present',
    summary:
      'Built and maintained end-to-end web applications with responsive design and smooth user experiences. Collaborated with clients to deliver customized solutions using HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
    bullets: [
      'Developed and maintained multiple end-to-end web applications, ensuring responsive design and seamless user experiences',
      'Collaborated with clients to understand their needs and deliver tailored web solutions',
      'Managed both front-end and back-end development using technologies such as HTML, CSS, JavaScript, React, Node.js, and MongoDB',
    ],
  },
]
