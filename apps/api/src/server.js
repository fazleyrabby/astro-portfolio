import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import multer from 'multer';
import { Telegraf } from 'telegraf';
import { Octokit } from '@octokit/rest';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const app = express();
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
const ALLOWED_USER_ID = parseInt(TELEGRAM_CHAT_ID || '0', 10);

const bot = new Telegraf(TELEGRAM_TOKEN);
const octokit = new Octokit({ auth: GITHUB_TOKEN });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Visit Tracking Cooldown (in-memory, resets on restart — acceptable) ---
const lastNotified = new Map();
const NOTIFY_COOLDOWN = 30 * 60 * 1000;

// --- Telegram Bot Middleware ---
bot.use(async (ctx, next) => {
    if (ctx.from?.id !== ALLOWED_USER_ID) return;
    return next();
});

bot.command('status', (ctx) => ctx.reply('API server running.'));

// --- Helper Functions ---
function isBot(userAgent = '') {
    const ua = userAgent.toLowerCase();
    const botPatterns = ['googlebot', 'bingbot', 'yandexbot', 'bot', 'crawler', 'spider', 'vercel', 'netlify'];
    return botPatterns.some(pattern => ua.includes(pattern));
}

function hashIP(ip) {
    return crypto.createHash('sha256').update(ip + (TELEGRAM_TOKEN || '')).digest('hex').slice(0, 16);
}

async function sendTelegramNotification(message) {
    try {
        await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'HTML' });
    } catch (err) {
        console.error('Telegram notification failed:', err.message);
    }
}

// --- Routes ---

// Root
app.get('/', (req, res) => {
    res.send('OK - server running');
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ ok: true, ts: Date.now() });
});

// Version
app.get('/version', (req, res) => {
    res.json({ version: process.env.GIT_SHA || 'unknown', time: new Date().toISOString() });
});

// 1. Contact Form
app.post('/contact', async (req, res) => {
    const { email, message, website } = req.body || {};

    // Honeypot
    if (website) {
        return res.status(200).json({ ok: true });
    }

    if (!email || !message) {
        return res.status(400).json({ error: 'email and message required' });
    }

    const tgMessage = `📩 <b>New Contact Form Submission</b>\n\n<b>Email:</b> ${email}\n<b>Message:</b>\n${message}`;
    await sendTelegramNotification(tgMessage);

    res.status(201).json({ ok: true });
});

// 2. Visitor Tracking
app.post('/track', async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const { platform, language, path } = req.body || {};

    if (isBot(userAgent) || ip === process.env.MY_IP) {
        return res.json({ ok: true });
    }

    const ipHash = hashIP(ip);

    // Geo Lookup
    let geo = {};
    try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        if (geoRes.ok) geo = await geoRes.json();
    } catch {}

    // Store in Supabase
    try {
        await supabase.rpc('record_visit', {
            p_ip_hash: ipHash,
            p_country: geo.country_name ?? 'Unknown',
            p_region: geo.region ?? 'Unknown',
            p_city: geo.city ?? 'Unknown',
            p_isp: geo.org ?? 'Unknown',
            p_platform: platform ?? 'Unknown',
            p_language: language ?? 'Unknown',
            p_user_agent: userAgent,
            p_path: path ?? '/',
        });
    } catch (err) {
        console.error('Supabase record_visit error:', err.message);
    }

    // Notify with cooldown
    const now = Date.now();
    const lastTime = lastNotified.get(ipHash) || 0;
    if (now - lastTime > NOTIFY_COOLDOWN) {
        lastNotified.set(ipHash, now);
        const notifyMsg = `🚨 <b>NEW VISITOR</b>\n📍 ${geo.city || 'Unknown'}, ${geo.country_name || 'Unknown'}\n🌐 ${geo.org || 'Unknown'}\n💻 ${platform || 'Unknown'}\n🔗 ${path || '/'}`;
        sendTelegramNotification(notifyMsg);
    }

    res.json({ ok: true });
});

// 3. Image Proxy
app.get('/image-proxy', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL is required');

    try {
        const response = await fetch(url);
        if (!response.ok) return res.status(502).send('Upstream fetch failed');

        const contentType = response.headers.get('content-type') || 'application/octet-stream';
        const buffer = Buffer.from(await response.arrayBuffer());

        res.set('Content-Type', contentType);
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Cache-Control', 'public, max-age=86400');
        res.send(buffer);
    } catch (err) {
        console.error('Image Proxy Error:', err.message);
        res.status(500).send('Error proxying image');
    }
});

// --- CMS ---

const [REPO_OWNER, REPO_NAME] = REPO.split('/');
const POSTS_PATH = 'apps/web/src/content/posts';

function cmsAuth(req, res, next) {
    const auth = req.headers['authorization'] || '';
    if (!CMS_TOKEN || auth !== `Bearer ${CMS_TOKEN}`) {
        return res.status(401).json({ error: 'unauthorized' });
    }
    next();
}

function toSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

