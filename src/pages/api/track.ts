export const prerender = false;

export async function POST({ request, clientAddress }) {
    const headers = request.headers;

    const ip = headers.get("cf-connecting-ip") ||
        headers.get("x-forwarded-for") ||
        headers.get("x-real-ip") ||
        clientAddress ||
        "Unknown";

    const userAgent = headers.get("user-agent") || "Unknown";
    const body = await request.json().catch(() => ({}));

    let geo = {};

    // 1️⃣ Try ipapi
    try {
        const res = await fetch(`https://ipapi.co/${ip}/json/`);

        if (res.ok) {
            geo = await res.json();
        } else {
            throw new Error("ipapi failed");
        }
    } catch (e) {
        console.log("ipapi failed, trying ipinfo");

        // 2️⃣ fallback to ipinfo
        try {
            const res = await fetch(`https://ipinfo.io/${ip}/json`);
            const data = await res.json();
            console.log(data)
            geo = {
                country_name: data.country,
                region: data.region,
                city: data.city,
                org: data.org,
                asn: data.org
            };
        } catch {
            console.log("ipinfo fallback failed");
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