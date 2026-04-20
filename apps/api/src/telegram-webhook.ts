import type { APIRoute } from "astro";
import { slug } from "github-slugger";

const TELEGRAM_TOKEN = import.meta.env.TELEGRAM_TOKEN;
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
const GROQ_API_KEY = import.meta.env.GROQ_API_KEY;
const GITHUB_REPOSITORY = import.meta.env.GITHUB_REPOSITORY || "fazleyrabby/astro-portfolio";
const DRAFTS_BRANCH = "drafts";
const CONTEXT_PATH = "data/blog-context.json";

const ghHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const update = await request.json();

    // Handle callback queries (approve/reject buttons)
    if (update.callback_query) {
      await handleCallback(update.callback_query);
      return new Response("OK", { status: 200 });
    }

    // Handle bot commands
    const message = update.message;
    if (!message?.text) return new Response("OK", { status: 200 });

    const chatId = message.chat.id;
    const text = message.text.trim();

    // SECURITY LOCK: Only process commands from your specific private chat
    const myChatId = parseInt(import.meta.env.TELEGRAM_CHAT_ID || "0", 10);
    if (chatId !== myChatId) {
      console.warn(`Unauthorized bot access attempt from chat ID: ${chatId}`);
      return new Response("Unauthorized", { status: 403 });
    }

    if (text.startsWith("/topic")) {
      const value = text.slice(6).trim();
      if (!value) return reply(chatId, "Usage: /topic <text>");
      const ctx = await loadContext();
      if (!ctx.topics) ctx.topics = [];
      ctx.topics.push({ topic: value, category: "backend", context: "", notes: "" });
      await saveContext(ctx);
      return reply(chatId, `✅ Topic added to queue (#${ctx.topics.length}): ${value}`);
    }

    if (text.startsWith("/category")) {
      const value = text.slice(9).trim();
      const ctx = await loadContext();
      ctx.category = value || "";
      await saveContext(ctx);
      return reply(chatId, `Category set: ${value || "general"}`);
    }

    if (text.startsWith("/context")) {
      const value = text.slice(8).trim();
      const ctx = await loadContext();
      ctx.context = value || "";
      await saveContext(ctx);
      return reply(chatId, `Context set: ${value || "cleared"}`);
    }

    if (text.startsWith("/note")) {
      const value = text.slice(5).trim();
      const ctx = await loadContext();
      ctx.notes = value || "";
      await saveContext(ctx);
      return reply(chatId, `Note set: ${value || "none"}`);
    }

    if (text.startsWith("/status")) {
      const ctx = await loadContext();
      const topics = ctx.topics || [];
      if (!topics.length) return reply(chatId, "📝 Queue is empty. Add topics with /topic");
      const next = topics[0];
      const list = topics.map((t, i) => `${i + 1}. ${t.topic}`).join("\n");
      return reply(chatId, `📝 Queue: ${topics.length} topic(s)\n\nNext Up:\n• ${next.topic}\n\nFull List:\n${list}`);
    }

    if (text.startsWith("/reset")) {
      await saveContext({});
      return reply(chatId, "Context reset.");
    }

    if (text.startsWith("/list")) {
      const [owner, repo] = GITHUB_REPOSITORY.split("/");
      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/src/content/posts?ref=main`,
          { headers: ghHeaders }
        );
        if (!res.ok) return reply(chatId, "No posts found.");
        const files = (await res.json()) as any[];
        const posts = files
          .filter((f: any) => f.name.endsWith(".md"))
          .map((f: any, i: number) => `${i + 1}. ${f.name.replace(".md", "")}`)
          .join("\n");
        return reply(chatId, `📋 Posts on main:\n\n${posts}\n\nUse /delete <slug> to remove.`);
      } catch {
        return reply(chatId, "Failed to fetch posts.");
      }
    }

    if (text.startsWith("/delete")) {
      const slug = text.slice(7).trim();
      if (!slug) return reply(chatId, "Usage: /delete <slug>");
      const [owner, repo] = GITHUB_REPOSITORY.split("/");
      const mdPath = `src/content/posts/${slug}.md`;
      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}?ref=main`,
          { headers: ghHeaders }
        );
        if (!res.ok) return reply(chatId, `Post not found: ${slug}`);
        const file = await res.json();
        await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`,
          {
            method: "DELETE",
            headers: ghHeaders,
            body: JSON.stringify({ message: `Delete: ${slug}`, sha: file.sha, branch: "main" }),
          }
        );
        return reply(chatId, `🗑 Deleted: ${slug}`);
      } catch (e: any) {
        return reply(chatId, `Delete failed: ${e.message}`);
      }
    }

    if (text.startsWith("/generate")) {
      await sendTelegram(chatId, "⏳ Generating post...");
      try {
        const result = await generateAndCommit();
        await sendTelegramWithButtons(chatId, result.title, result.slug, result.preview);
      } catch (e: any) {
        await sendTelegram(chatId, `Generate failed: ${e.message}`);
      }
      return new Response("OK", { status: 200 });
    }

    return new Response("OK", { status: 200 });
  } catch (e: any) {
    console.error("Webhook error:", e.message);
    return new Response("OK", { status: 200 });
  }
};

// --- Context helpers (read/write blog-context.json via GitHub API) ---

async function loadContext() {
  const [owner, repo] = GITHUB_REPOSITORY.split("/");
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${CONTEXT_PATH}?ref=main`,
      { headers: ghHeaders }
    );
    if (!res.ok) return {};
    const file = await res.json();
    return JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
  } catch {
    return {};
  }
}

