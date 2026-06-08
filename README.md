# Astro Portfolio with AI Blog Automation

## Setup

<img width="2668" height="1844" alt="CleanShot 2026-06-08 at 17 12 42@2x" src="https://github.com/user-attachments/assets/dca3379b-3a12-4bb1-bdee-449cee39e316" />


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