async function ghGetFile(filePath) {
    const { data } = await octokit.repos.getContent({
        owner: REPO_OWNER, repo: REPO_NAME, path: filePath,
    });
    return data;
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

async function ghDelete(filePath, sha, message) {
    await octokit.repos.deleteFile({
        owner: REPO_OWNER, repo: REPO_NAME,
        path: filePath, sha,
        message: message || `cms: delete ${filePath}`,
    });
}

function buildMarkdown(title, content, draft = false) {
    const date = new Date().toISOString().split('T')[0];
    // Use JSON.stringify for title to handle special characters and ensure double quotes
    return `---\ntitle: ${JSON.stringify(title)}\ndate: "${date}"\ndraft: ${draft}\n---\n\n${content}`;
}

// LIST
app.get('/cms/posts', cmsAuth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('slug, title, status, updated_at');

        if (error) throw error;

        const posts = data.map(p => {
            let title = p.title;
            if (!title || title.trim() === '' || title.toLowerCase() === 'untitled') {
                title = p.slug;
            }
            return {
                slug: p.slug,
                title: title,
                draft: p.status === 'draft',
                updated_at: p.updated_at
            };
        });

        // Sort by update time descending
        posts.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        res.json(posts);
    } catch (err) {
        console.error('CMS list error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// GET SINGLE
app.get('/cms/posts/:slug', cmsAuth, async (req, res) => {
    try {
        // 1. Try Supabase first
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', req.params.slug)
            .single();

        if (!error && data) {
            return res.json(data);
        }

        // 2. Fallback to GitHub
        const file = await ghGetFile(`${POSTS_PATH}/${req.params.slug}.md`);
        const content = Buffer.from(file.content, 'base64').toString('utf8');
        res.json({ slug: req.params.slug, sha: file.sha, content });
    } catch (err) {
        if (err.status === 404) return res.status(404).json({ error: 'not found' });
        console.error('CMS get error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// CREATE
app.post('/cms/posts', cmsAuth, async (req, res) => {
    const { title, content, draft = false } = req.body || {};
    if (!title || !content) return res.status(400).json({ error: 'title and content required' });

    const slug = toSlug(title);
    const status = draft ? 'draft' : 'published';
    const filePath = `${POSTS_PATH}/${slug}.md`;

    try {
        // 1. Sync to GitHub (Astro source)
        await ghCreateOrUpdate(filePath, buildMarkdown(title, content, draft), null, `cms: create ${slug}`);
        
        // 2. Sync to Supabase (CMS metadata/list)
        await supabase.from('posts').upsert({
            title,
            slug,
            content,
            status,
            published_at: status === 'published' ? new Date() : null
        });

        res.status(201).json({ ok: true, slug });
    } catch (err) {
        console.error('CMS create error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE
app.put('/cms/posts/:slug', cmsAuth, async (req, res) => {
    const { title, content, draft } = req.body || {};
    if (!content) return res.status(400).json({ error: 'content required' });

    const slug = req.params.slug;
    const filePath = `${POSTS_PATH}/${slug}.md`;

    try {
        const file = await ghGetFile(filePath);
        const existing = Buffer.from(file.content, 'base64').toString('utf8');

        const finalTitle = title || (existing.match(/^title:\s*"?([^"\n]+)"?/m)?.[1] ?? slug);
        const finalDraft = draft !== undefined ? draft : (existing.match(/^draft:\s*(\S+)/m)?.[1] === 'true');
        const status = finalDraft ? 'draft' : 'published';

        // 1. Sync to GitHub
        await ghCreateOrUpdate(filePath, buildMarkdown(finalTitle, content, finalDraft), file.sha, `cms: update ${slug}`);
        
        // 2. Sync to Supabase
        await supabase.from('posts').upsert({
            title: finalTitle,
            slug,
            content,
            status,
            published_at: status === 'published' ? new Date() : null
        });

        res.json({ ok: true, slug });
    } catch (err) {
        console.error('CMS update error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// DELETE
app.delete('/cms/posts/:slug', cmsAuth, async (req, res) => {
    const slug = req.params.slug;
    const filePath = `${POSTS_PATH}/${slug}.md`;
    try {
        const file = await ghGetFile(filePath);
        // 1. Delete from GitHub
        await ghDelete(filePath, file.sha, `cms: delete ${slug}`);
        
        // 2. Delete from Supabase
        await supabase.from('posts').delete().eq('slug', slug);

        res.json({ ok: true });
    } catch (err) {
        console.error('CMS delete error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// IMAGE UPLOAD
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

app.post('/cms/upload', cmsAuth, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'no file uploaded' });

    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    const filePath = `apps/web/public/images/uploads/${filename}`;

    try {
        // req.file.buffer is the raw binary, we convert to base64 string and set isBase64=true
        const base64Content = req.file.buffer.toString('base64');
        await ghCreateOrUpdate(filePath, base64Content, null, `cms: upload image ${filename}`, true);
        res.json({ url: `/images/uploads/${filename}` });
    } catch (err) {
        console.error('CMS upload error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// 4. Telegram Webhook
app.post('/telegram-webhook', (req, res) => {
    console.log('Telegram update received:', JSON.stringify(req.body));
    res.sendStatus(200);

    setImmediate(async () => {
        try {
            await bot.handleUpdate(req.body);
        } catch (err) {
            console.error('Telegram handleUpdate error:', err.message);
        }
    });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'internal_error' });
});

app.listen(PORT, () => {
    console.log(`Backend API running on port ${PORT}`);
});
