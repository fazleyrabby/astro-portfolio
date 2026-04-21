// Environment variables are injected by the host or process
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
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
});

// --- CMS & Paths ---
const [REPO_OWNER, REPO_NAME] = REPO.split('/');
const POSTS_PATH = 'apps/web/src/content/posts';

// --- In-memory AI Draft Store ---
const aiDrafts = new Map();

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
    `/me — Show your Telegram ID\n` +
    `/help — Show this message`
));

bot.command('generate', async (ctx) => {
    const topic = ctx.message.text.replace('/generate', '').trim();
    if (!topic) return ctx.reply('Please provide a topic: /generate Scaling Laravel with Redis');

    const msg = await ctx.reply('🧠 Generating technical post... please wait.');
    log(`[BOT] Executing /generate for: ${topic}`);
    
    try {
        const post = await generateAIContent(topic);
        const slug = toSlug(post.title);
        
        aiDrafts.set(slug, post);
        const preview = post.content.slice(0, 500) + '...';
        
        await ctx.telegram.deleteMessage(ctx.chat.id, msg.message_id).catch(() => {});
        await ctx.reply(`📝 <b>DRAFT GENERATED</b>\n\n<b>Title:</b> ${post.title}\n<b>Tags:</b> ${post.tags.join(', ')}\n\n${preview}`, {
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
        const post = aiDrafts.get(slug);

        if (!post) return ctx.answerCbQuery('Draft expired or not found.');

        await ctx.editMessageText(`🚀 <b>Publishing:</b> ${post.title}...`, { parse_mode: 'HTML' });

        try {
            const filePath = `${POSTS_PATH}/${slug}.md`;
            const md = buildMarkdown(post.title, post.content, false, post.tags);

            await ghCreateOrUpdate(filePath, md, null, `ai: publish ${post.title}`);
            await supabase.from('posts').upsert({
                title: post.title,
                slug,
                content: post.content,
                tags: post.tags,
                status: 'published',
                published_at: new Date()
            });

            await ctx.editMessageText(`✅ <b>PUBLISHED!</b>\n\n<b>Title:</b> ${post.title}\n<b>Status:</b> Live on Database & GitHub.`, { parse_mode: 'HTML' });
            aiDrafts.delete(slug);
        } catch (err) {
            log(`[BOT] Bot publish error: ${err.message}`);
            await ctx.reply(`❌ Publish failed: ${err.message}`);
        }
    } else if (data.startsWith('p_rej:')) {
        const slug = data.replace('p_rej:', '');
        aiDrafts.delete(slug);
        await ctx.editMessageText('❌ Post draft rejected and discarded.');
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
        const { data, error } = await supabase.from('posts').select('slug, title, status, updated_at');
        if (error) throw error;
        const posts = data.map(p => {
            let title = p.title;
            if (!title || title.trim() === '' || title.toLowerCase() === 'untitled' || title === 'undefined') {
                title = p.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            }
            return {
                slug: p.slug,
                title: title,
                draft: p.status === 'draft',
                updated_at: p.updated_at
            };
        });
        posts.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
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

app.post('/cms/posts', cmsAuth, async (req, res) => {
    const { title, content, draft = false, tags = [], published_at } = req.body || {};
    const slug = toSlug(title);
    const status = draft ? 'draft' : 'published';
    const pubDate = published_at ? new Date(published_at) : (status === 'published' ? new Date() : null);
    try {
        await ghCreateOrUpdate(`${POSTS_PATH}/${slug}.md`, buildMarkdown(title, content, draft, tags), null, `cms: create ${slug}`);
        await supabase.from('posts').upsert({ title, slug, content, tags, status, published_at: pubDate });
        res.status(201).json({ ok: true, slug });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/cms/posts/:slug', cmsAuth, async (req, res) => {
    const { title, content, draft, tags, published_at } = req.body || {};
    const slug = req.params.slug;
    const status = draft ? 'draft' : 'published';
    const pubDate = published_at ? new Date(published_at) : (status === 'published' ? new Date() : null);
    try {
        const file = await ghGetFile(`${POSTS_PATH}/${slug}.md`);
        await ghCreateOrUpdate(`${POSTS_PATH}/${slug}.md`, buildMarkdown(title || slug, content, draft, tags), file.sha, `cms: update ${slug}`);
        await supabase.from('posts').upsert({ title, slug, content, tags, status, published_at: pubDate });
        res.json({ ok: true, slug });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/cms/posts/:slug', cmsAuth, async (req, res) => {
    const slug = req.params.slug;
    try {
        const file = await ghGetFile(`${POSTS_PATH}/${slug}.md`);
        await octokit.repos.deleteFile({ owner: REPO_OWNER, repo: REPO_NAME, path: `${POSTS_PATH}/${slug}.md`, sha: file.sha, message: `cms: delete ${slug}` });
        await supabase.from('posts').delete().eq('slug', slug);
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const upload = multer({ storage: multer.memoryStorage() });
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

app.get('/webhook', (req, res) => {
    log(`GET hit on webhook check`);
    res.send('Webhook endpoint is active.');
});

app.post('/webhook', (req, res) => {
    log(`Webhook hit: POST /webhook`);
    res.sendStatus(200);
    bot.handleUpdate(req.body).catch(err => log(`Bot Error: ${err.message}`));
});

app.get('/', (req, res) => {
    res.send('OK - Backend API Active');
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
