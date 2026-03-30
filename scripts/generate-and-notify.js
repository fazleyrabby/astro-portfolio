/**
 * One-shot CI script: generate a blog post via AI, commit as draft to GitHub, notify via Telegram.
 * Designed for GitHub Actions (no polling, runs and exits).
 */
import OpenAI from 'openai';
import { Octokit } from '@octokit/rest';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function loadContext() {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: 'data/blog-context.json' });
    return JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
  } catch {
    return {};
  }
}

async function generatePost(context) {
  const prompt = `Write a blog post as a backend engineer working with Laravel in production.

Topic: ${context.topic || ''}

Category: ${context.category || 'general'}

Context: ${context.context || ''}

Notes: ${context.notes || ''}

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

  const contextRaw = await loadContext();
  const context = {
    topic: contextRaw.topic?.split('\n')[0] || '',
    category: contextRaw.category || '',
    context: contextRaw.context || '',
    notes: contextRaw.notes || '',
  };

  if (!context.topic) {
    console.log('No topic set. Skipping generation.');
    process.exit(0);
  }

  console.log(`Generating post for topic: ${context.topic}`);
  const post = await generatePost(context);

  const slug = post.title.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);

  const date = new Date().toISOString().split('T')[0];
  const fileContent = `---\ntitle: "${post.title}"\ndate: ${date}\ndraft: true\n---\n\n${post.content}`;

  console.log(`Committing draft: ${slug}.md`);
  await commitDraft(slug, fileContent);

  const preview = post.content.replace(/<[^>]*>/g, '').slice(0, 500) + '...';
  await sendTelegram(post.title, slug, preview);

  console.log('Done — draft committed and Telegram notification sent.');
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
