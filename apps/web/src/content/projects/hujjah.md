---
title: "Hujjah"
type: "Web Application / Research Tools"
featured: true
problem: "Islamic research tools leak privacy to third-party APIs and lack proper hadith chain analysis."
solution: "A privacy-first Islamic research engine with AI inference, full Quran/hadith search, and sanad chain visualization."
impact: "Achieved zero-hallucination semantic search and sub-second hadith sanad chain visualizations completely client-side."
github: "https://github.com/fazleyrabby/hujjah"
live: "https://hujjah.fazleyrabbi.xyz/"
thumbnail: "https://i.ibb.co.com/9mvHKKSD/Chat-GPT-Image-May-1-2026-02-07-30-PM.png"
description: "Privacy-first Islamic research engine with Quran, hadith, and AI chat."
tech: ["Next.js", "SQLite", "FTS5", "Groq AI", "Transformers.js", "BGE-M3"]
status: "Ongoing"
position: 1
period: "Apr 2026 – May 2026"
role: "Solo Developer"
highlights:
  - "Made 111 Quran translations searchable by indexing the full corpus into a SQLite database with FTS5 and Arabic diacritic normalization."
  - "Eliminated hallucination risk in Islamic Q&A with a RAG pipeline using BGE-M3 embeddings, grounding every response in sourced verses and hadith."
  - "Made hadith chain scholarship accessible with an interactive sanad explorer — BFS graph traversal, React Flow infinite canvas, chain quality indicators, narrator enrichment via Wikidata/Wikipedia."
  - "Solved the Bengali Islamic content gap with a three-tier hadith corpus, Sunnah.com import + github-classic Bengali fallback (re-linking 24K translations), and bilingual AI chat."
  - "Delivered uninterrupted Quran audio by proxying the Islamic Network CDN with verse highlight/scroll, stay-in-surah auto-play, and resume support."
  - "Deployed a production web application with Docker Compose and Cloudflare Tunnels — providing a seamless experience with privacy-first features."
scope:
  - "Next.js architecture with SQLite for fast database reads."
  - "Arabic FTS5 search with diacritic stripping and multi-language query normalization."
  - "AI chatbot with RAG implementation, extractive Bengali fallback, and language auto-detection."
  - "Sunnah.com hadith import pipeline; unified three-tier corpus with grading and translator switcher."
  - "Sanad explorer: BFS level assignment, expandable nodes, hadith counts, React Flow draggable nodes, infinite canvas Map view."
  - "RadialSanad and ChainPreview views with SVG connectors and GitHub-style edge routing."
  - "Narrator search with FTS5 prefix matching, Arabic normalization, multi-language fallback."
  - "Quran audio proxy with real progress bar, reciter selection, per-verse controls."
  - "Settings page: appearance, AI model, Arabic font switcher, database sections."
  - "Dark/light mode, Bengali/Arabic bilingual UI, mobile nav, collapsible chain sections."
  - "Docker Compose and Cloudflare Tunnel deploy pipeline."
---