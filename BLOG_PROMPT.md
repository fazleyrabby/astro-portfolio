# 🚀 AI Blog Generation Prompt (Astro + Supabase CMS)

Use this template with your Telegram bot's `/generate` command to create high-quality, technical blog posts that match your existing portfolio style.

---

## 📝 The Full Prompt Template
*Copy the block below and replace the bracketed text with your specific topic.*

```markdown
/generate 

TOPIC: [e.g., Implementing Distributed Locking in Laravel for High-Concurrency Payments]

CONTEXT:
- Problem: Race conditions during high-volume API requests were causing duplicate database entries and incorrect balances.
- Technical Stack: Laravel 11, Redis, Supabase, Vercel.
- Key Insight: Using Atomic Locks in Redis with a custom backoff strategy is more reliable than standard database transactions for this specific scale.

REQUIREMENTS:
1. Writing Style: Senior Backend Engineer. Opinionated, first-person, focusing on "why" we made certain decisions. No beginner fluff. Skip "In this tutorial" introductions.
2. Structure: 
   - ## Introduction (The Problem)
   - ## Architectural Decisions (Trade-offs)
   - ## The Solution (The Implementation)
   - ## Key Takeaways (The Result)
3. Code: Include 1-2 high-quality, production-ready Laravel/PHP code snippets demonstrating the actual implementation.
4. Output Format: Start with YAML frontmatter containing ONLY 'title' and 'tags'. DO NOT wrap the frontmatter in markdown code blocks.

---
title: "Solving Race Conditions in Laravel Payments"
tags: ["Laravel", "Redis", "Concurrency"]
---
[Article content starts here...]
```

---

## 🧠 Why this works for your system:

1. **Parser Friendly:** Your Node.js API uses regex to extract the `title:` and `tags:`. This prompt enforces the exact format the parser expects.
2. **Instant Sync:** Once you click **Approve** in Telegram, the post is instantly inserted into Supabase (Title + Slug + Markdown) and committed to GitHub.
3. **Matched Aesthetic:** It ensures the typography (headers, lists, code blocks) matches your frontend's `prose` styling.
4. **No "Untitled" Bug:** Forces the AI to provide a title immediately so your admin list remains clean.
