import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { Octokit } from '@octokit/rest';

// 1. Initialize our bot and octokit
const bot = new Telegraf(import.meta.env.TELEGRAM_TOKEN || process.env.TELEGRAM_TOKEN);
const octokit = new Octokit({ auth: import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN });
const REPO = import.meta.env.GITHUB_REPOSITORY || process.env.GITHUB_REPOSITORY || 'fazleyrabby/astro-portfolio';
const ALLOWED_USER_ID = parseInt(import.meta.env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID);
const CONTEXT_PATH = 'data/blog-context.json';

// --- MIDDLEWARE: Security Check ---
bot.use(async (ctx, next) => {
  const fromId = ctx.from?.id;
  if (fromId !== ALLOWED_USER_ID) {
    console.warn(`Unauthorized access attempt from user: ${fromId}`);
    if (ctx.updateType === 'callback_query') {
      return ctx.answerCbQuery('⛔ Error: Unauthorized user.');
    }
    return; // Ignore other unauthorized messages
  }
  return next();
});

// --- Context Helpers (via GitHub API for Serverless) ---
async function loadContext() {
  const [owner, repo] = REPO.split('/');
  try {
    const { data: file } = await octokit.repos.getContent({ owner, repo, path: CONTEXT_PATH, ref: 'main' });
    return JSON.parse(Buffer.from(file.content, 'base64').toString('utf8'));
  } catch (e) {
    console.error('Error loading context:', e.message);
    return { topics: [] };
  }
}

async function saveContext(ctx) {
  const [owner, repo] = REPO.split('/');
  try {
    let sha;
    try {
      const { data: file } = await octokit.repos.getContent({ owner, repo, path: CONTEXT_PATH, ref: 'main' });
      sha = file.sha;
    } catch {}

    await octokit.repos.createOrUpdateFileContents({
      owner, repo, path: CONTEXT_PATH,
      message: 'Update blog context',
      content: Buffer.from(JSON.stringify(ctx, null, 2)).toString('base64'),
      branch: 'main',
      ...(sha ? { sha } : {})
    });
  } catch (e) {
    console.error('Error saving context:', e.message);
  }
}

// 2. The Bot Command Handlers
bot.hears(/^\s*\/topic(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || '').trim();
  if (!text) return ctx.reply('Usage: /topic <topic_text>');
  
  const data = await loadContext();
  if (!data.topics) data.topics = [];
  data.topics.push({ topic: text, category: 'backend', context: '', notes: '' });
  await saveContext(data);
  ctx.reply(`✅ Topic added (#${data.topics.length}): ${text}`);
});

bot.hears(/^\s*\/status(?:\s+|$)/, async (ctx) => {
  const data = await loadContext();
  const topics = data.topics || [];
  if (!topics.length) return ctx.reply('📝 Queue is empty. Add topics with /topic');
  
  const next = topics[topics.length - 1];
  let msg = `📝 Queue: ${topics.length} topic(s)\n\nLast added:\n• Topic: ${next.topic}\n• Category: ${next.category || 'general'}\n• Context: ${next.context || 'none'}\n• Notes: ${next.notes || 'none'}`;
  ctx.reply(msg);
});

bot.hears(/^\s*\/category(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || '').trim();
  const data = await loadContext();
  if (!data.topics?.length) return ctx.reply('No topics in queue. Add one first with /topic');
  data.topics[data.topics.length - 1].category = text || 'general';
  await saveContext(data);
  ctx.reply(`Category set: ${text || 'general'}`);
});

bot.hears(/^\s*\/context(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || '').trim();
  const data = await loadContext();
  if (!data.topics?.length) return ctx.reply('No topics in queue. Add one first with /topic');
  data.topics[data.topics.length - 1].context = text || '';
  await saveContext(data);
  ctx.reply(`Context set: ${text || 'cleared'}`);
});

bot.hears(/^\s*\/note(?:\s+|$)(.*)/s, async (ctx) => {
  const text = (ctx.match[1] || '').trim();
  const data = await loadContext();
  if (!data.topics?.length) return ctx.reply('No topics in queue. Add one first with /topic');
  data.topics[data.topics.length - 1].notes = text || '';
  await saveContext(data);
  ctx.reply(`Note set: ${text || 'none'}`);
});


bot.hears(/^\s*\/reset(?:\s+|$)/, async (ctx) => {
  await saveContext({ topics: [] });
  ctx.reply('🗑 Queue cleared.');
});

bot.hears(/^\s*\/generate(?:\s+|$)/, async (ctx) => {
  ctx.reply('⏳ This command usually runs via the scripts/generate-post.js script.\nFor serverless generation, please use /topic first to set details.');
});


// 3. The Bot Callback Query Handler (Approval logic)
bot.on('callback_query', async (ctx) => {
  const [tag, slug] = ctx.callbackQuery.data.split(':');
  const action = (tag === 'a' || tag === 'approve') ? 'approve' : 'reject';
  const [owner, repo] = REPO.split('/');
  const mdPath = `src/content/posts/${slug}.md`;

  console.log(`Webhook received click: ${action} for ${slug}`);
  
  // Try to answer immediately (acknowledges the click)
  try { await ctx.answerCbQuery(action === 'approve' ? 'Publishing...' : 'Deleting...'); } catch (e) {}

  try {
    const { data: file } = await octokit.repos.getContent({ owner, repo, path: mdPath });

    if (action === 'approve') {
       const content = Buffer.from(file.content, 'base64').toString('utf8');
       
       // Handle already published or sync cases
       if (!content.includes('draft: true')) {
         await ctx.editMessageText(`✅ Successfully Published: ${slug}`);
         return;
       }

       const newContent = content.replace(/\ndraft:\s*(true|false)/, '\ndraft: false');
       await octokit.repos.createOrUpdateFileContents({
         owner, repo, path: mdPath, message: `Publish: ${slug}`,
         content: Buffer.from(newContent).toString('base64'), sha: file.sha
       });
    } else {
       await octokit.repos.deleteFile({
         owner, repo, path: mdPath, message: `Reject: ${slug}`, sha: file.sha
       });
    }
    
    await ctx.editMessageText(`${action === 'approve' ? '✅ Published' : '❌ Deleted'}: ${slug}`);
    console.log(`Successfully ${action === 'approve' ? 'published' : 'deleted'} ${slug}`);

  } catch (e) {
    console.error(`Callback Error: ${e.message}`);
    if (e.status === 409 || e.message.includes('expected')) {
       await ctx.editMessageText(`✅ Published (sync): ${slug}`);
    } else {
       await ctx.reply(`Error performing ${action}: ${e.message}`);
    }
  }
});


// 4. The Netlify/Astro API Handler
export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    console.log('Incoming update:', body.update_id);
    await bot.handleUpdate(body);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('Bot Handler Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

