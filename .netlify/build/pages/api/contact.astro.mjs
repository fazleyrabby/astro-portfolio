import { s as supabase } from '../../chunks/supabase_DxrZTcmC.mjs';
export { renderers } from '../../renderers.mjs';

const BLOCKED_DOMAINS = /* @__PURE__ */ new Set([
  "tempmail.com",
  "throwaway.email",
  "guerrillamail.com",
  "guerrillamail.net",
  "mailinator.com",
  "yopmail.com",
  "10minutemail.com",
  "trashmail.com",
  "fakeinbox.com",
  "sharklasers.com",
  "guerrillamailblock.com",
  "grr.la",
  "dispostable.com",
  "mailnesia.com",
  "maildrop.cc",
  "discard.email",
  "temp-mail.org",
  "tempail.com",
  "mohmal.com",
  "getnada.com",
  "emailondeck.com",
  "33mail.com",
  "tempr.email",
  "temp-mail.io",
  "burnermail.io",
  "inboxkitten.com",
  "mailsac.com",
  "harakirimail.com",
  "tmail.ws",
  "tempmailo.com",
  "emailfake.com",
  "crazymailing.com",
  "armyspy.com",
  "dayrep.com",
  "einrot.com",
  "fleckens.hu",
  "gustr.com",
  "jourrapide.com",
  "rhyta.com",
  "superrito.com",
  "teleworm.us",
  "tempmailaddress.com",
  "tmpmail.net",
  "tmpmail.org",
  "mailcatch.com",
  "meltmail.com",
  "mintemail.com",
  "mt2015.com",
  "thankyou2010.com",
  "trash-mail.com",
  "trashymail.com",
  "wegwerfmail.de",
  "wegwerfmail.net",
  "yopmail.fr",
  "spamgourmet.com",
  "mytemp.email",
  "tempinbox.com",
  "mailnator.com",
  "anonbox.net",
  "binkmail.com"
]);
const rateMap = /* @__PURE__ */ new Map();
const RATE_LIMIT = 3;
const RATE_WINDOW = 10 * 60 * 1e3;
function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (rateMap.get(ip) || []).filter((t) => now - t < RATE_WINDOW);
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  rateMap.set(ip, timestamps);
  return false;
}
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email);
}
function isBlockedDomain(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  return !domain || BLOCKED_DOMAINS.has(domain);
}
const POST = async ({ request, clientAddress }) => {
  const ip = request.headers.get("x-forwarded-for") || clientAddress || "unknown";
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests. Try again later." }), { status: 429 });
  }
  const body = await request.json().catch(() => null);
  if (!body) {
    return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400 });
  }
  const { email, message, website } = body;
  if (website) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
  if (!email || !message) {
    return new Response(JSON.stringify({ error: "Email and message are required" }), { status: 400 });
  }
  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: "Please enter a valid email address" }), { status: 400 });
  }
  if (isBlockedDomain(email)) {
    return new Response(JSON.stringify({ error: "Disposable email addresses are not allowed" }), { status: 400 });
  }
  if (message.length < 10 || message.length > 5e3) {
    return new Response(JSON.stringify({ error: "Message must be between 10 and 5000 characters" }), { status: 400 });
  }
  const { error } = await supabase.from("contacts").insert({ email, message });
  if (error) {
    console.error("Supabase error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const escapeHtml = (unsafe) => unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  const telegramMsg = `
📩 <b>NEW CONTACT FORM SUBMISSION</b>

📧 <b>Email:</b> <code>${escapeHtml(email)}</code>

💬 <b>Message:</b>
${escapeHtml(message)}

🕒 <b>Time:</b> ${(/* @__PURE__ */ new Date()).toLocaleString()}
━━━━━━━━━━━━━━━━━━`;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: telegramMsg,
      parse_mode: "HTML"
    })
  }).catch(() => console.error("Telegram notification failed"));
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
