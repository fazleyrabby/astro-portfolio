export type CapabilityItem = {
  name: string;
  primary?: boolean;
};

export type CapabilityGroup = {
  id: string;
  name: string;
  items: CapabilityItem[];
};

export const capabilities: CapabilityGroup[] = [
  {
    id: "backend",
    name: "Backend & Systems",
    items: [
      { name: "Laravel", primary: true },
      { name: "PHP 8.x", primary: true },
      { name: "REST APIs" },
      { name: "Livewire" },
      { name: "Queue Workers" },
      { name: "Event-Driven Architecture", primary: true },
    ],
  },
  {
    id: "data",
    name: "Databases & Analytics",
    items: [
      { name: "MySQL", primary: true },
      { name: "ClickHouse", primary: true },
      { name: "Redis", primary: true },
      { name: "SQLite" },
      { name: "Read Replicas" },
      { name: "Query Optimization", primary: true },
    ],
  },
  {
    id: "infra",
    name: "Infrastructure & DevOps",
    items: [
      { name: "Docker", primary: true },
      { name: "Docker Compose" },
      { name: "Linux (Ubuntu)", primary: true },
      { name: "Nginx" },
      { name: "VPS Hardening" },
      { name: "GitHub Actions" },
      { name: "Cloudflare" },
      { name: "Tailscale" },
    ],
  },
  {
    id: "security",
    name: "Security & Integrations",
    items: [
      { name: "Fraud Engines", primary: true },
      { name: "PayPal API" },
      { name: "Checkout.com" },
      { name: "Stripe", primary: true },
      { name: "Webhooks", primary: true },
      { name: "Local LLMs / Groq" },
    ],
  },
  {
    id: "languages",
    name: "Languages",
    items: [
      { name: "PHP" },
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "SQL" },
    ],
  },
  {
    id: "architecture",
    name: "Architecture",
    items: [
      { name: "Fraud Detection" },
      { name: "High Concurrency" },
      { name: "Database Replication / Idempotent Webhooks" },
    ],
  },
  {
    id: "frontend",
    name: "Frontend & Tooling",
    items: [
      { name: "Astro" },
      { name: "Tailwind CSS" },
      { name: "Alpine.js" },
      { name: "JavaScript" },
    ],
  },
];

export const primaryCapabilities = capabilities
  .flatMap((group) => group.items)
  .filter((item) => item.primary)
  .map((item) => item.name);
