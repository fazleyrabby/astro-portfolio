import 'dotenv/config';
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

const REPO = process.env.GITHUB_REPOSITORY || 'fazleyrabby/astro-portfolio';

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

bot.hears(/^\s*\/add(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || '').trim();
  if (!text) return ctx.reply('Usage: /add <topic>');
  const topics = await loadQueue();
  topics.push({ topic: text, category: 'backend', context: '', notes: '' });
  await saveQueue(topics);
  ctx.reply(`Topic added (#${topics.length} in queue): ${text}`);
});

bot.hears(/^\s*\/topic(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || '').trim();
  if (!text) return ctx.reply('Usage: /topic <topic>\nAdds a full topic. Use /category, /context, /note to set details on the last added topic.');
  const topics = await loadQueue();
  topics.push({ topic: text, category: 'backend', context: '', notes: '' });
  await saveQueue(topics);
  ctx.reply(`Topic added (#${topics.length} in queue): ${text}`);
});

bot.hears(/^\s*\/context(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || '').trim();
  const topics = await loadQueue();
  if (!topics.length) return ctx.reply('No topics in queue. Add one first with /topic');
  topics[topics.length - 1].context = text || '';
  await saveQueue(topics);
  ctx.reply(`Context set on last topic: ${text || 'cleared'}`);
});

bot.hears(/^\s*\/category(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || '').trim();
  const topics = await loadQueue();
  if (!topics.length) return ctx.reply('No topics in queue. Add one first with /topic');
  topics[topics.length - 1].category = text || 'general';
  await saveQueue(topics);
  ctx.reply(`Category set on last topic: ${text || 'general'}`);
});

bot.hears(/^\s*\/note(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || '').trim();
  const topics = await loadQueue();
  if (!topics.length) return ctx.reply('No topics in queue. Add one first with /topic');
  topics[topics.length - 1].notes = text || '';
  await saveQueue(topics);
  ctx.reply(`Note set on last topic: ${text || 'none'}`);
});

bot.hears(/^\s*\/status(?:\s+|$)/, async (ctx) => {
  const topics = await loadQueue();
  if (!topics.length) return ctx.reply('📝 Queue is empty. Add topics with /topic');
  const next = topics[topics.length - 1]; // Show the last added one by default for status
  let msg = `📝 Queue: ${topics.length} topic(s)\n\nLatest topic:\n• Topic: ${next.topic}\n• Category: ${next.category || 'general'}\n• Context: ${next.context || 'none'}\n• Notes: ${next.notes || 'none'}`;
  if (topics.length > 1) {
    msg += '\n\nFull Queue:';
    topics.forEach((t, i) => { msg += `\n${i + 1}. ${t.topic}`; });
  }
  ctx.reply(msg);
});

bot.hears(/^\s*\/reset(?:\s+|$)/, async (ctx) => {
  await saveQueue([]);
  ctx.reply('Queue cleared.');
});


bot.hears(/^\s*\/generate(?:\s+|$)/, async (ctx) => {
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
    // Pull, commit and push
    execSync(`git pull && git add "${path.relative(path.join(__dirname, '..'), path.join(postsDir, latest))}" && git commit -m "Draft: ${slug}" && git push`, {
      cwd: path.join(__dirname, '..'),
      env: process.env,
      stdio: 'pipe',
    });
    ctx.reply(`New draft: *${title.replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, '\\$1')}*\n\n${preview}`, {
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Approve Publish', callback_data: `a:${slug}` }],
          [{ text: '❌ Reject Delete', callback_data: `r:${slug}` }]
        ]
      }
    });
  } catch (e) {
    ctx.reply(`Generate failed: ${e.message}`);
  }
});


bot.on('callback_query', async (ctx) => {
  const [tag, slug] = ctx.callbackQuery.data.split(':');
  const action = (tag === 'a' || tag === 'approve') ? 'approve' : 'reject';
  const [owner, repo] = REPO.split('/');
  const mdPath = `src/content/posts/${slug}.md`;

  console.log(`Bot received click: ${action} for ${slug}`);
  
  // 1. Answer immediately to stop the Telegram spinner
  try {
    await ctx.answerCbQuery(action === 'approve' ? 'Publishing...' : 'Deleting...');
  } catch (e) {
    console.warn(`Could not answer callback: ${e.message}`);
  }

  try {
    // 2. Fetch fresh content
    const { data: file } = await octokit.repos.getContent({ owner, repo, path: mdPath });

    if (action === 'approve') {
      const content = Buffer.from(file.content, 'base64').toString('utf8');
      
      // If it's already published, don't do it again
      if (!content.includes('draft: true')) {
        console.log(`${slug} is already published.`);
        await ctx.editMessageText(`✅ Successfully Published: ${slug}`);
        return;
      }

      const newContent = content.replace(/\ndraft:\s*(true|false)/, '\ndraft: false');
      console.log(`Pushing publish commit for ${slug}...`);
      await octokit.repos.createOrUpdateFileContents({
        owner, repo, path: mdPath, message: `Publish: ${slug}`,
        content: Buffer.from(newContent).toString('base64'), sha: file.sha
      });
    } else {
      console.log(`Pushing delete commit for ${slug}...`);
      await octokit.repos.deleteFile({
        owner, repo, path: mdPath, message: `Reject: ${slug}`, sha: file.sha
      });
    }
    
    // 3. Final UI Update
    await ctx.editMessageText(`${action === 'approve' ? '✅ Published' : '❌ Deleted'}: ${slug}`);
    console.log(`Successfully ${action === 'approve' ? 'published' : 'deleted'} ${slug}`);
  } catch (e) {
    console.error(`Callback Error: ${e.message}`);
    // If it's a conflict (usually means it's already updated), just update the UI
    if (e.status === 409 || e.message.includes('expected')) {
       await ctx.editMessageText(`✅ Published (sync): ${slug}`);
    } else {
       await ctx.reply(`Error performing ${action}: ${e.message}`);
    }
  }
});

console.log('🤖 AI Blog Bot started - polling...');
bot.launch().catch(console.error);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

