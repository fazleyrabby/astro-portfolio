import { supabase } from "../../lib/supabase";

export const prerender = false;

// In-memory deduplication: track last notification time per IP hash
const lastNotified = new Map<string, number>();
const NOTIFY_COOLDOWN = 30 * 60 * 1000; // 30 minutes

function isBot(userAgent: string): boolean {
    const ua = userAgent.toLowerCase();
    const botPatterns = [
        "googlebot", "bingbot", "yandexbot", "duckduckbot", "baiduspider",
        "slurp", "sogou", "exabot", "facebot", "ia_archiver",
        "facebookexternalhit", "twitterbot", "telegrambot", "whatsapp",
        "linkedinbot", "pinterestbot",
        "uptimerobot", "pingdom", "statuscake", "site24x7",
        "nessus", "openvas", "nmap", "sqlmap", "nikto",
        "gptbot", "chatgpt", "claudebot", "anthropic", "applebot",
        "headlesschrome", "headless", "phantomjs", "selenium", "puppeteer",
        "netlify", "prerender", "rendertron",
        "bot", "crawler", "spider", "scraper", "wget", "curl",
    ];
    return botPatterns.some(pattern => ua.includes(pattern));
}

function isPrivateIP(ip: string): boolean {
    const cleanIP = ip.split(":")[0];
    const privateRanges = [
        /^127\.0\.0\.1$/,
        /^::1$/,
        /^10\./,
        /^192\.168\./,
        /^172\.(1[6-9]|2[0-9]|3[01])\./,
        /^169\.254\./,
        /^fc00:/i,
        /^fe80:/i,
    ];
    return privateRanges.some(pattern => pattern.test(cleanIP));
}

async function hashIP(ip: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + (import.meta.env.TELEGRAM_TOKEN || ""));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

async function storeVisit(data: {
    ipHash: string;
    country: string;
    region: string;
    city: string;
    isp: string;
    platform: string;
    language: string;
    userAgent: string;
    path: string;
}) {
    try {
        await supabase.rpc("record_visit", {
            p_ip_hash: data.ipHash,
            p_country: data.country,
            p_region: data.region,
            p_city: data.city,
            p_isp: data.isp,
            p_platform: data.platform,
            p_language: data.language,
            p_user_agent: data.userAgent,
            p_path: data.path,
        });
    } catch (err) {
        console.error("Failed to store visit in Supabase:", err);
    }
}

async function sendTelegramNotification(message: string) {
    const token = import.meta.env.TELEGRAM_TOKEN;
    const chatId = import.meta.env.TELEGRAM_CHAT_ID;

    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML",
            }),
        });
    } catch {
        console.error("Telegram notification failed");
    }
}

export async function POST({ request, clientAddress }) {
    const headers = request.headers;

    const ip = headers.get("cf-connecting-ip") ||
        headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        headers.get("x-real-ip") ||
        clientAddress ||
        "Unknown";

    const userAgent = headers.get("user-agent") || "Unknown";
    const path = new URL(request.url).pathname;

    const myIP = import.meta.env.MY_IP || "";

    if (isBot(userAgent) || isPrivateIP(ip) || (myIP && ip === myIP)) {
        return new Response(JSON.stringify({ ok: true }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    const body = await request.json().catch(() => ({}));
    const ipHash = await hashIP(ip);

    let geo: Record<string, string> = {};

    try {
        const res = await fetch(`https://ipapi.co/${ip}/json/`);
        if (res.ok) {
            geo = await res.json();
        } else {
            throw new Error("ipapi failed");
        }
    } catch {
        try {
            const res = await fetch(`https://ipinfo.io/${ip}/json`);
            const data = await res.json();
            geo = {
                country_name: data.country,
                region: data.region,
                city: data.city,
                org: data.org,
                asn: data.org,
            };
        } catch {
            // silent fallback
        }
    }

    await storeVisit({
        ipHash,
        country: geo.country_name ?? "Unknown",
        region: geo.region ?? "Unknown",
        city: geo.city ?? "Unknown",
        isp: geo.org ?? "Unknown",
        platform: body.platform ?? "Unknown",
        language: body.language ?? "Unknown",
        userAgent,
        path,
    });

    const now = Date.now();
    const lastTime = lastNotified.get(ipHash) || 0;
    const shouldNotify = now - lastTime > NOTIFY_COOLDOWN;

    if (shouldNotify) {
        lastNotified.set(ipHash, now);

        const message = `
🚨 <b>NEW VISITOR DETECTED</b>

📍 <b>Location</b>
• Country: ${geo.country_name ?? "Unknown"}
• Region: ${geo.region ?? "Unknown"}
• City: ${geo.city ?? "Unknown"}

🌐 <b>Network</b>
• ISP: ${geo.org ?? "Unknown"}

💻 <b>Device</b>
• Platform: ${body.platform ?? "Unknown"}
• Language: ${body.language ?? "Unknown"}

🕒 <b>Time</b>
• ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━
`;
        sendTelegramNotification(message);
    }

    return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" }
    });
}