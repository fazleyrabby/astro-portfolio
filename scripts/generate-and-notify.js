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
  const prompt = `Write a blog post as a backend engineer working with Laravel in production.

Topic: ${context.topic || ''}

Category: ${context.category || 'general'}

Context: ${context.context || ''}

Notes: ${context.notes || ''}

Requirements:
Write as an experienced Laravel backend engineer describing a real production problem and solution; avoid beginner explanations and generic phrases; focus on what breaks in production, include trade-offs, edge cases (retries, race conditions, scaling), use concise first-person tone, add at least one realistic code example, follow structure (intro → problem → solution → code → conclusion), go deep on one issue only, output clean Markdown.

Output ONLY JSON:
{
  "title": "Post title",
  "content": "Markdown content"
}`;

  const completion = await openai.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
  });

  let response = completion.choices[0].message.content.trim();
  response = response.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/, '');

  try {
    return JSON.parse(response);
  } catch {
    const titleMatch = response.match(/"title"\s*:\s*"([^"]+)"/);
    const contentMatch = response.match(/"content"\s*:\s*"([\s\S]*)"\s*\}?\s*$/);
    if (!titleMatch || !contentMatch) {
      throw new Error('Could not parse AI response');
    }
    return {
      title: titleMatch[1],
      content: contentMatch[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t'),
    };
  }
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

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Approve Publish', callback_data: `approve:${slug}` }],
          [{ text: '❌ Reject Delete', callback_data: `reject:${slug}` }],
        ],
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram API error: ${err}`);
  }
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
    console.log('No topics in queue. Skipping generation.');
    process.exit(0);
  }

  const context = topics[0];
  const remainingTopics = topics.slice(1);

  console.log(`Generating post for topic: ${context.topic} (${remainingTopics.length} remaining)`);
  const post = await generatePost(context);

  const slugValue = slug(post.title);

  const now = new Date();
  const date = now.toISOString().replace(/\.\d{3}Z$/, '');
  const fileContent = `---\ntitle: "${post.title}"\ndate: ${date}\ndraft: true\n---\n\n${post.content}`;

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
