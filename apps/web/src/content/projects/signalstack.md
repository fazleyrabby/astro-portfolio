---
title: "SignalStack"
type: "AI / Analytics Engine"
featured: true
problem: "Global geopolitical and tech news cycles move too fast for manual monitoring, creating a massive noise-to-signal ratio."
solution: "A high-density analytical terminal that distills vast world-event feeds into real-time summaries and severity scores via multi-provider AI failover."
impact: "Automated real-time international feed processing, routing multi-provider AI failovers with near-zero inference cost."
live: "https://signal.fazleyrabbi.xyz/"
github: "https://github.com/fazleyrabby/signal-stack"
thumbnail: "https://i.ibb.co.com/1fj68nzp/Clean-Shot-2026-05-25-at-01-57-27.png"
description: "Next-Gen AI Intelligence Terminal for real-time geopolitical and tech feed distillation."
tech: ["Node.js", "NestJS", "Groq", "OpenRouter", "Redis", "Real-time AI"]
status: "Ongoing"
position: 2
period: "Apr 2026 – May 2026"
role: "Solo Developer"
highlights:
  - "Reduced AI inference costs to near-zero with a multi-tier local pipeline (Mac M1 LlamaCPP → VPS local → Groq → OpenRouter) and automatic fallback chaining."
  - "Automated content distribution via SignalStack Pulse — Twitter/X, Facebook, LinkedIn OAuth, platform-aware content transformer, and rate limiting (2 posts/day cap on X)."
  - "Solved geolocation-based company discovery with Company Radar — OSM/Overpass, Mapbox, Google Places, e-CAB, and GitHub tech sources with smart career page detection."
  - "Made the platform accessible in Bengali via a Redis-backed translation priority queue with dual-tier quality threshold."
  - "Centralised job market intelligence by aggregating remote sources into a unified feed with Discord alerts, dedup, and global remote filter."
scope:
  - "RSS feed aggregation with dedup, min-score filter, 30-day retention, auto-requeue on startup."
  - "Tiered scoring engine with noise reduction and geopolitical coverage."
  - "Bengali font (Hind Siliguri) and next-intl i18n routing."
  - "Directory Crawler with site-specific extractors (bdjobs, remotive) and bank filter."
  - "Job Signal Extension: remote feeds, Discord alerts, dedup, global remote filter."
  - "Admin dashboard: sortable/resizable columns, bulk select, Discord webhook UI, API key manager, drag-and-drop AI pipeline editor."
  - "Geo heatmap with TopoJSON world map + ZoomableGroup, country filter from query params."
  - "Trends analytics endpoint; /trends page migrated to Tremor."
  - "Bookmarks system and daily email digest (tech-only)."
  - "Self-hosted IP enrichment (MaxMind) and passive bot detection; JWT HS256 + admin auth guards."
  - "Searchable log viewer with 30-day retention and day-range filter."
  - "35 DirectoryCrawlerService unit tests; Scorer/Admin/Auth service tests; CI/CD workflow; Docker resource limits."
---
