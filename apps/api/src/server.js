import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { Telegraf } from 'telegraf';
import { Octokit } from '@octokit/rest';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// --- Config & Clients ---
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const REPO = process.env.GITHUB_REPOSITORY || 'fazleyrabby/astro-portfolio';
const ALLOWED_USER_ID = parseInt(TELEGRAM_CHAT_ID || "0", 10);

const bot = new Telegraf(TELEGRAM_TOKEN);
const octokit = new Octokit({ auth: GITHUB_TOKEN });
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Visit Tracking State ---
const lastNotified = new Map();
const NOTIFY_COOLDOWN = 30 * 60 * 1000;

// --- Helper Functions ---
function isBot(userAgent = "") {
    const ua = userAgent.toLowerCase();
    const botPatterns = ["googlebot", "bingbot", "yandexbot", "bot", "crawler", "spider", "vercel", "netlify"];
    return botPatterns.some(pattern => ua.includes(pattern));
}

async function hashIP(ip) {
    return crypto.createHash('sha256').update(ip + (TELEGRAM_TOKEN || "")).digest('hex').slice(0, 16);
}

async function sendTelegramNotification(message) {
    try {
        await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: 'HTML' });
    } catch (err) {
        console.error("Telegram notification failed:", err.message);
    }
}

// --- Routes ---

// 1. Contact Form
app.post('/contact', async (req, res) => {
    const { email, message, website } = req.body;
    
    // Honeypot check
    if (website) {
        return res.status(200).json({ ok: true });
    }

    const tgMessage = `📩 <b>New Contact Form Submission</b>\n\n<b>Email:</b> ${email}\n<b>Message:</b>\n${message}`;
    await sendTelegramNotification(tgMessage);
    
    res.status(201).json({ ok: true });
});

// 2. Visitor Tracking
app.post('/track', async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || "Unknown";
    const userAgent = req.headers['user-agent'] || "Unknown";
    const { platform, language, path } = req.body;

    if (isBot(userAgent) || ip === process.env.MY_IP) {
        return res.json({ ok: true });
    }

    const ipHash = await hashIP(ip);
    
    // Simple Geo Lookup (ipapi)
    let geo = {};
    try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        if (geoRes.ok) geo = await geoRes.json();
    } catch {}

    // Store in Supabase
    try {
        await supabase.rpc("record_visit", {
            p_ip_hash: ipHash,
            p_country: geo.country_name ?? "Unknown",
            p_region: geo.region ?? "Unknown",
            p_city: geo.city ?? "Unknown",
            p_isp: geo.org ?? "Unknown",
            p_platform: platform ?? "Unknown",
            p_language: language ?? "Unknown",
            p_user_agent: userAgent,
            p_path: path ?? "/",
        });
    } catch (err) {
        console.error("Supabase record_visit error:", err.message);
    }

    // Notify via Telegram with Cooldown
    const now = Date.now();
    const lastTime = lastNotified.get(ipHash) || 0;
    if (now - lastTime > NOTIFY_COOLDOWN) {
        lastNotified.set(ipHash, now);
        const notifyMsg = `🚨 <b>NEW VISITOR</b>\n📍 ${geo.city || 'Unknown'}, ${geo.country_name || 'Unknown'}\n🌐 ${geo.org || 'Unknown'}\n💻 ${platform || 'Unknown'}\n🔗 ${path || '/'}`;
        sendTelegramNotification(notifyMsg);
    }

    res.json({ ok: true });
});

// 3. Image Proxy (for dominant color detection)
app.get('/image-proxy', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).send('URL is required');

    try {
        const response = await fetch(url);
        const buffer = await response.buffer();
        res.set('Content-Type', response.headers.get('content-type'));
        res.set('Access-Control-Allow-Origin', '*');
        res.send(buffer);
    } catch (err) {
        res.status(500).send('Error proxying image');
    }
});

// 4. Telegram Webhook (The Bot Logic)
app.post('/telegram-webhook', async (req, res) => {
    try {
        await bot.handleUpdate(req.body);
        res.json({ ok: true });
    } catch (err) {
        console.error("Bot HandleUpdate Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- Telegram Bot Setup ---
// (Re-using logic from your bot.js)
bot.use(async (ctx, next) => {
    if (ctx.from?.id !== ALLOWED_USER_ID) return;
    return next();
});

bot.command('status', (ctx) => ctx.reply('🚀 API Server is running...'));

// (Include other bot handlers here or import them)

app.listen(PORT, () => {
    console.log(`✅ Backend API running on port ${PORT}`);
});
