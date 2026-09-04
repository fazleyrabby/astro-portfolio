import fetch from 'node-fetch';

/**
 * Parse OS, Browser, and Device category from User-Agent string.
 * Modeled directly after the SPOT project analytics.
 */
export function parseUserAgent(ua = '') {
  let os = 'Unknown OS';
  if (/iphone/i.test(ua)) os = 'iPhone iOS';
  else if (/ipad/i.test(ua)) os = 'iPad iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/windows nt 10/i.test(ua)) os = 'Windows 10/11';
  else if (/windows nt 6\.3/i.test(ua)) os = 'Windows 8.1';
  else if (/windows nt 6\.2/i.test(ua)) os = 'Windows 8';
  else if (/windows nt 6\.1/i.test(ua)) os = 'Windows 7';
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

/**
 * Convert 2-letter ISO country code into Unicode Flag Emoji.
 */
export function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return '🌍';
  }
}

/**
 * Send rich visitor notification to Discord webhook.
 */
export async function sendVisitorNotification(input) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('[Discord Analytics] DISCORD_WEBHOOK_URL is not configured');
    return;
  }

  const flag = getCountryFlag(input.countryCode || input.country);
  const locationParts = [input.city, input.region, input.country].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Unknown Location';

  const fields = [
    { name: '📍 Location', value: `${flag} ${locationStr}`, inline: true },
    { name: '💻 Device / OS', value: `${input.device} • ${input.os}`, inline: true },
    { name: '🌐 Browser', value: input.browser, inline: true },
    { name: '🛡️ IP Address', value: `\`${input.ip}\``, inline: true },
    { name: '🔗 Referrer', value: input.referrer ? `\`${input.referrer}\`` : 'Direct / Organic', inline: true },
    { name: '🧭 Page Path', value: `\`${input.path || '/'}\``, inline: true },
  ];

  if (input.isp) {
    fields.push({ name: '🏢 Network / ISP', value: `\`${input.isp}\``, inline: true });
  }

  if (input.screen) {
    fields.push({ name: '🖥️ Screen', value: `\`${input.screen}\``, inline: true });
  }

  if (input.hardware) {
    fields.push({ name: '⚡ Hardware', value: `\`${input.hardware}\``, inline: true });
  }

  if (input.fingerprint) {
    fields.push({ name: '🆔 Device Fingerprint', value: `\`${input.fingerprint}\``, inline: true });
  }

  if (input.userAgent) {
    fields.push({
      name: '🔍 Full User-Agent',
      value: `\`\`\`${input.userAgent.slice(0, 250)}\`\`\``,
      inline: false,
    });
  }

  const totalStr = input.totalVisitors ? ` • #${input.totalVisitors}` : '';

  const payload = {
    embeds: [
      {
        title: `🌐 New Visitor Landed${totalStr}`,
        description: `**${flag} ${locationStr}**`,
        color: 0x3b82f6, // SPOT Vibrant Blue
        fields,
        footer: { text: 'Fazley Rabbi Portfolio Telemetry • fazleyrabbi.xyz' },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(`[Discord Analytics] Webhook returned status ${res.status}:`, await res.text().catch(() => ''));
    }
  } catch (err) {
    console.error('[Discord Analytics] Error sending webhook:', err.message);
  }
}
