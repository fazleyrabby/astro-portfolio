import "dotenv/config";
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import multer from 'multer';
import { Telegraf } from 'telegraf';
import { Octokit } from '@octokit/rest';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import OpenAI from 'openai';
import { slug as slugify } from 'github-slugger';
import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'debug.log');
const draftsFile = path.join(process.cwd(), 'drafts.json');

function log(msg) {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] ${msg}\n`;
    try {
        fs.appendFileSync(logFile, formatted);
    } catch (e) {
        console.error('Log write failed:', e.message);
    }
    console.log(msg);
}

const app = express();
app.use((req, res, next) => {
    if (req.query.tg_webhook === '1') {
        log(`Webhook hit: ${req.method} ${req.url}`);
    }
    next();
});
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3001;

// --- Config & Clients ---
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const CMS_TOKEN = process.env.CMS_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY || 'fazleyrabby/astro-portfolio';
const ALLOWED_USER_ID = parseInt(String(process.env.TELEGRAM_CHAT_ID).trim() || '0', 10);

const bot = new Telegraf(TELEGRAM_TOKEN);

bot.start((ctx) => ctx.reply(`Welcome! Your ID is ${ctx.from?.id}. Allowed: ${ALLOWED_USER_ID}`));

if (!TELEGRAM_TOKEN) {
    console.error('CRITICAL: TELEGRAM_TOKEN is missing in environment variables!');
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || SUPABASE_KEY);

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

// --- CMS & Paths ---
const [REPO_OWNER, REPO_NAME] = REPO.split('/');
const POSTS_PATH = 'apps/web/src/content/posts';

// --- In-memory AI Draft Store ---
const aiDrafts = new Map();

// --- Draft File Helpers ---
function loadDrafts() {
    try {
        const data = fs.readFileSync(draftsFile, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function saveDrafts(drafts) {
    fs.writeFileSync(draftsFile, JSON.stringify(drafts, null, 2));
}

function addDraft(slug, post) {
    const drafts = loadDrafts();
    drafts.push({ slug, post, timestamp: Date.now() });
    saveDrafts(drafts);
}

function getDraft(slug) {
    const drafts = loadDrafts();
    return drafts.find(d => d.slug === slug);
}

function removeDraft(slug) {
    const drafts = loadDrafts();
    saveDrafts(drafts.filter(d => d.slug !== slug));
}

function listDrafts() {
    return loadDrafts();
}

// --- Helper Functions ---
function toSlug(title) {
    return slugify(title);
}

function buildMarkdown(title, content, draft = false, tags = []) {
    const date = new Date().toISOString().split('T')[0];
    const fm = {
        title,
        date,
        draft,
        tags: tags.length ? tags : []
    };
    return `---\n${Object.entries(fm).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n')}\n---\n\n${content}`;
}

async function ghCreateOrUpdate(filePath, content, sha, message, isBase64 = false) {
    await octokit.repos.createOrUpdateFileContents({
        owner: REPO_OWNER, repo: REPO_NAME,
        path: filePath,
        message: message || `cms: update ${filePath}`,
        content: isBase64 ? content : Buffer.from(content).toString('base64'),
        ...(sha ? { sha } : {}),
    });
}

async function ghGetFile(filePath) {
    const { data } = await octokit.repos.getContent({
        owner: REPO_OWNER, repo: REPO_NAME, path: filePath,
    });
    return data;
}

// --- AI Logic ---
async function generateAIContent(topic) {
    log(`[AI] Starting generation for: ${topic}`);
    if (!process.env.GROQ_API_KEY) {
        log(`[AI] Error: GROQ_API_KEY is missing`);
        throw new Error('GROQ_API_KEY is missing on the server');
    }

    const prompt = `You are a senior backend engineer. Write a technical, portfolio-grade blog post.
TOPIC: ${topic}
REQUIREMENTS: Professional tone, senior-level insights, include code snippets.
OUTPUT: Raw Markdown with YAML title and tags. DO NOT wrap the YAML in markdown code blocks.`;

    try {
        const completion = await openai.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
        });

        log(`[AI] Response received from Groq`);
        let response = completion.choices[0].message.content.trim();
        response = response.replace(/^```(?:markdown|md)?\s*\n?/i, '').replace(/\n?```\s*$/, '');

        let title = topic;
        let tags = [];
        let markdownContent = response;

        const fmBlockMatch = response.match(/^---\n([\s\S]*?)\n---/);
        if (fmBlockMatch) {
            const fmBody = fmBlockMatch[1];
            const titleMatch = fmBody.match(/title:\s*"?([^"\n]+)"?/);
            const tagsMatch = fmBody.match(/tags:\s*(\[.*?\])/);
            if (titleMatch) title = titleMatch[1].trim();
            if (tagsMatch) { try { tags = JSON.parse(tagsMatch[1]); } catch {} }
            markdownContent = response.substring(fmBlockMatch[0].length).trim();
        }

        return { title, tags, content: markdownContent };
    } catch (err) {
        log(`[AI] Error during generation: ${err.message}`);
        throw err;
    }
}

