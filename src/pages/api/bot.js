import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { Octokit } from '@octokit/rest';

// 1. Initialize our bot and octokit
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const REPO = process.env.GITHUB_REPOSITORY || 'fazleyrabby/astro-portfolio';

// 2. The Bot Callback Query Handler (Approval logic)
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

// 3. The Netlify/Astro API Handler
export const POST = async ({ request }) => {
  try {
    const body = await request.json();
    console.log('Incoming update:', body.update_id);
    
    // We let Telegraf process the update and send the response back
    await bot.handleUpdate(body);
    
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('Bot Handler Error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
