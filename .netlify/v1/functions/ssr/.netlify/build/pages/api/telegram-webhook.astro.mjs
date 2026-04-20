import { slug } from 'github-slugger';
export { renderers } from '../../renderers.mjs';

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || "fazleyrabby/astro-portfolio";
const DRAFTS_BRANCH = "drafts";
const CONTEXT_PATH = "data/blog-context.json";
const ghHeaders = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json"
};
const POST = async ({ request }) => {
  try {
    const update = await request.json();
    if (update.callback_query) {
      await handleCallback(update.callback_query);
      return new Response("OK", { status: 200 });
    }
    const message = update.message;
    if (!message?.text) return new Response("OK", { status: 200 });
    const chatId = message.chat.id;
    const text = message.text.trim();
    const myChatId = parseInt(process.env.TELEGRAM_CHAT_ID || "0", 10);
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
      return reply(chatId, `📝 Queue: ${topics.length} topic(s)

Next Up:
• ${next.topic}

Full List:
${list}`);
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
        const files = await res.json();
        const posts = files.filter((f) => f.name.endsWith(".md")).map((f, i) => `${i + 1}. ${f.name.replace(".md", "")}`).join("\n");
        return reply(chatId, `📋 Posts on main:

${posts}

Use /delete <slug> to remove.`);
      } catch {
        return reply(chatId, "Failed to fetch posts.");
      }
    }
    if (text.startsWith("/delete")) {
      const slug2 = text.slice(7).trim();
      if (!slug2) return reply(chatId, "Usage: /delete <slug>");
      const [owner, repo] = GITHUB_REPOSITORY.split("/");
      const mdPath = `src/content/posts/${slug2}.md`;
      try {
        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}?ref=main`,
          { headers: ghHeaders }
        );
        if (!res.ok) return reply(chatId, `Post not found: ${slug2}`);
        const file = await res.json();
        await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`,
          {
            method: "DELETE",
            headers: ghHeaders,
            body: JSON.stringify({ message: `Delete: ${slug2}`, sha: file.sha, branch: "main" })
          }
        );
        return reply(chatId, `🗑 Deleted: ${slug2}`);
      } catch (e) {
        return reply(chatId, `Delete failed: ${e.message}`);
      }
    }
    if (text.startsWith("/generate")) {
      await sendTelegram(chatId, "⏳ Generating post...");
      try {
        const result = await generateAndCommit();
        await sendTelegramWithButtons(chatId, result.title, result.slug, result.preview);
      } catch (e) {
        await sendTelegram(chatId, `Generate failed: ${e.message}`);
      }
      return new Response("OK", { status: 200 });
    }
    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("Webhook error:", e.message);
    return new Response("OK", { status: 200 });
  }
};
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
async function saveContext(ctx) {
  const [owner, repo] = GITHUB_REPOSITORY.split("/");
  let sha;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${CONTEXT_PATH}?ref=main`,
      { headers: ghHeaders }
    );
    if (res.ok) {
      const file = await res.json();
      sha = file.sha;
    }
  } catch {
  }
  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${CONTEXT_PATH}`,
    {
      method: "PUT",
      headers: ghHeaders,
      body: JSON.stringify({
        message: `Update blog context`,
        content: Buffer.from(JSON.stringify(ctx, null, 2)).toString("base64"),
        branch: "main",
        ...sha ? { sha } : {}
      })
    }
  );
}
async function generateAndCommit() {
  const contextRaw = await loadContext();
  const context = {
    topic: contextRaw.topic?.split("\n")[0] || "",
    category: contextRaw.category || "",
    context: contextRaw.context || "",
    notes: contextRaw.notes || ""
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
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!groqRes.ok) throw new Error(`Groq API error: ${groqRes.status}`);
  const groqData = await groqRes.json();
  let response = groqData.choices[0].message.content.trim();
  response = response.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/, "");
  let post;
  try {
    post = JSON.parse(response);
  } catch {
    const titleMatch = response.match(/"title"\s*:\s*"([^"]+)"/);
    const contentMatch = response.match(/"content"\s*:\s*"([\s\S]*)"\s*\}?\s*$/);
    if (!titleMatch || !contentMatch) throw new Error("Could not parse AI response");
    post = {
      title: titleMatch[1],
      content: contentMatch[1].replace(/\\n/g, "\n").replace(/\\t/g, "	")
    };
  }
  const slugValue = slug(post.title);
  const date = (/* @__PURE__ */ new Date()).toISOString().replace(/\.\d{3}Z$/, "");
  const fileContent = `---
title: "${post.title}"
date: ${date}
draft: true
---

${post.content}`;
  const [owner, repo] = GITHUB_REPOSITORY.split("/");
  try {
    await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${DRAFTS_BRANCH}`, {
      headers: ghHeaders
    }).then((r) => {
      if (!r.ok) throw new Error("not found");
    });
  } catch {
    const mainRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, {
      headers: ghHeaders
    }).then((r) => r.json());
    await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
      method: "POST",
      headers: ghHeaders,
      body: JSON.stringify({ ref: `refs/heads/${DRAFTS_BRANCH}`, sha: mainRef.object.sha })
    });
  }
  const mdPath = `src/content/posts/${slugValue}.md`;
  await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`, {
    method: "PUT",
    headers: ghHeaders,
    body: JSON.stringify({
      message: `Draft: ${slugValue}`,
      content: Buffer.from(fileContent).toString("base64"),
      branch: DRAFTS_BRANCH
    })
  });
  const preview = post.content.replace(/<[^>]*>/g, "").slice(0, 500) + "...";
  return { title: post.title, slug: slugValue, preview };
}
async function handleCallback(callback) {
  const [action, cbSlug] = callback.data.split(":");
  if (!action || !cbSlug) return;
  const [owner, repo] = GITHUB_REPOSITORY.split("/");
  let slug2 = cbSlug;
  try {
    const listRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/src/content/posts?ref=${DRAFTS_BRANCH}`,
      { headers: ghHeaders }
    );
    if (listRes.ok) {
      const files = await listRes.json();
      const match = files.find((f) => f.name.endsWith(".md") && f.name.startsWith(cbSlug));
      if (match) slug2 = match.name.replace(/\.md$/, "");
    }
  } catch {
  }
  const mdPath = `src/content/posts/${slug2}.md`;
  let resultText;
  if (action === "approve") {
    const ghRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}?ref=${DRAFTS_BRANCH}`,
      { headers: ghHeaders }
    );
    if (!ghRes.ok) {
      await answerCallback(callback.id, `File not found on drafts: ${slug2}`);
      return;
    }
    const file = await ghRes.json();
    const content = atob(file.content);
    const published = content.replace(/\ndraft:\s*true/, "\ndraft: false");
    let mainSha;
    const mainRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}?ref=main`,
      { headers: ghHeaders }
    );
    if (mainRes.ok) {
      mainSha = (await mainRes.json()).sha;
    }
    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`, {
      method: "PUT",
      headers: ghHeaders,
      body: JSON.stringify({
        message: `Publish: ${slug2}`,
        content: btoa(published),
        branch: "main",
        ...mainSha ? { sha: mainSha } : {}
      })
    });
    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`, {
      method: "DELETE",
      headers: ghHeaders,
      body: JSON.stringify({ message: `Clean draft: ${slug2}`, sha: file.sha, branch: DRAFTS_BRANCH })
    });
    resultText = `✅ Published: ${slug2}`;
  } else {
    const ghRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}?ref=${DRAFTS_BRANCH}`,
      { headers: ghHeaders }
    );
    if (!ghRes.ok) {
      await answerCallback(callback.id, `File not found: ${slug2}`);
      return;
    }
    const file = await ghRes.json();
    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`, {
      method: "DELETE",
      headers: ghHeaders,
      body: JSON.stringify({ message: `Reject: ${slug2}`, sha: file.sha, branch: DRAFTS_BRANCH })
    });
    resultText = `❌ Deleted: ${slug2}`;
  }
  await answerCallback(callback.id, resultText);
  await editMessage(callback.message.chat.id, callback.message.message_id, resultText);
}
async function reply(chatId, text) {
  await sendTelegram(chatId, text);
  return new Response("OK", { status: 200 });
}
async function sendTelegram(chatId, text) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
}
function escapeMarkdown(text) {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
async function sendTelegramWithButtons(chatId, title, slug2, preview) {
  const text = `📝 New draft: *${escapeMarkdown(title)}*

${escapeMarkdown(preview)}`;
  const cbSlug = slug2.length > 56 ? slug2.slice(0, 56) : slug2;
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
          [{ text: "❌ Reject Delete", callback_data: `reject:${cbSlug}` }]
        ]
      }
    })
  });
}
async function answerCallback(callbackId, text) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId, text })
  });
}
async function editMessage(chatId, messageId, text) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text })
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
