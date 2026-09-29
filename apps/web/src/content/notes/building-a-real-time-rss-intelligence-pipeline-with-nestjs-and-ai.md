---
title: "How I Built SignalStack: A Real-Time AI Intelligence Pipeline"
slug: "building-a-real-time-rss-intelligence-pipeline-with-nestjs-and-ai"
description: "A complete engineering deep dive into building a highly concurrent RSS ingestion engine, a deterministic scoring algorithm, and a multi-tier AI fallback pipeline using NestJS."
tags: ["\"NestJS\"","\"Systems Design\"","\"AI\"","\"PostgreSQL\"","\"TypeScript\""]
published_at: "2026-04-15T00:00:00+00:00"
updated_at: "2026-07-22T17:39:32.419808+00:00"
featured: false
cover_image: "https://i.ibb.co/fGzKnm2w/image-1.webp"
lang: "en"
translation_of: null
draft: false
---
## Core Architecture & Deep Dive

I chose **NestJS** for the backend because its modular architecture and dependency injection mimic the strict organizational patterns of frameworks like Laravel, but within the Node.js ecosystem. 

The backend is split into specialized modules: `FeedModule` (ingestion), `ScorerModule` (intelligence), `AIModule` (enrichment), and `AlertsModule` (Discord webhooks).

### 1. Ingestion & Feed Concurrency

Fetching dozens of RSS feeds simultaneously can easily stall the event loop or exhaust memory if not bounded. The Feed Scheduler runs every 5 minutes and uses `p-limit` alongside `Promise.allSettled`.

```typescript
// backend/src/feed/feed.service.ts
const FEED_TIMEOUT = 10_000;    // 10s per feed
const CONCURRENCY_LIMIT = 5;    // Max 5 feeds fetched at once

async fetchAllFeeds(): Promise<ScoredSignal[]> {
  const limit = pLimit(CONCURRENCY_LIMIT);
  const activeSources = await this.db.select().from(sources).where(eq(sources.isActive, true));

  // Promise.allSettled guarantees a single feed crash won't kill the batch
  const results = await Promise.allSettled(
    activeSources.map(source => limit(() => this.fetchSingleFeed(source)))
  );
  // ...
}
```

Instead of relying on heavy third-party clients like `axios`, I used Node's native `fetch` wrapped with an `AbortController` to enforce strict 10-second timeouts per feed.

### 2. Multi-Layer Deduplication

News outlets frequently update article timestamps or tweak URLs (e.g., adding `utm_source` tracking parameters), which causes traditional RSS readers to ingest duplicates. 

To solve this, I built a two-layer deduplication strategy:
1. **Application Layer:** Normalizes URLs (stripping tracking hashes) and generates a SHA-256 hash combination of the title and URL.
2. **Database Layer:** A `UNIQUE` constraint on the `hash` column in PostgreSQL prevents any race conditions from bypassing the application check (throwing a cleanly intercepted `23505` error).

---

## Key Engineering Decisions

### The Scoring Engine (AI is Expensive, Regex is Free)

It’s tempting to throw raw RSS feeds directly into an LLM and say, "Is this important?" But doing so against thousands of daily articles is incredibly slow, expensive, and error-prone.

Before AI is even involved, every imported article goes through my **Deterministic Scorer**. 

```typescript
// Final Score = Keyword Points + Entity Points + Source Trust Score
const text = `${raw.title} ${raw.content || ''}`.toLowerCase();

let score = 0;
// Example Entity Rule using Word Boundaries
const regex = new RegExp(`\\bAnthropic\\b`, 'i');
if (regex.test(text)) score += 3;

score += source.trustScore; // Baseline reputation of the RSS source (1-5)
```

Only signals that score a `7` or higher are passed into the AI Queue for summarization. This single decision reduced API overhead by 92%. On average, only ~8% of incoming signals reach the AI layer.

### The Three-Tier AI Fallback Chain

When a signal is critical enough to warrant enrichment, it hits the AI Service. To guarantee reliability without accidentally burning cash, I engineered a cascading fallback pipeline:

