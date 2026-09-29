export const profile = {
  name: "Md. Fazley Rabbi",
  shortName: "Fazley Rabbi",
  nameBn: "ফজলে রাব্বি",
  role: "Backend Engineer (Laravel)",
  roleAlternates: [
    "Mid-Level Backend Engineer",
    "Software Engineer (Laravel)",
    "Backend / Web Developer",
  ],
  positioning:
    "Designing scalable backend systems, payment infrastructure, and APIs for products that serve real users.",
  secondary: "Building scalable systems, not just interfaces.",
  description:
    "Laravel & Backend Engineer specializing in SaaS platforms, REST APIs, and high-performance applications.",
  location: {
    city: "Chittagong",
    country: "Bangladesh",
    timezone: "UTC+6",
    remote: true,
  },
  availability: {
    headline: "Available for Mid-Level Backend Roles & Consulting",
    detail: "Currently accepting new collaborations for late 2026.",
  },
  experience: {
    claim: "5+ years",
    start: 2021,
  },
  focus: [
    "Distributed Systems",
    "Payment Infrastructure",
    "Cloud Infrastructure",
    "AI Workflows",
  ],
  email: "fazley111@gmail.com",
  url: "https://fazleyrabbi.xyz",
  links: {
    github: "https://github.com/fazleyrabby",
    linkedin: "https://linkedin.com/in/fazley-rabby",
    x: "https://x.com/fazley111",
    youtube: "https://youtube.com/@fazleyrabby",
    codepen: "https://codepen.io/fazleyrabby",
  },
  resume: {
    pdf: "/resume.pdf",
    cv: "/cv.pdf",
  },
  education: [
    {
      institution: "Port City International University",
      credential: "B.Sc. Computer Science & Engineering",
      year: "2020",
    },
    {
      institution: "Daffodil Institute of IT",
      credential: "Diploma in Computer Technology",
      year: "2016",
    },
  ],
  languages: [
    { name: "Bengali", level: "Native" },
    { name: "English", level: "Professional Working Proficiency" },
  ],
  socials: [
    { id: "github", label: "GitHub", href: "https://github.com/fazleyrabby" },
    { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/fazley-rabby" },
    { id: "x", label: "X", href: "https://x.com/fazley111" },
    { id: "youtube", label: "YouTube", href: "https://youtube.com/@fazleyrabby" },
    { id: "codepen", label: "CodePen", href: "https://codepen.io/fazleyrabby" },
    { id: "email", label: "Email", href: "mailto:fazley111@gmail.com" },
  ],
} as const;

export type Profile = typeof profile;
