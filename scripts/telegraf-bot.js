import { Telegraf } from 'telegraf';
import { execSync } from 'child_process';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { Octokit } from '@octokit/rest';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const contextPath = path.join(__dirname, '../data/blog-context.json');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const REPO = process.env.GITHUB_REPOSITORY || 'rabbi/astro-portfolio';

let pendingSlug = null;

async function loadQueue() {
  try {
    const data = await fs.readFile(contextPath, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.topics || [];
  } catch {
    return [];
  }
}

async function saveQueue(topics) {
  await fs.writeFile(contextPath, JSON.stringify({ topics }, null, 2));
}

// Commands

bot.command('add', async (ctx) => {
  const text = ctx.message.text.slice(5).trim();
  if (!text) return ctx.reply('Usage: /add <topic>');
  const topics = await loadQueue();
  topics.push({ topic: text, category: 'backend', context: '', notes: '' });
  await saveQueue(topics);
  ctx.reply(`Topic added (#${topics.length} in queue): ${text}`);
});

bot.command('topic', async (ctx) => {
  const text = ctx.message.text.slice(7).trim();
  if (!text) return ctx.reply('Usage: /topic <topic>\nAdds a full topic. Use /category, /context, /note to set details on the last added topic.');
  const topics = await loadQueue();
  topics.push({ topic: text, category: 'backend', context: '', notes: '' });
  await saveQueue(topics);
  ctx.reply(`Topic added (#${topics.length} in queue): ${text}`);
});

bot.command('context', async (ctx) => {
  const text = ctx.message.text.slice(9).trim();
  const topics = await loadQueue();
  if (!topics.length) return ctx.reply('No topics in queue. Add one first with /topic');
  topics[topics.length - 1].context = text || '';
  await saveQueue(topics);
  ctx.reply(`Context set on last topic: ${text || 'cleared'}`);
});

bot.command('category', async (ctx) => {
  const text = ctx.message.text.slice(10).trim();
  const topics = await loadQueue();
  if (!topics.length) return ctx.reply('No topics in queue. Add one first with /topic');
  topics[topics.length - 1].category = text || 'general';
  await saveQueue(topics);
  ctx.reply(`Category set on last topic: ${text || 'general'}`);
});

bot.command('note', async (ctx) => {
  const text = ctx.message.text.slice(6).trim();
  const topics = await loadQueue();
  if (!topics.length) return ctx.reply('No topics in queue. Add one first with /topic');
  topics[topics.length - 1].notes = text || '';
  await saveQueue(topics);
  ctx.reply(`Note set on last topic: ${text || 'none'}`);
});

bot.command('status', async (ctx) => {
  const topics = await loadQueue();
  if (!topics.length) return ctx.reply('📝 Queue is empty. Add topics with /topic');
  const next = topics[0];
  let msg = `📝 Queue: ${topics.length} topic(s)\n\nNext up:\n• Topic: ${next.topic}\n• Category: ${next.category || 'general'}\n• Context: ${next.context || 'none'}\n• Notes: ${next.notes || 'none'}`;
  if (topics.length > 1) {
    msg += '\n\nUpcoming:';
    topics.slice(1).forEach((t, i) => { msg += `\n${i + 2}. ${t.topic}`; });
  }
  ctx.reply(msg);
});

bot.command('reset', async (ctx) => {
  await saveQueue([]);
  ctx.reply('Queue cleared.');
});

bot.command('generate', async (ctx) => {
  try {
    execSync('node scripts/generate-post.js', { stdio: 'inherit', env: process.env });
    const postsDir = path.join(__dirname, '../src/content/posts');
    const files = await fs.readdir(postsDir);
    const drafts = files.filter(f => f.endsWith('.md'));
    if (!drafts.length) throw new Error('No draft generated');
    drafts.sort((a, b) => fsSync.statSync(path.join(postsDir, b)).mtime.getTime() - fsSync.statSync(path.join(postsDir, a)).mtime.getTime());
    const latest = drafts[0];
    const slug = path.basename(latest, '.md');
    const content = await fs.readFile(path.join(postsDir, latest), 'utf8');
    const titleMatch = content.match(/title: "(.+?)"/);
    const title = titleMatch ? titleMatch[1] : 'New Post';
    const bodyStart = content.indexOf('\n\n\n') + 3;
    const rawPreview = content.slice(bodyStart, bodyStart + 800) + '...';
    // Strip HTML tags and escape Markdown special chars for Telegram
    const preview = rawPreview
      .replace(/<[^>]*>/g, '')
      .replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
    pendingSlug = slug;
    // Commit and push so GitHub API can find the file for approve/reject
    execSync(`git add "${path.relative(path.join(__dirname, '..'), path.join(postsDir, latest))}" && git commit -m "Draft: ${slug}" && git push`, {
      cwd: path.join(__dirname, '..'),
      env: process.env,
      stdio: 'pipe',
    });
    ctx.reply(`New draft: *${title.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1')}*\n\n${preview}`, {
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Approve Publish', callback_data: `approve:${slug}` }],
          [{ text: '❌ Reject Delete', callback_data: `reject:${slug}` }]
        ]
      }
    });
  } catch (e) {
    ctx.reply(`Generate failed: ${e.message}`);
  }
});

bot.on('callback_query', async (ctx) => {
  const [, action, slug] = ctx.callbackQuery.data.split(':');
  const [owner, repo] = REPO.split('/');
  const mdPath = `src/content/posts/${slug}.md`;
  try {
    const { data: file } = await octokit.repos.getContent({ owner, repo, path: mdPath });
    if (action === 'approve') {
      const content = Buffer.from(file.content, 'base64').toString('utf8');
      const newContent = content.replace(/\ndraft:\s*true/, '\ndraft: false');
      await octokit.repos.createOrUpdateFileContents({
        owner, repo, path: mdPath, message: `Publish: ${slug}`,
        content: Buffer.from(newContent).toString('base64'), sha: file.sha
      });
      ctx.answerCbQuery('✅ Published!');
    } else {
      await octokit.repos.deleteFile({
        owner, repo, path: mdPath, message: `Reject: ${slug}`, sha: file.sha
      });
      ctx.answerCbQuery('❌ Deleted!');
    }
    await ctx.editMessageText(`${action === 'approve' ? '✅ Published' : '❌ Deleted'}: ${slug}`);
  } catch (e) {
    ctx.answerCbQuery(`Error: ${e.message}`, { show_alert: true });
  }
});

console.log('🤖 AI Blog Bot started - polling...');
bot.launch().catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

