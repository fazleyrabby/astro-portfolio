import crypto from 'crypto';

/**
 * Vercel Serverless Function: /api/track
 * Dispatches visitor notifications to Discord and updates Supabase.
 */

const DISCORD_WEBHOOK_URL =
  process.env.DISCORD_WEBHOOK_URL ||
  'https://discord.com/api/webhooks/1545508644974760036/PLyVNUiInt5KCRkbQ9IbrB1qVT4TvyM8RGImQitRNdwQQVshqYi5HpcpLJODEcmk8eZS';

function parseUserAgent(ua = '') {
  let os = 'Unknown OS';
  if (/iphone/i.test(ua)) os = 'iPhone iOS';
  else if (/ipad/i.test(ua)) os = 'iPad iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/windows nt 10/i.test(ua)) os = 'Windows 10/11';
  else if (/windows nt 6\.3/i.test(ua)) os = 'Windows 8.1';
  else if (/windows nt/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Unknown Browser';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/brave/i.test(ua)) browser = 'Brave';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/opera|opr/i.test(ua)) browser = 'Opera';

  let device = '💻 Desktop';
  if (/mobile|iphone|android.*mobile/i.test(ua)) device = '📱 Mobile';
  else if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) device = '📟 Tablet';

  return { os, browser, device };
}

function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((c) => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌍';
  }
}

export default async function handler(req, res) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const headers = req.headers;
    const rawIp =
      headers['x-forwarded-for']?.split(',')[0].trim() ||
      headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      '127.0.0.1';

    const userAgent = headers['user-agent'] || 'Unknown';
    const body = req.body || {};

    // Vercel Geolocation Headers
    const country = headers['x-vercel-ip-country'] || headers['cf-ipcountry'] || body.country || null;
    const city = headers['x-vercel-ip-city'] || headers['cf-ipcity'] || body.city || null;
    const region = headers['x-vercel-ip-country-region'] || headers['cf-region'] || body.region || null;

    const { os, browser, device } = parseUserAgent(userAgent);
    const flag = getCountryFlag(country);
    const locationParts = [city, region, country].filter(Boolean);
    const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Unknown Location';

    const fields = [
      { name: '📍 Location', value: `${flag} ${locationStr}`, inline: true },
      { name: '💻 Device / OS', value: `${device} • ${os}`, inline: true },
      { name: '🌐 Browser', value: browser, inline: true },
      { name: '🛡️ IP Address', value: `\`${rawIp}\``, inline: true },
      { name: '🔗 Referrer', value: body.referrer ? `\`${body.referrer}\`` : 'Direct / Organic', inline: true },
      { name: '🧭 Page Path', value: `\`${body.path || '/'}\``, inline: true },
    ];

    if (body.screen) {
      fields.push({ name: '🖥️ Screen', value: `\`${body.screen}\``, inline: true });
    }
    if (body.hardware) {
      fields.push({ name: '⚡ Hardware', value: `\`${body.hardware}\``, inline: true });
    }
    if (body.fingerprint) {
      fields.push({ name: '🆔 Device Fingerprint', value: `\`${body.fingerprint}\``, inline: true });
    }
    if (userAgent) {
      fields.push({
        name: '🔍 Full User-Agent',
        value: `\`\`\`${userAgent.slice(0, 250)}\`\`\``,
        inline: false,
      });
    }

    const payload = {
      embeds: [
        {
          title: '🌐 New Visitor Landed',
          description: `**${flag} ${locationStr}**`,
          color: 0x3b82f6,
          fields,
          footer: { text: 'Fazley Rabbi Portfolio Telemetry • fazleyrabbi.xyz' },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    if (DISCORD_WEBHOOK_URL) {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    return res.status(200).json({ ok: true, ip: rawIp });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