// --- Telegram Bot Logic ---
bot.use(async (ctx, next) => {
    const userId = ctx.from?.id;
    log(`[BOT] Incoming message from: ${userId}`);
    
    if (userId !== ALLOWED_USER_ID) {
        log(`[BOT] Unauthorized attempt by: ${userId}. Expected: ${ALLOWED_USER_ID}`);
        if (ctx.message?.text?.startsWith('/')) {
            return ctx.reply(`⛔ Unauthorized. Your ID: ${userId}\nExpected ID: ${ALLOWED_USER_ID}`).catch(() => {});
        }
        return;
    }
    return next();
});

bot.command('me', (ctx) => {
    ctx.reply(`Your Telegram ID is: ${ctx.from?.id}\nAllowed ID: ${ALLOWED_USER_ID}`);
});

bot.command('status', (ctx) => ctx.reply('🚀 API & CMS Engine is active.'));

bot.command('help', (ctx) => ctx.reply(
    `📋 Available Commands:\n\n` +
    `/status — Check if API is alive\n` +
    `/generate <topic> — AI generate a blog post draft\n` +
    `/drafts — List all pending drafts\n` +
    `/me — Show your Telegram ID\n` +
    `/help — Show this message`
));

bot.command('drafts', async (ctx) => {
    const drafts = listDrafts();
    
    if (drafts.length === 0) {
        return ctx.reply('📭 <b>No Pending Drafts</b>\n\nYou have no drafts waiting for review.');
    }

    let msg = `📋 <b>Pending Drafts (${drafts.length})</b>\n\n`;
    const keyboard = [];

    drafts.forEach((d, i) => {
        const age = Math.round((Date.now() - d.timestamp) / 60000);
        msg += `${i + 1}. <b>${d.post.title}</b>\n`;
        msg += `   Slug: <code>${d.slug}</code>\n`;
        msg += `   Tags: ${d.post.tags?.join(', ') || 'none'}\n`;
        msg += `   Age: ${age}m ago\n\n`;
        keyboard.push([{ text: `✅ ${i + 1}`, callback_data: `p_app:${d.slug}` }]);
    });

    keyboard.push([{ text: '❌ Reject All', callback_data: 'p_rej_all:confirm' }]);

    await ctx.reply(msg, {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: keyboard }
    });
});

bot.command('generate', async (ctx) => {
    const topic = ctx.message.text.replace('/generate', '').trim();
    if (!topic) return ctx.reply('Please provide a topic: /generate Scaling Laravel with Redis');

    const msg = await ctx.reply('🧠 Generating technical post... please wait.');
    log(`[BOT] Executing /generate for: ${topic}`);

    try {
        const post = await generateAIContent(topic);
        const slug = toSlug(post.title);

        // Duplicate check
        const { data: existing } = await supabase.from('posts').select('slug, status').eq('slug', slug).single();
        if (existing) {
            await ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id).catch(() => {});
            return ctx.reply(
                `⚠️ <b>Duplicate detected!</b>\n\nA post with slug <code>${slug}</code> already exists (${existing.status}).\n\nGenerate with a different title or delete the existing post first.`,
                { parse_mode: 'HTML' }
            );
        }

        aiDrafts.set(slug, post);
        const preview = post.content.slice(0, 500) + '...';

        await ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id).catch(() => {});
        await ctx.reply(`📝 <b>DRAFT GENERATED</b>\n\n<b>Title:</b> ${post.title}\n<b>Slug:</b> <code>${slug}</code>\n<b>Tags:</b> ${post.tags.join(', ')}\n\n${preview}`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '✅ Approve & Publish', callback_data: `p_app:${slug}` }],
                    [{ text: '❌ Reject', callback_data: `p_rej:${slug}` }]
                ]
            }
        });
        log(`[BOT] Draft preview sent for: ${slug}`);
    } catch (err) {
        log(`[BOT] Generate command failed: ${err.message}`);
        ctx.reply(`❌ AI Error: ${err.message}`).catch(() => {});
    }
});

bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;
    
    if (data.startsWith('p_app:')) {
        const slug = data.replace('p_app:', '');
        const post = aiDrafts.get(slug) || getDraft(slug)?.post;

        if (!post) return ctx.answerCbQuery('Draft expired or not found.');

        await ctx.editMessageText(`🚀 <b>Publishing:</b> ${post.title}...`, { parse_mode: 'HTML' });

        try {
            await supabase.from('posts').upsert({
                title: post.title,
                slug,
                content: post.content,
                tags: post.tags,
                status: 'published',
                published_at: new Date()
            });
            triggerDeploy();

            await ctx.editMessageText(`✅ <b>PUBLISHED!</b>\n\n<b>Title:</b> ${post.title}\n<b>Status:</b> Live on Supabase. Site rebuilding...`, { parse_mode: 'HTML' });
            aiDrafts.delete(slug);
            removeDraft(slug);
        } catch (err) {
            log(`[BOT] Bot publish error: ${err.message}`);
            await ctx.reply(`❌ Publish failed: ${err.message}`);
        }
    } else if (data.startsWith('p_rej:')) {
        const slug = data.replace('p_rej:', '');
        aiDrafts.delete(slug);
        removeDraft(slug);
        await ctx.editMessageText('❌ Post draft rejected and discarded.');
    } else if (data === 'p_rej_all:confirm') {
        const drafts = listDrafts();
        drafts.forEach(d => {
            aiDrafts.delete(d.slug);
            removeDraft(d.slug);
        });
        await ctx.editMessageText('❌ All drafts rejected and discarded.');
    }
    await ctx.answerCbQuery();
});

// --- REST API Logic ---
function cmsAuth(req, res, next) {
    const auth = req.headers['authorization'] || '';
    const token = auth.replace('Bearer ', '').trim();

    if (!CMS_TOKEN) {
        log('[AUTH] CRITICAL: CMS_TOKEN is not defined in server environment!');
        return res.status(500).json({ error: 'server_config_error' });
    }

    if (auth !== `Bearer ${CMS_TOKEN}`) {
        log(`[AUTH] Denied. Received: ${token.slice(0, 5)}... Expected: ${CMS_TOKEN.slice(0, 5)}...`);
        return res.status(401).json({ error: 'unauthorized' });
    }
    next();
}

