# Fazley Rabbi — Engineering Portfolio & Monorepo

An award-winning editorial engineering portfolio and monorepo built with **Astro 5**, **TypeScript**, **Tailwind CSS**, **GSAP**, **Lenis**, and **pnpm**. Designed with a calm, premium, magazine-quality aesthetic for backend software engineering insights, case studies, and personal memoirs.

<img width="1228" height="797" alt="CleanShot 2026-08-07 at 02 10 27" src="https://github.com/user-attachments/assets/56eb0acf-b61f-4b18-bb7a-5f1cc9e77765" />

---

## ⚡ Features & Highlights

- **Editorial Design System**: Custom typography scale using *Spectral* serif, *Geist* sans, and *IBM Plex Mono*, paired with tactile hardware-inspired UI buttons and dark/light modes.
- **Internationalization (i18n)**: Full dual-language support for English (`/`) and Bengali (`/bn`).
- **Interactive Tech Journey ([/journey](file:///Users/rabbi/Desktop/Projects/Sites/astro-portfolio/apps/web/src/pages/journey.astro))**: An immersive chapter-based editorial story spanning 2001 to present — covering early computing memories, Symbian tethering, custom Android ROMs on Nexus 4, software development training, starting over, and Electronic First. Features a sticky timeline rail and high-resolution artwork.
- **Workbench & Homelab ([/uses](file:///Users/rabbi/Desktop/Projects/Sites/astro-portfolio/apps/web/src/pages/uses.astro))**: Detailed breakdown of developer setup, hardware, terminal, and 41+ Docker container homelab infrastructure.
- **Case Studies & Writing**: High-volume backend case studies, REST API architecture patterns, and system design articles.
- **Photography Gallery ([/gallery](file:///Users/rabbi/Desktop/Projects/Sites/astro-portfolio/apps/web/src/pages/gallery.astro))**: Cloudinary-powered dynamic photo gallery.
- **AI Blog Automation Workflow**: Integrated Telegram bot & AI pipeline (powered by Groq / OpenAI) for drafting and managing technical articles via Telegram.

---

## 🏗️ Monorepo Structure

```text
astro-portfolio/
├── apps/
│   ├── web/        # Astro 5 frontend application (Portfolio, Blog, Journey, Uses)
│   ├── api/        # Backend microservice for analytics & visitor tracking
│   └── cms/        # Content management pipeline & draft engines
├── packages/
│   └── shared/     # Shared TypeScript utilities & design tokens
├── deploy-api.sh   # Production API deployment script
└── pnpm-workspace.yaml
```

---

## 🛠️ Tech Stack

- **Framework**: [Astro 5](https://astro.build/) (Static & SSR)
- **Styling**: Tailwind CSS + Vanilla CSS Variables
- **Animations**: GSAP, ScrollTrigger, Lenis Smooth Scroll
- **Typography**: Spectral, Geist, IBM Plex Mono
- **Hosting & Infra**: Vercel, Cloudflare Tunnels, Docker, Cloudinary
- **AI Engine**: Groq API / OpenAI API + Telegraf Bot

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **pnpm**: `v8.0.0` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/fazleyrabby/astro-portfolio.git
cd astro-portfolio

# Install dependencies
pnpm install
```

### Local Development

```bash
# Run the web portfolio locally
pnpm dev:web

# Run the backend API service
pnpm dev:api
```

Open `http://localhost:4321` in your browser.

### Production Build

```bash
# Build static bundle for production
pnpm build:web
```

---

## 🤖 Telegram AI Automation Workflow

This repository includes a Telegram bot workflow to draft, iterate on, and generate blog posts using AI models.

### Environment Setup

Create `.env` inside `apps/web/`:

```env
GROQ_API_KEY=your_groq_api_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
GITHUB_TOKEN=your_github_personal_access_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Running the Bot Locally

```bash
# Launch Telegram listener bot
cd apps/web
npm run bot
```

### Bot Commands

| Command | Description |
| :--- | :--- |
| `/topic <text>` | Set the primary topic for an upcoming technical post |
| `/context <text>` | Provide context, code snippets, or architectural notes |
| `/category <text>` | Set article tags/category |
| `/generate` | Generate the post draft via Groq/OpenAI |
| `/status` | View current draft state |
| `/reset` | Clear active draft buffer |

---

## 📄 License

Created by **Md. Fazley Rabbi**. All rights reserved.
