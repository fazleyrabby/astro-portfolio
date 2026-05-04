import "dotenv/config";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fetch from "node-fetch";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { slug as slugify } from "github-slugger";

const __dir = "/home/fazley/apps/cms";
const logFile = join(__dir, "auto-generate.log");
const contextsFile = join(__dir, "contexts.json");
const draftsFile = join(__dir, "drafts.json");

function log(msg) {
    const ts = new Date().toISOString();
    const line = "[" + ts + "] " + msg + "\n";
    appendFileSync(logFile, line);
    console.log(msg);
}

const BOT_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GROQ_KEY = process.env.GROQ_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;

async function sendTelegram(text, reply_markup = null) {
    if (!BOT_TOKEN || !CHAT_ID) { log("Telegram not configured"); return; }
    const body = { chat_id: CHAT_ID, text, parse_mode: "HTML" };
    if (reply_markup) body.reply_markup = reply_markup;
    await fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
}

async function generatePost(context) {
    const openai = new OpenAI({ apiKey: GROQ_KEY, baseURL: "https://api.groq.com/openai/v1" });

    const prompt = `You are a senior backend engineer writing for a technical blog. Your writing style is conversational, direct, and practical — like explaining to a colleague.

TOPIC: ${context.topic}
FOCUS: ${context.focus}

Write the article in THIS exact style:
1. Opening hook: Start with "The Problem with [Topic]" — explain WHY this matters in production.
2. Architecture: Explain the solution before showing code.
3. Code sections: Production-ready Laravel code with use statements. No placeholders.
4. Common Pitfalls: Section on mistakes developers make.
5. Key Takeaways: Bullet points at the end.

OUTPUT FORMAT:
---
title: "Generated Title"
tags: ["Laravel", relevant, tags]
---

## The Problem with [Topic]

[Direct explanation]

## [Main Section]

[Explanation]

### The Implementation

\`\`\`php
<?php
use Illuminate\\Support\\Facades\\Queue;

class ExampleController extends Controller
{
    public function handle(Request $request)
    {
        Queue::dispatch(new ProcessJob($request->all()));
        return response()->json(["status" => "received"], 202);
    }
}
\`\`\`

## Common Pitfalls

- Pitfall 1
- Pitfall 2

## Key Takeaways

- Bullet 1
- Bullet 2

DO NOT wrap YAML in code blocks.`;

    const completion = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
    });

    let response = completion.choices[0].message.content.trim();
    response = response.replace(/^```(?:markdown|md)?\s*\n?/i, "").replace(/\n?```\s*$/, "");

    let title = context.topic, tags = [], content = response;

    const fmMatch = response.match(/^---\n([\s\S]*?)\n---\n?/);
    if (fmMatch) {
        const body = fmMatch[1];
        const tMatch = body.match(/title:\s*"?([^"\n]+)"?/);
        const tagMatch = body.match(/tags:\s*(\[.*?\])/);
        if (tMatch) title = tMatch[1].trim();
        if (tagMatch) { try { tags = JSON.parse(tagMatch[1]); } catch {} }
        content = response.substring(fmMatch[0].length).trim();
    }

    return { title, tags, content, slug: slugify(title), topic: context.topic };
}

async function main() {
    log("=== AUTO-GENERATE STARTED ===");
    try {
        let contexts = JSON.parse(readFileSync(contextsFile, "utf-8"));
        
        if (contexts.length === 0) {
            log("All topics exhausted");
            await sendTelegram("⏭️ <b>Auto-Generate</b>\n\nAll topics used. Update contexts.json.");
            return;
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        const { data: existing } = await supabase.from("posts").select("slug");
        const usedSlugs = new Set((existing || []).map(p => p.slug));

        let context = null;
        let contextIndex = -1;
        for (let i = 0; i < contexts.length; i++) {
            if (!usedSlugs.has(slugify(contexts[i].topic))) {
                context = contexts[i];
                contextIndex = i;
                break;
            }
        }

        if (!context) {
            log("All remaining topics already exist as posts");
            await sendTelegram("⏭️ <b>Auto-Generate</b>\n\nAll remaining topics exist. Update contexts.json.");
            return;
        }

        log("Generating: " + context.topic);
        const post = await generatePost(context);
        
        // Remove used context from JSON file
        contexts.splice(contextIndex, 1);
        writeFileSync(contextsFile, JSON.stringify(contexts, null, 2));
        log("Removed context from list: " + context.topic);

        // Save draft to file (server.js will handle publish)
        const drafts = JSON.parse(readFileSync(draftsFile, "utf-8") || "[]");
        drafts.push({ slug: post.slug, post, timestamp: Date.now() });
        writeFileSync(draftsFile, JSON.stringify(drafts, null, 2));

        const preview = post.content.slice(0, 400) + "...";

        await sendTelegram(
            "🤖 <b>AUTO-GENERATED DRAFT</b>\n\n" +
            "<b>Topic:</b> " + post.topic + "\n" +
            "<b>Title:</b> " + post.title + "\n" +
            "<b>Slug:</b> <code>" + post.slug + "</code>\n" +
            "<b>Tags:</b> " + (post.tags.join(", ") || "none") + "\n" +
            "<b>Remaining:</b> " + contexts.length + " topics\n\n" +
            "Preview:\n" + preview,
            {
                inline_keyboard: [
                    [{ text: "✅ Publish", callback_data: "p_app:" + post.slug }],
                    [{ text: "❌ Reject", callback_data: "p_rej:" + post.slug }]
                ]
            }
        );

        log("Draft sent with buttons: " + post.slug);
        log("=== AUTO-GENERATE COMPLETED ===");

    } catch (err) {
        log("ERROR: " + err.message);
        await sendTelegram("❌ <b>Auto-Generate Failed</b>\n\nError: " + err.message);
    }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
