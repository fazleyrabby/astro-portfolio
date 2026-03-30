# AI Blog Automation TODO

## Phase 1 - Astro Draft Support ✅ (Plan approved, edits pending)i

- [ ] Update src/content/config.ts: Add `draft: z.boolean().default(true)` to posts schema
- [ ] Update src/pages/posts/index.astro: Filter posts to `!post.data.draft`
- [ ] Update src/pages/posts/[slug].astro: Filter getStaticPaths + runtime check

## Phase 2 - Dependencies & Setup

- [ ] `npm install telegraf openai @octokit/rest`
- [ ] Set GitHub secrets: GROQ_API_KEY, GITHUB_TOKEN, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

## Phase 3 - Context Storage

- [ ] Create data/blog-context.json

## Phase 4 - Generation Script

- [ ] Create scripts/generate-post.js (Groq + MD generation)

## Phase 5 - Telegram Bot Extension

- [ ] Create bot/telegraf-bot.js (commands, generate, approval kb)

## Phase 6 - GitHub Action

- [ ] Create .github/workflows/blog-bot.yml (cron + manual trigger)

## Testing

- [ ] `npm run generate` (test draft creation)
- [ ] `npm run bot` (test commands)
- [ ] Trigger workflow manually
- [ ] Approve via Telegram → check publish

**Current Progress: 0/20**
