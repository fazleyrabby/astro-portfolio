---
title: "Hujjah"
type: "Desktop / Research Tools"
featured: true
problem: "Islamic research tools require internet access, leak privacy to third-party APIs, and lack proper hadith chain analysis."
solution: "A privacy-first, offline-capable Islamic research engine with local AI inference, full Quran/hadith search, and sanad chain visualization."
github: "https://github.com/fazleyrabby/hujjah"
live: "https://hujjah.fazleyrabbi.xyz/"
thumbnail: "https://i.ibb.co.com/9mvHKKSD/Chat-GPT-Image-May-1-2026-02-07-30-PM.png"
description: "Privacy-first offline Islamic research engine with Quran, hadith, and AI chat."
tech: ["Next.js", "Tauri 2.0", "SQLite", "FTS5", "llama.cpp", "Transformers.js", "ONNX", "BGE-M3"]
status: "Ongoing"
position: 1
period: "Apr 2026 – May 2026"
role: "Solo Developer"
highlights:
  - "Made 111 Quran translations searchable offline by indexing the full corpus into a native SQLite vault with FTS5 and Arabic diacritic normalization — no cloud at runtime."
  - "Eliminated hallucination risk in Islamic Q&A with a RAG pipeline using BGE-M3 embeddings + llama.cpp (Qwen2.5 1.5B), grounding every response in sourced verses and hadith."
  - "Made hadith chain scholarship accessible with an interactive sanad explorer — BFS graph traversal, React Flow infinite canvas, chain quality indicators, narrator enrichment via Wikidata/Wikipedia."
  - "Solved the Bengali Islamic content gap with a three-tier hadith corpus, Sunnah.com import + github-classic Bengali fallback (re-linking 24K translations), and bilingual AI chat."
  - "Delivered uninterrupted Quran audio by proxying the Islamic Network CDN with verse highlight/scroll, stay-in-surah auto-play, and resume support."
  - "Shipped a production desktop app with Tauri 2.0 + Docker Compose, Cloudflare Tunnel deploy, fully offline — no account, no server, no API keys for core features."
scope:
  - "Tauri 2.0 + Next.js monorepo with native SQLite architecture."
  - "Arabic FTS5 search with diacritic stripping and multi-language query normalization."
  - "AI chatbot migrated to llama.cpp (Qwen2.5 1.5B) with extractive Bengali fallback and language auto-detection."
  - "Sunnah.com hadith import pipeline; unified three-tier corpus with grading and translator switcher."
  - "Sanad explorer: BFS level assignment, expandable nodes, hadith counts, React Flow draggable nodes, infinite canvas Map view."
  - "RadialSanad and ChainPreview views with SVG connectors and GitHub-style edge routing."
  - "Narrator search with FTS5 prefix matching, Arabic normalization, multi-language fallback."
  - "Quran audio proxy with real progress bar, reciter selection, per-verse controls."
  - "Settings page: appearance, AI model, Arabic font switcher, database sections."
  - "Dark/light mode, Bengali/Arabic bilingual UI, mobile nav, collapsible chain sections."
  - "Docker Compose, Cloudflare Tunnel deploy, Dockerfile with static path and sqlite3 binding fixes."
---