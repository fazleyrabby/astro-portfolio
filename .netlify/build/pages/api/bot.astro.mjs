import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { Octokit } from '@octokit/rest';
export { renderers } from '../../renderers.mjs';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN || process.env.TELEGRAM_TOKEN);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN });
const REPO = process.env.GITHUB_REPOSITORY || process.env.GITHUB_REPOSITORY || "fazleyrabby/astro-portfolio";
const ALLOWED_USER_ID = parseInt(process.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID);
const CONTEXT_PATH = "data/blog-context.json";
bot.use(async (ctx, next) => {
  const fromId = ctx.from?.id;
  if (fromId !== ALLOWED_USER_ID) {
    console.warn(`Unauthorized access attempt from user: ${fromId}`);
    if (ctx.updateType === "callback_query") {
      return ctx.answerCbQuery("⛔ Error: Unauthorized user.");
    }
    return;
  }
  return next();
});
async function loadContext() {
  const [owner, repo] = REPO.split("/");
  try {
    const { data: file } = await octokit.repos.getContent({ owner, repo, path: CONTEXT_PATH, ref: "main" });
    return JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
  } catch (e) {
    console.error("Error loading context:", e.message);
    return { topics: [] };
  }
}
async function saveContext(ctx) {
  const [owner, repo] = REPO.split("/");
  try {
    let sha;
    try {
      const { data: file } = await octokit.repos.getContent({ owner, repo, path: CONTEXT_PATH, ref: "main" });
      sha = file.sha;
    } catch {
    }
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: CONTEXT_PATH,
      message: "Update blog context",
      content: Buffer.from(JSON.stringify(ctx, null, 2)).toString("base64"),
      branch: "main",
      ...sha ? { sha } : {}
    });
  } catch (e) {
    console.error("Error saving context:", e.message);
  }
}
bot.hears(/^\s*\/topic(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || "").trim();
  if (!text) return ctx.reply("Usage: /topic <topic_text>");
  const data = await loadContext();
  if (!data.topics) data.topics = [];
  data.topics.push({ topic: text, category: "backend", context: "", notes: "" });
  await saveContext(data);
  ctx.reply(`✅ Topic added (#${data.topics.length}): ${text}`);
});
bot.hears(/^\s*\/status(?:\s+|$)/, async (ctx) => {
  const data = await loadContext();
  const topics = data.topics || [];
  if (!topics.length) return ctx.reply("📝 Queue is empty. Add topics with /topic");
  const next = topics[topics.length - 1];
  let msg = `📝 Queue: ${topics.length} topic(s)

Last added:
• Topic: ${next.topic}
• Category: ${next.category || "general"}
• Context: ${next.context || "none"}
• Notes: ${next.notes || "none"}`;
  ctx.reply(msg);
});
bot.hears(/^\s*\/category(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || "").trim();
  const data = await loadContext();
  if (!data.topics?.length) return ctx.reply("No topics in queue. Add one first with /topic");
  data.topics[data.topics.length - 1].category = text || "general";
  await saveContext(data);
  ctx.reply(`Category set: ${text || "general"}`);
});
bot.hears(/^\s*\/context(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || "").trim();
  const data = await loadContext();
  if (!data.topics?.length) return ctx.reply("No topics in queue. Add one first with /topic");
  data.topics[data.topics.length - 1].context = text || "";
  await saveContext(data);
  ctx.reply(`Context set: ${text || "cleared"}`);
});
bot.hears(/^\s*\/note(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || "").trim();
  const data = await loadContext();
  if (!data.topics?.length) return ctx.reply("No topics in queue. Add one first with /topic");
  data.topics[data.topics.length - 1].notes = text || "";
  await saveContext(data);
  ctx.reply(`Note set: ${text || "none"}`);
});
bot.hears(/^\s*\/reset(?:\s+|$)/, async (ctx) => {
  await saveContext({ topics: [] });
  ctx.reply("🗑 Queue cleared.");
});
bot.hears(/^\s*\/list(?:\s+|$)/, async (ctx) => {
  const [owner, repo] = REPO.split("/");
  try {
    const { data: files } = await octokit.repos.getContent({ owner, repo, path: "src/content/posts", ref: "main" });
    const posts = files.filter((f) => f.name.endsWith(".md")).map((f, i) => `${i + 1}. ${f.name.replace(".md", "")}`).join("\n");
    ctx.reply(`📋 Published Posts:

${posts || "No posts found."}

Use /delete <slug> to remove.`);
  } catch (e) {
    ctx.reply(`Error fetching posts: ${e.message}`);
  }
});
bot.hears(/^\s*\/delete(?:\s+|$)(.*)/s, async (ctx) => {
  const input = (ctx.match[1] || "").trim();
  if (!input) return ctx.reply("Usage: /delete <slug>");
  const [owner, repo] = REPO.split("/");
  const mdPath = `src/content/posts/${input}.md`;
  try {
    const { data: file } = await octokit.repos.getContent({ owner, repo, path: mdPath, ref: "main" });
    await octokit.repos.deleteFile({
      owner,
      repo,
      path: mdPath,
      message: `Delete: ${input}`,
      sha: file.sha,
      branch: "main"
    });
    ctx.reply(`🗑 Deleted: ${input}`);
  } catch (e) {
    ctx.reply(`Delete failed: ${e.message}`);
  }
});
bot.hears(/^\s*\/generate(?:\s+|$)/, async (ctx) => {
  ctx.reply("⏳ This command usually runs via the scripts/generate-post.js script.\nFor serverless generation, please use /topic first to set details.");
});
bot.hears(/^\s*\/feature(?:\s+|$)(.*)/s, async (ctx) => {
  const input = (ctx.match[1] || "").trim();
  if (!input) return ctx.reply("Usage: /feature <slug>");
  const [owner, repo] = REPO.split("/");
  const mdPath = `src/content/posts/${input}.md`;
  try {
    const { data: file } = await octokit.repos.getContent({ owner, repo, path: mdPath });
    let content = Buffer.from(file.content, "base64").toString("utf8");
    if (content.includes("featured: true")) {
      content = content.replace("\nfeatured: true", "\nfeatured: false");
      ctx.reply(`Un-featured: ${input}`);
    } else {
      if (content.includes("featured:")) {
        content = content.replace(/\nfeatured:\s*(true|false)/, "\nfeatured: true");
      } else {
        content = content.replace("---\n", "---\nfeatured: true\n");
      }
      ctx.reply(`🌟 Featured: ${input}`);
    }
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: mdPath,
      message: `Toggle featured: ${input}`,
      content: Buffer.from(content).toString("base64"),
      sha: file.sha
    });
  } catch (e) {
    ctx.reply(`Error: ${e.message}`);
  }
});
bot.on("callback_query", async (ctx) => {
  const [tag, cbSlug] = ctx.callbackQuery.data.split(":");
  const action = tag === "a" || tag === "approve" ? "approve" : "reject";
  const [owner, repo] = REPO.split("/");
  console.log(`Webhook received click: ${action} for ${cbSlug}`);
  try {
    await ctx.answerCbQuery(action === "approve" ? "Publishing..." : "Deleting...");
  } catch (e) {
  }
  try {
    let slug2 = cbSlug;
    try {
      const { data: files } = await octokit.repos.getContent({ owner, repo, path: "src/content/posts" });
      const match = files.find((f) => f.name.endsWith(".md") && f.name.startsWith(cbSlug));
      if (match) slug2 = match.name.replace(/\.md$/, "");
    } catch {
    }
    const mdPath = `src/content/posts/${slug2}.md`;
    const { data: file } = await octokit.repos.getContent({ owner, repo, path: mdPath });
    if (action === "approve") {
      const content = Buffer.from(file.content, "base64").toString("utf8");
      if (!content.includes("draft: true")) {
        await ctx.editMessageText(`✅ Successfully Published: ${slug2}`);
        return;
      }
      const newContent = content.replace(/\ndraft:\s*(true|false)/, "\ndraft: false");
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: mdPath,
        message: `Publish: ${slug2}`,
        content: Buffer.from(newContent).toString("base64"),
        sha: file.sha
      });
    } else {
      await octokit.repos.deleteFile({
        owner,
        repo,
        path: mdPath,
        message: `Reject: ${slug2}`,
        sha: file.sha
      });
    }
    await ctx.editMessageText(`${action === "approve" ? "✅ Published" : "❌ Deleted"}: ${slug2}`);
    console.log(`Successfully ${action === "approve" ? "published" : "deleted"} ${slug2}`);
  } catch (e) {
    console.error(`Callback Error: ${e.message}`);
    if (e.status === 409 || e.message.includes("expected")) {
      await ctx.editMessageText(`✅ Published (sync): ${slug}`);
    } else {
      await ctx.reply(`Error performing ${action}: ${e.message}`);
    }
  }
});
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    console.log("Incoming update:", body.update_id);
    await bot.handleUpdate(body);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error("Bot Handler Error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
