# Astro Portfolio

## Setup

<img width="1228" height="797" alt="CleanShot 2026-08-07 at 02 10 27" src="https://github.com/user-attachments/assets/56eb0acf-b61f-4b18-bb7a-5f1cc9e77765" />

<!-- <img width="1379" height="790" alt="CleanShot 2026-07-26 at 00 50 08" src="https://github.com/user-attachments/assets/7a2e0244-1b65-4551-99e3-82b1e2515506" /> -->



1. Set GitHub Repo Secrets:
   - `GROQ_API_KEY`: Your Groq API key
   - `TELEGRAM_BOT_TOKEN`: From @BotFather
   - `TELEGRAM_CHAT_ID`: Your chat ID
   - `GITHUB_TOKEN`: Personal access token with repo contents/write

2. Get Telegram Chat ID:
   Send message to bot, visit `https://api.telegram.org/bot<TOKEN>/getUpdates`

3. Test locally:
   ```
   export GROQ_API_KEY=...
   npm run generate # After /topic etc
   npm run bot
   ```

4. Workflow:
   - Use Telegram bot commands: /topic, /context, /generate
   - Approve draft via buttons
   - Vercel auto deploys

## Commands

/topic <text>
 /context <text>
 /category <text>
 /note <text>
 /generate
 /status
 /reset

