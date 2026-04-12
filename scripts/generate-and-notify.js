/**
 * One-shot CI script: generate a blog post via AI, commit as draft to GitHub, notify via Telegram.
 * Designed for GitHub Actions (no polling, runs and exits).
 */
import 'dotenv/config';
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';
import { slug } from 'github-slugger';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function loadTopics() {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: 'data/blog-context.json' });
    const parsed = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
    return parsed.topics || [];
  } catch {
    return [];
  }
}

async function removeUsedTopic(remainingTopics) {
  const { data } = await octokit.repos.getContent({ owner, repo, path: 'data/blog-context.json' });
  const content = JSON.stringify({ topics: remainingTopics }, null, 2) + '\n';
  await octokit.repos.createOrUpdateFileContents({
    owner, repo,
    path: 'data/blog-context.json',
    message: 'Remove used topic from queue',
    content: Buffer.from(content).toString('base64'),
    sha: data.sha,
  });
}

async function generatePost(context) {
  const prompt = `You are a senior backend engineer (expert in Laravel, Node.js, and Systems Design). Write a technical, portfolio-grade blog post.

TOPIC: ${context.topic || ''}
CATEGORY: ${context.category || 'general'}
CONTEXT / BACKGROUND: ${context.context || 'None provided. Focus on real-world best practices.'}
SPECIFIC NOTES: ${context.notes || 'None provided. Fill in with practical scenarios.'}

REQUIREMENTS:
- Tone: Professional, first-person, insightful (like a 10x engineer's case study). Avoid beginner explanations. Give deep insights into trade-offs and edge cases.
- Density: Keep it extremely concise and dense with value (around 600-800 words max) to respect token limits. NO fluff.
- Structure: Start with a strong intro/problem statement. Move into architectural decisions, the solution, code snippets, and finally key takeaways.
- Code: Include practical, real-world code snippets demonstrating the solution.
- Formatting: Use proper markdown headings (##, ###), lists, and code blocks.

OUTPUT FORMAT:
Do NOT output JSON. Output raw Markdown only.
Begin your response EXACTLY with a YAML frontmatter block containing ONLY a "title" field and a "tags" field (an array of 3-5 concise technical tags).

Example:
---
title: "Your High-Quality Post Title"
tags: ["Laravel", "Database", "Scale"]
---
Your article content starts here...`;

  const completion = await openai.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
  });

  let response = completion.choices[0].message.content.trim();
  response = response.replace(/^```(?:markdown|md)?\s*\n?/i, '').replace(/\n?```\s*$/, '');

  let title = "New Engineering Post";
  let tags = [];
  let markdownContent = response;

  // Match full frontmatter block (may contain title, tags, and other fields)
  const fmBlockMatch = response.match(/^---\n([\s\S]*?)\n---/);
  if (fmBlockMatch) {
    const fmBody = fmBlockMatch[1];
    const titleMatch = fmBody.match(/title:\s*"?([^"\n]+)"?/);
    const tagsMatch = fmBody.match(/tags:\s*(\[.*?\])/);
    if (titleMatch) title = titleMatch[1].trim();
    if (tagsMatch) {
      try { tags = JSON.parse(tagsMatch[1]); } catch { tags = []; }
    }
    markdownContent = response.substring(fmBlockMatch[0].length).trim();
  } else {
    const lines = response.split('\n');
    if (lines[0].startsWith('# ')) {
      title = lines[0].replace(/^#\s*/, '').replace(/"/g, '').trim();
      markdownContent = lines.slice(1).join('\n').trim();
    }
  }

  return { title, tags, content: markdownContent };
}

async function commitDraft(slug, fileContent) {
  const path = `src/content/posts/${slug}.md`;

  // Check if file already exists
  try {
    await octokit.repos.getContent({ owner, repo, path });
    throw new Error(`Post already exists: ${slug}`);
  } catch (e) {
    if (e.status !== 404) throw e;
  }

  await octokit.repos.createOrUpdateFileContents({
    owner, repo, path,
    message: `Draft: ${slug}`,
    content: Buffer.from(fileContent).toString('base64'),
  });

  return path;
}

async function sendTelegram(title, slug, preview) {
  const text = `📝 New draft: *${escapeMarkdown(title)}*\n\n${escapeMarkdown(preview)}`;
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  // Telegram callback_data has a 64-byte limit; truncate slug to fit with prefix
  const cbSlug = slug.length > 62 ? slug.slice(0, 62) : slug;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Approve Publish', callback_data: `a:${cbSlug}` }],
          [{ text: '❌ Reject Delete', callback_data: `r:${cbSlug}` }],
        ],
      },
    }),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(`Telegram API error: ${JSON.stringify(result)}`);
  }
  console.log(`Telegram Bot says: Message Sent! ✅ (ID: ${result.result.message_id})`);
}

function escapeMarkdown(text) {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

async function main() {
  if (!owner || !repo) throw new Error('GITHUB_REPOSITORY must be set (owner/repo)');
  if (!TELEGRAM_TOKEN) throw new Error('TELEGRAM_TOKEN must be set');
  if (!CHAT_ID) throw new Error('TELEGRAM_CHAT_ID must be set');

  const topics = await loadTopics();

  if (!topics.length) {
    const text = "🚨 *Blog Queue Empty* \nNo topics left in the generation queue. Please add some via the /topic command!";
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "MarkdownV2" }),
    });
    console.log("No topics in queue. Sent reminder to user.");
    process.exit(0);
  }

  const context = topics[0];
  const remainingTopics = topics.slice(1);

  console.log(`Generating post for topic: ${context.topic} (${remainingTopics.length} remaining)`);
  const post = await generatePost(context);

  const slugValue = slug(post.title);

  const now = new Date();
  const date = now.toISOString().replace(/\.\d{3}Z$/, '');
  const tagsLine = post.tags.length ? `\ntags: ${JSON.stringify(post.tags)}` : '';
  const fileContent = `---\ntitle: "${post.title}"\ndate: ${date}\ndraft: true${tagsLine}\n---\n\n${post.content}`;

  console.log(`Committing draft: ${slugValue}.md`);
  await commitDraft(slugValue, fileContent);

  const preview = post.content.replace(/<[^>]*>/g, '').slice(0, 500) + '...';
  await sendTelegram(post.title, slugValue, preview);

  await removeUsedTopic(remainingTopics);
  console.log(`Done — draft committed, topic removed from queue (${remainingTopics.length} left).`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