app.get('/cms/posts', cmsAuth, async (req, res) => {
    try {
        const { data, error } = await supabase.from('posts').select('slug, title, status, published_at, updated_at');
        if (error) throw error;
        const posts = data.map(p => {
            let title = p.title;
            if (!title || title.trim() === '' || title.toLowerCase() === 'untitled' || title === 'undefined') {
                title = p.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }
            return {
                slug: p.slug,
                title,
                status: p.status,
                draft: p.status === 'draft',
                published_at: p.published_at,
                updated_at: p.updated_at
            };
        });
        posts.sort((a, b) => new Date(b.published_at || b.updated_at) - new Date(a.published_at || a.updated_at));
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/cms/posts/:slug', cmsAuth, async (req, res) => {
    try {
        const { data, error } = await supabase.from('posts').select('*').eq('slug', req.params.slug).single();
        if (!error && data) return res.json(data);
        const file = await ghGetFile(`${POSTS_PATH}/${req.params.slug}.md`);
        res.json({ slug: req.params.slug, content: Buffer.from(file.content, 'base64').toString('utf8') });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const VERCEL_DEPLOY_HOOK = process.env.VERCEL_DEPLOY_HOOK || 'https://api.vercel.com/v1/integrations/deploy/prj_lY5Ii1JI2IUVUIVR9anpPUtuQI8d/6qdbCkqaTh';

async function triggerDeploy() {
    try {
        await fetch(VERCEL_DEPLOY_HOOK, { method: 'POST' });
        log('[DEPLOY] Vercel rebuild triggered');
    } catch (e) {
        log(`[DEPLOY] Hook failed: ${e.message}`);
    }
}

app.post('/cms/posts', cmsAuth, async (req, res) => {
    const { title, content, draft = false, tags = [], published_at } = req.body || {};
    const slug = toSlug(title);
    const status = draft ? 'draft' : 'published';
    const pubDate = published_at ? new Date(published_at) : (status === 'published' ? new Date() : null);
    try {
        await supabase.from('posts').upsert({ title, slug, content, tags, status, published_at: pubDate });
        if (status === 'published') triggerDeploy();
        res.status(201).json({ ok: true, slug });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/cms/posts/:slug', cmsAuth, async (req, res) => {
    const { title, content, draft, tags, published_at, featured = false } = req.body || {};
    const slug = req.params.slug;
    const status = draft ? 'draft' : 'published';
    const pubDate = published_at ? new Date(published_at) : (status === 'published' ? new Date() : null);
    log(`[CMS] PUT ${slug} — draft:${draft} featured:${featured} status:${status}`);
    try {
        const updates = { title, slug, status, featured, published_at: pubDate };
        if (content !== undefined) updates.content = content;
        if (tags !== undefined) updates.tags = tags;
        const { error } = await supabase.from('posts').update(updates).eq('slug', slug);
        if (error) throw new Error(error.message);
        if (status === 'published') triggerDeploy();
        res.json({ ok: true, slug });
    } catch (err) {
        log(`[CMS] PUT error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/cms/posts/:slug', cmsAuth, async (req, res) => {
    const slug = req.params.slug;
    try {
        await supabase.from('posts').delete().eq('slug', slug);
        triggerDeploy();
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });
app.post('/cms/upload', cmsAuth, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'no file' });
    const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;

    try {
        log(`Attempting image upload: ${filename} (${req.file.mimetype})`);
        const { data, error } = await supabase.storage
            .from('blog-images')
            .upload(filename, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (error) {
            log(`Supabase storage error: ${error.message}`);
            throw error;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('blog-images')
            .getPublicUrl(filename);

        log(`Image upload successful. URL: ${publicUrl}`);
        res.json({ url: publicUrl });
    } catch (err) {
        log(`Supabase upload error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

app.get('/cms/media', cmsAuth, async (req, res) => {
    try {
        const { data, error } = await supabase.storage.from('blog-images').list('', { sortBy: { column: 'created_at', order: 'desc' } });
        if (error) throw error;
        const files = data.map(f => ({
            name: f.name,
            size: f.metadata?.size,
            created_at: f.created_at,
            url: supabase.storage.from('blog-images').getPublicUrl(f.name).data.publicUrl
        }));
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/cms/media/:filename', cmsAuth, async (req, res) => {
    try {
        const { error } = await supabase.storage.from('blog-images').remove([req.params.filename]);
        if (error) throw error;
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/webhook', (req, res) => {
    log(`GET hit on webhook check`);
    res.send('Webhook endpoint is active.');
});

app.post('/webhook', (req, res) => {
    log(`Webhook hit: POST /webhook`);
    res.sendStatus(200);
    bot.handleUpdate(req.body).catch(err => log(`Bot Error: ${err.message}`));
});

// --- Contact Form ---
app.post('/contact', async (req, res) => {
    const { email, message, website } = req.body || {};

    // Honeypot check
    if (website) return res.status(200).json({ ok: true });

    if (!email || !message) {
        return res.status(400).json({ error: 'Email and message required' });
    }

    try {
        // Save to Supabase
        const { error } = await supabase.from('contacts').insert({
            email: email.trim(),
            message: message.trim(),
            created_at: new Date().toISOString(),
        });
        if (error) log(`[Contact] Supabase insert error: ${error.message}`);

        // Telegram notification
        if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
            const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            const text = `📬 <b>New Contact Message</b>\n\n<b>From:</b> ${esc(email)}\n\n<b>Message:</b>\n${esc(message.trim())}`;
            await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
            });
        }

        res.status(201).json({ ok: true });
    } catch (e) {
        log(`[Contact] Error: ${e.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/', (req, res) => {
    res.send('OK - Backend API Active');
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
