---
title: "DailyLOG"
type: "Personal Productivity / Life OS"
featured: true
problem: "Individuals need a unified, high-density, and private single source of truth for notes, tasks, reflections, and learning paths without database bloat or vendor lock-in."
solution: "A personal Life OS dashboard combining bi-directional note linking, structured daily journals, and priority-driven task boards into a fast, self-hostable monolith."
impact: "Created a private, zero-lock-in dashboard combining bidirectional note-linking, calendar reflections, and tasks."
github: "https://github.com/fazleyrabby/dailylog"
thumbnail: "/projects/dailylog.png"
description: "Personal Life OS & productivity dashboard with bidirectional notes, task boards, and structured journals."
tech: ["Laravel 12", "PostgreSQL", "Tailwind CSS v4", "Alpine.js", "Vite", "Tiptap", "LibreSpeed", "Supabase"]
status: "Active"
position: 3
period: "Jun 2026 – Present"
role: "Solo Developer"
highlights:
  - "Engineered a bidirectional backlinking pipeline using a backend LinkService, parsing [[Note Title]] syntax to dynamically build references in a context drawer."
  - "Implemented a structured daily journal logger, serializing learning points, milestones, and ideas as indexable JSON inside PostgreSQL."
  - "Designed a high-density, priority-based task dashboard with dynamic filters and automated attribute assignments (due-dates, project tags)."
  - "Created a tactile, responsive design system utilizing IBM Plex Sans, 'Warm Stone' theme variants, and custom Alpine.js-powered resizable panels."
  - "Built Quest Mode — a fully gamified RPG skin that transforms the dashboard into an interactive quest-based experience."
  - "Implemented a LibreSpeed-powered network speed tester with dedicated UI, 4-thread parallel connections, latency tabs, and DB logging."
  - "Built a multi-theme engine (Neon Grid, Retro 8-Bit, and more) with a theme registry for easy extensibility."
  - "Added application-level IP whitelist for production access control."
  - "Built periodic Supabase backup with settings sync and CLI command."
  - "Implemented image uploads with XSS-safe markdown preview for notes."
  - "Built notes single export, bulk ZIP backup, and file import system."
  - "Added collapsible sidebars on desktop and mobile drawer overlays for all panels." 
scope:
  - "Laravel 12 monolithic architecture utilizing PostgreSQL with native enums, CITEXT, and GIN full-text search."
  - "Bidirectional linking service with automatic parser and dynamic backlink context panels."
  - "Structured daily journal entry system with a custom 30-day interactive calendar visualizer."
  - "Task Board: Inbox, Today, Upcoming, and Completed smart filters with cycling priority toggles."
  - "TACTILE controls: Custom 3D action buttons and Alpine.js drag-to-resize split workspace panels."
  - "Custom slim scrollbars and dark/light themes tailored around Warm Stone palettes."
  - "Full PHPUnit feature testing suite verifying endpoint security, markdown parsing, and data integrity."
---
