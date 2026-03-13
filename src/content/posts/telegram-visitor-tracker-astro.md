---
title: "Tracking Website Visitors with a Telegram Bot (Astro)"
date: 2026-03-14
description: "How to implement a telegram bot with js in Astro"
---

A simple way to get notified whenever someone visits your website is by
sending a message to **Telegram**.\
This guide shows how to add a **Telegram visitor tracker** to an Astro
site.

------------------------------------------------------------------------

## 1. Create a Telegram Bot

1.  Open Telegram and search for **@BotFather**
2.  Run:

```
    /start
    /newbot
```
3.  Give your bot a name and username.

BotFather will return a **bot token** like:

    123456789:AAxxxxxxxxxxxxxxxxxxxxx

Save this token.

------------------------------------------------------------------------

## 2. Get Your Chat ID

1.  Open your bot and send it any message.
2.  Open this URL in your browser:

```
    https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
```
Example:

    https://api.telegram.org/bot123456:ABCDEF/getUpdates

You will see something like:

``` json
"chat": {
  "id": 123456789
}
```

That number is your **chat_id**.

------------------------------------------------------------------------

## 3. Add Environment Variables

Create a `.env` file in your project root:

    TELEGRAM_TOKEN=your_bot_token
    TELEGRAM_CHAT_ID=your_chat_id

Restart your dev server after adding this.

------------------------------------------------------------------------

## 4. Create an API Endpoint

Create the file:

    src/pages/api/track.ts

Example implementation:

``` ts
export const prerender = false;

export async function POST({ request, clientAddress }) {

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    clientAddress ||
    "Unknown";

  const userAgent = request.headers.get("user-agent") || "Unknown";

  const body = await request.json().catch(() => ({}));

  const message = `
🚨 NEW VISITOR

IP: ${ip}

Device
Platform: ${body.platform ?? "Unknown"}
Language: ${body.language ?? "Unknown"}

User-Agent:
${userAgent}
`;

  const token = import.meta.env.TELEGRAM_TOKEN;
  const chatId = import.meta.env.TELEGRAM_CHAT_ID;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });

  return new Response(JSON.stringify({ ok: true }));
}
```

------------------------------------------------------------------------

## 5. Trigger the Tracker from the Frontend

Add this script to your layout or footer.

``` html
<script>
if (!sessionStorage.getItem("tracked")) {
  fetch("/api/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      platform: navigator.platform,
      language: navigator.language
    })
  }).catch(()=>{});

  sessionStorage.setItem("tracked", "1");
}
</script>
```

This ensures the request only runs **once per visitor session**.

------------------------------------------------------------------------

## 6. Example Telegram Message

    🚨 NEW VISITOR

    IP: 103.xx.xx.xx

    Device
    Platform: MacIntel
    Language: en-US

    User-Agent
    Mozilla/5.0 (Macintosh; Intel Mac OS X)

------------------------------------------------------------------------

## Notes

-   Works well for **personal sites and portfolios**
-   Prevents multiple requests using `sessionStorage`
-   Can be extended with location APIs and device detection
