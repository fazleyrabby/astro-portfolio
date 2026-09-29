export type NavItem = {
  id: string;
  label: string;
  href: string;
  description?: string;
  external?: boolean;
};

export const primaryNav: NavItem[] = [
  { id: "manifest", label: "Manifest", href: "/manifest" },
  { id: "work", label: "Work", href: "/work" },
  { id: "notes", label: "Notes", href: "/notes" },
  { id: "about", label: "About", href: "/about" },
  { id: "journey", label: "Journey", href: "/journey" },
  { id: "uses", label: "Uses", href: "/uses" },
  { id: "resume", label: "Resume", href: "/resume" },
];

export const railNav: NavItem[] = [
  { id: "observability", label: "Contact", href: "/#observability" },
  { id: "manifest", label: "Manifest", href: "/manifest" },
];

export type CommandAction = {
  id: string;
  label: string;
  keywords: string[];
  href: string;
  group: "navigate" | "action";
};

export const commandActions: CommandAction[] = [
  {
    id: "resume",
    label: "View Résumé",
    keywords: ["cv", "resume", "download"],
    href: "/resume",
    group: "action",
  },
  {
    id: "email",
    label: "Email Fazley Rabbi",
    keywords: ["contact", "mail", "email", "hire"],
    href: "mailto:fazley111@gmail.com",
    group: "action",
  },
  {
    id: "manifest",
    label: "Open Manifest",
    keywords: ["index", "all", "sitemap", "list"],
    href: "/manifest",
    group: "navigate",
  },
];
