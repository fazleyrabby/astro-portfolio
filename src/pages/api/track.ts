export const prerender = false;

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

export async function POST({ request, clientAddress }) {
    const headers = request.headers;

    const ip = headers.get("cf-connecting-ip") ||
        headers.get("x-forwarded-for") ||
        headers.get("x-real-ip") ||
        clientAddress ||
        "Unknown";

    const userAgent = headers.get("user-agent") || "Unknown";

    if (isBot(userAgent) || isPrivateIP(ip)) {
        return new Response(JSON.stringify({ ok: true, ip, skipped: true }), {
            headers: { "Content-Type": "application/json" }
        });
    }

    const body = await request.json().catch(() => ({}));

    let geo = {};

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
                asn: data.org
            };
        } catch {
            // silent fallback
        }
    }

    const message = `
🚨 <b>NEW VISITOR DETECTED</b>

🌍 <b>IP Address</b>
<code>${ip}</code>

📍 <b>Location</b>
• Country: ${geo.country_name ?? "Unknown"}
• Region: ${geo.region ?? "Unknown"}
• City: ${geo.city ?? "Unknown"}

🌐 <b>Network</b>
• ISP: ${geo.org ?? "Unknown"}
• ASN: ${geo.asn ?? "Unknown"}

💻 <b>Device</b>
• Platform: ${body.platform ?? "Unknown"}
• Language: ${body.language ?? "Unknown"}

🧠 <b>User Agent</b>
<code>${userAgent}</code>

🕒 <b>Time</b>
• ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━
`;

    const token = import.meta.env.TELEGRAM_TOKEN;
    const chatId = import.meta.env.TELEGRAM_CHAT_ID;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "HTML"
        })
    });

    return new Response(JSON.stringify({
        ok: true,
        ip
    }), {
        headers: { "Content-Type": "application/json" }
    });
}