async function saveContext(ctx: Record<string, string>) {
  const [owner, repo] = GITHUB_REPOSITORY.split("/");

  // Get current sha if file exists
  let sha: string | undefined;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${CONTEXT_PATH}?ref=main`,
      { headers: ghHeaders }
    );
    if (res.ok) {
      const file = await res.json();
      sha = file.sha;
    }
  } catch {}

  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${CONTEXT_PATH}`,
    {
      method: "PUT",
      headers: ghHeaders,
      body: JSON.stringify({
        message: `Update blog context`,
        content: Buffer.from(JSON.stringify(ctx, null, 2)).toString("base64"),
        branch: "main",
        ...(sha ? { sha } : {}),
      }),
    }
  );
}

// --- Generate + Commit to drafts branch ---

async function generateAndCommit() {
  const contextRaw = await loadContext();
  const context = {
    topic: contextRaw.topic?.split("\n")[0] || "",
    category: contextRaw.category || "",
    context: contextRaw.context || "",
    notes: contextRaw.notes || "",
  };

  if (!context.topic) throw new Error("No topic set. Use /topic first.");

  const prompt = `Write a blog post as a backend engineer working with Laravel in production.

Topic: ${context.topic}

Category: ${context.category || "general"}

Context: ${context.context || ""}

Notes: ${context.notes || ""}

Requirements:
- Avoid generic advice
- Focus on real-world problems
- Include practical examples
- Write in first-person
- Include code snippets
- Structure: intro → problem → solution → code → conclusion

Output ONLY JSON:
{
  "title": "Post title",
  "content": "Markdown content"
}`;

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!groqRes.ok) throw new Error(`Groq API error: ${groqRes.status}`);
  const groqData = await groqRes.json();

  let response = groqData.choices[0].message.content.trim();
  response = response.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "");

  let post: { title: string; content: string };
  try {
    post = JSON.parse(response);
  } catch {
    const titleMatch = response.match(/"title"\s*:\s*"([^"]+)"/);
    const contentMatch = response.match(/"content"\s*:\s*"([\s\S]*)"\s*\}?\s*$/);
    if (!titleMatch || !contentMatch) throw new Error("Could not parse AI response");
    post = {
      title: titleMatch[1],
      content: contentMatch[1].replace(/\\n/g, "\n").replace(/\\t/g, "\t"),
    };
  }

  const slugValue = slug(post.title);

  const date = new Date().toISOString().replace(/\.\d{3}Z$/, "");
  const fileContent = `---\ntitle: "${post.title}"\ndate: ${date}\ndraft: true\n---\n\n${post.content}`;

  // Ensure drafts branch exists
  const [owner, repo] = GITHUB_REPOSITORY.split("/");
  try {
    await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${DRAFTS_BRANCH}`, {
      headers: ghHeaders,
    }).then((r) => {
      if (!r.ok) throw new Error("not found");
    });
  } catch {
    const mainRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, {
      headers: ghHeaders,
    }).then((r) => r.json());
    await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
      method: "POST",
      headers: ghHeaders,
      body: JSON.stringify({ ref: `refs/heads/${DRAFTS_BRANCH}`, sha: mainRef.object.sha }),
    });
  }

  // Commit to drafts branch
  const mdPath = `src/content/posts/${slugValue}.md`;
  await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`, {
    method: "PUT",
    headers: ghHeaders,
    body: JSON.stringify({
      message: `Draft: ${slugValue}`,
      content: Buffer.from(fileContent).toString("base64"),
      branch: DRAFTS_BRANCH,
    }),
  });

  const preview = post.content.replace(/<[^>]*>/g, "").slice(0, 500) + "...";
  return { title: post.title, slug: slugValue, preview };
}

