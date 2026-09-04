import crypto from 'crypto';

/**
 * Vercel Serverless Function: /api/track
 * 100% Serverless - Runs natively on Vercel (fazleyrabbi.xyz)
 * Dispatches rich visitor telemetry notifications to Discord and updates Supabase.
 */

const DISCORD_WEBHOOK_URL =
  process.env.DISCORD_WEBHOOK_URL ||
  'https://discord.com/api/webhooks/1545508644974760036/PLyVNUiInt5KCRkbQ9IbrB1qVT4TvyM8RGImQitRNdwQQVshqYi5HpcpLJODEcmk8eZS';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://pwqzjazzlysvilumztww.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_rKuXk6jFMkN_Or0dn6jl9Q_Fc7K1Jdk';

// In-memory cooldown cache per serverless execution instance
const lastAlertMap = new Map();
const COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes

function isPrivateIP(ip) {
  if (!ip) return true;
  const clean = ip.replace(/^.*:/, '');
  return (
    clean === '127.0.0.1' ||
    clean === 'localhost' ||
    /^10\./.test(clean) ||
    /^192\.168\./.test(clean) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean)
  );
}

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
  else if (/cros/i.test(ua)) os = 'ChromeOS';

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
      headers['cf-connecting-ip'] ||
      req.socket?.remoteAddress ||
      '127.0.0.1';

    const userAgent = headers['user-agent'] || 'Unknown';
    const body = req.body || {};
    const isTest = req.query?.test === '1' || body?.test === true;

    // Vercel / Cloudflare Geolocation Headers
    let country = headers['x-vercel-ip-country'] || headers['cf-ipcountry'] || body.country || null;
    let city = headers['x-vercel-ip-city'] || headers['cf-ipcity'] || body.city || null;
    let region = headers['x-vercel-ip-country-region'] || headers['cf-region'] || body.region || null;
    let isp = body.isp || null;

    // Fallback IP lookup if geolocation headers are absent and IP is public
    if ((!country || country === 'XX') && !isPrivateIP(rawIp)) {
      try {
        const geoRes = await fetch(`https://ipwho.is/${rawIp}`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.success) {
            country = geoData.country_code || geoData.country;
            city = geoData.city;
            region = geoData.region;
            isp = geoData.connection?.isp || geoData.connection?.org;
          }
        }
      } catch (_) {}
    }

    const { os, browser, device } = parseUserAgent(userAgent);
    const flag = getCountryFlag(country);
    const locationParts = [city, region, country].filter(Boolean);
    const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Unknown Location';

    const ipHash = crypto.createHash('sha256').update(rawIp + 'portfolio_salt').digest('hex').slice(0, 16);
    const landingPath = body.path || req.query?.path || '/';
    const referrer = body.referrer || headers['referer'] || headers['referrer'] || null;

    // Supabase update via native REST API (zero extra dependencies)
    let totalVisitors = 0;
    try {
      if (SUPABASE_URL && SUPABASE_KEY) {
        // Upsert record into visitors table
        await fetch(`${SUPABASE_URL}/rest/v1/visitors`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            ip_hash: ipHash,
            country: country || 'Unknown',
            region: region || 'Unknown',
            city: city || 'Unknown',
            isp: isp || 'Unknown',
            platform: body.platform || os,
            language: body.language || 'Unknown',
            user_agent: userAgent,
            path: landingPath,
            last_visited: new Date().toISOString(),
          }),
        }).catch(() => {});
      }
    } catch (_) {}

    // Cooldown check to prevent Discord spamming on rapid navigation
    const now = Date.now();
    const lastTime = lastAlertMap.get(ipHash) || 0;
    const shouldAlert = isTest || now - lastTime > COOLDOWN_MS;

    if (shouldAlert && DISCORD_WEBHOOK_URL) {
      lastAlertMap.set(ipHash, now);

      const fields = [
        { name: '📍 Location', value: `${flag} ${locationStr}`, inline: true },
        { name: '💻 Device / OS', value: `${device} • ${os}`, inline: true },
        { name: '🌐 Browser', value: browser, inline: true },
        { name: '🛡️ IP Address', value: `\`${rawIp}\``, inline: true },
        { name: '🔗 Referrer', value: referrer ? `\`${referrer}\`` : 'Direct / Organic', inline: true },
        { name: '🧭 Page Path', value: `\`${landingPath}\``, inline: true },
      ];

      if (isp) {
        fields.push({ name: '🏢 Network / ISP', value: `\`${isp}\``, inline: true });
      }
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

      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch((e) => console.error('Discord error:', e.message));
    }

    return res.status(200).json({ ok: true, ip: rawIp });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
