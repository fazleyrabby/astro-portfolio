import { profile } from "../data/profile";

export const SITE_URL = "https://fazleyrabbi.xyz";

export type JsonLd = Record<string, unknown>;

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path, SITE_URL).toString();
}

export function personJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    alternateName: profile.shortName,
    jobTitle: profile.role,
    description: profile.description,
    email: `mailto:${profile.email}`,
    url: profile.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.city,
      addressCountry: "BD",
    },
    worksFor: {
      "@type": "Organization",
      name: "Electronic First FZ LLE",
      url: "https://www.electronicfirst.com/",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Port City International University",
    },
    knowsAbout: profile.focus,
    sameAs: Object.values(profile.links),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fazley Rabbi",
    url: SITE_URL,
    inLanguage: "en",
    author: { "@type": "Person", name: profile.name },
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  description?: string;
  url: string;
  published?: Date;
  updated?: Date;
  tags?: string[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: post.url,
    datePublished: post.published ? new Date(post.published).toISOString() : undefined,
    dateModified: (post.updated ?? post.published) ? new Date(post.updated ?? post.published!).toISOString() : undefined,
    keywords: post.tags,
    author: { "@type": "Person", name: profile.name, url: profile.url },
  };
}

export function creativeWorkJsonLd(project: {
  title: string;
  description: string;
  url: string;
  live?: string | null;
  tech?: string[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: project.url,
    keywords: project.tech,
    author: { "@type": "Person", name: profile.name, url: profile.url },
    ...(project.live ? { sameAs: project.live } : {}),
  };
}