// --- Callback handler (approve/reject) ---

async function handleCallback(callback: any) {
  const [action, cbSlug] = callback.data.split(":");
  if (!action || !cbSlug) return;

  const [owner, repo] = GITHUB_REPOSITORY.split("/");
  // Slug may have been truncated to fit Telegram's 64-byte callback_data limit;
  // resolve the full slug by listing posts that match the prefix
  let slug = cbSlug;
  try {
    const listRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/src/content/posts?ref=${DRAFTS_BRANCH}`,
      { headers: ghHeaders }
    );
    if (listRes.ok) {
      const files: any[] = await listRes.json();
      const match = files.find((f: any) => f.name.endsWith(".md") && f.name.startsWith(cbSlug));
      if (match) slug = match.name.replace(/\.md$/, "");
    }
  } catch {}
  const mdPath = `src/content/posts/${slug}.md`;
  let resultText: string;

  if (action === "approve") {
    const ghRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}?ref=${DRAFTS_BRANCH}`,
      { headers: ghHeaders }
    );

    if (!ghRes.ok) {
      await answerCallback(callback.id, `File not found on drafts: ${slug}`);
      return;
    }

    const file = await ghRes.json();
    const content = atob(file.content);
    const published = content.replace(/\ndraft:\s*true/, "\ndraft: false");

    // Check if exists on main
    let mainSha: string | undefined;
    const mainRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}?ref=main`,
      { headers: ghHeaders }
    );
    if (mainRes.ok) {
      mainSha = (await mainRes.json()).sha;
    }

    // Commit to main
    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`, {
      method: "PUT",
      headers: ghHeaders,
      body: JSON.stringify({
        message: `Publish: ${slug}`,
        content: btoa(published),
        branch: "main",
        ...(mainSha ? { sha: mainSha } : {}),
      }),
    });

    // Delete from drafts
    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`, {
      method: "DELETE",
      headers: ghHeaders,
      body: JSON.stringify({ message: `Clean draft: ${slug}`, sha: file.sha, branch: DRAFTS_BRANCH }),
    });

    resultText = `✅ Published: ${slug}`;
  } else {
    const ghRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}?ref=${DRAFTS_BRANCH}`,
      { headers: ghHeaders }
    );

    if (!ghRes.ok) {
      await answerCallback(callback.id, `File not found: ${slug}`);
      return;
    }

    const file = await ghRes.json();
    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`, {
      method: "DELETE",
      headers: ghHeaders,
      body: JSON.stringify({ message: `Reject: ${slug}`, sha: file.sha, branch: DRAFTS_BRANCH }),
    });

    resultText = `❌ Deleted: ${slug}`;
  }

  await answerCallback(callback.id, resultText);
  await editMessage(callback.message.chat.id, callback.message.message_id, resultText);
}

// --- Telegram helpers ---

async function reply(chatId: number, text: string) {
  await sendTelegram(chatId, text);
  return new Response("OK", { status: 200 });
}

async function sendTelegram(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

function escapeMarkdown(text: string) {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

async function sendTelegramWithButtons(chatId: number, title: string, slug: string, preview: string) {
  const text = `📝 New draft: *${escapeMarkdown(title)}*\n\n${escapeMarkdown(preview)}`;
  // Telegram callback_data has a 64-byte limit; truncate slug to fit with longest prefix ("approve:")
  const cbSlug = slug.length > 56 ? slug.slice(0, 56) : slug;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "MarkdownV2",
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Approve Publish", callback_data: `approve:${cbSlug}` }],
          [{ text: "❌ Reject Delete", callback_data: `reject:${cbSlug}` }],
        ],
      },
    }),
  });
}

async function answerCallback(callbackId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId, text }),
  });
}

async function editMessage(chatId: number, messageId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text }),
  });
}
