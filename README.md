# Astro Portfolio with AI Blog Automation

## Setup

<img width="2306" height="1700" alt="CleanShot 2026-03-30 at 17 12 55@2x" src="https://github.com/user-attachments/assets/b762afda-c4f6-4b58-85a6-982bb787549b" />

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