1. **Local (Cost: $0):** A local `llama.cpp` inference server running the highly efficient `Qwen2.5-0.5B` model. It has an 8-second timeout.
2. **Groq (Primary Cloud):** If local fails or times out, it routes to Groq for ultra-low latency inference.
3. **OpenRouter (Failover):** If Groq encounters API limits (HTTP 429), it fails over to OpenRouter.

```typescript
// backend/src/ai/ai.service.ts
for (const provider of this.providers) {
  if (!provider.key) continue;

  try {
    const result = await this.executeProvider(provider, title, content);
    if (result) return result;
  } catch (error: any) {
    if (error.response?.status === 429) {
      this.setCooldown(provider.name, 60_000); // Back off for 60 seconds
    }
    continue; // Try the next provider
  }
}
```

---

## Challenges & Solutions

### Challenge 1: API Burst Rate Limiting
Because cron jobs fetch feeds in massive batches every 5 minutes, dozens of signals might hit the AI and Discord APIs at the exact same millisecond, triggering instant `429 Too Many Requests` blocks.

**Solution:** I utilized an **RxJS-based queue** to throttle background work. By zipping a generic Subject stream with an RxJS `timer`, the system strictly meters outgoing requests (e.g., 1.5 seconds between AI jobs, 2 seconds between Discord webhook executions).

```typescript
// Throttled Queue pattern
zip(this.queue$, timer(0, 1500)).pipe(
  mergeMap(([job]) => this.processJob(job), 2)
).subscribe();
```

### Challenge 2: Local AI Hallucinations
Running a half-billion parameter model (`Qwen2.5-0.5B`) within 4GB of server RAM meant the model occasionally spat out fragmented thoughts or repeated itself.

**Solution:** I tweaked the inference parameters specifically for formatting logic rather than intelligence. Setting `n_predict` tight limits and aggressive application-side output cleaning (stripping newlines, capping at 200 chars) transformed erratic local output into clean, executive summaries. 

---

## Performance & Optimization

The entire system is deployed via a highly optimized `docker-compose` footprint. The application tier connects natively to Postgres and Redis within the container network, eliminating host-dependent overhead.

- **Storage Optimization:** Feeds older than 5 days are aggressively pruned via database crons to prevent index bloat on text-heavy columns.
- **Quota Tracking Tracking:** I attached Redis `INCR` counters mapped to ISO formatted dates with 25-hour TTLs to track daily API quotas locally without relying on external dashboard lookups.

---

## Scaling Strategy (Towards 1M Users)

While SignalStack currently runs securely on a single Proxmox VPS, the architecture is deliberately decoupled for linear horizontal scaling:

1. **Message Broker Transition:** The current RxJS and memory-backed queues would be swapped for Kafka or RabbitMQ.
2. **Worker Isolation:** The `FeedModule` and `AIModule` are completely decoupled. We could deploy 10 feed intake nodes and 5 AI processing nodes independently depending on ingestion vs. enrichment lag.
3. **Caching Layer:** Redis is currently used for rate-limiting. For a massive multi-tenant scenario, we would cache identical article URL hashes so multiple users subscribed to overlapping feeds never trigger redundant AI summarizations. 

---

## Key Learnings

1. **Architecture > Model Choice:** Architecture beats model choice. A well-designed pipeline with a 0.5B model can outperform a poorly structured system using GPT-4.
2. **Cost Control Requires Engineering:** Putting AI behind a score-gated filter, rather than processing everything, is the single highest ROI optimization you can make in modern application development.
3. **Async Systems Scale Cleanly:** By ensuring that no slow external factor (AI latency, Discord API blocks) ever halts the main event loop, the frontend dashboard remains predictably fast regardless of backend strain.

---

## Conclusion

SignalStack taught me that the perceived magic of AI is largely dependent on the boring, brilliant fundamentals surrounding it: rate limiters, fallback chains, data normalization, and connection pooling. 

If you build the pipeline correctly, the intelligence is merely a highly optimized bonus.

> **View the Source:** [github.com/fazleyrabby/signal-stack](https://github.com/fazleyrabby/signal-stack)

## Why This Matters

Most AI systems fail not because of model limitations, but because of poor system design. SignalStack demonstrates that:

- Filtering > brute forcing AI
- Queues > synchronous pipelines
- Fallbacks > assumptions

This approach turns AI from a cost center into a controlled, reliable subsystem.
