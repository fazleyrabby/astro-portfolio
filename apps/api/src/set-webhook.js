import 'dotenv/config';
import { Telegraf } from 'telegraf';

const TOKEN = process.env.TELEGRAM_TOKEN;
const URL = process.argv[2];

if (!URL) {
  console.error('Usage: node apps/api/src/set-webhook.js <YOUR_API_URL>/telegram-webhook');
  process.exit(1);
}

const bot = new Telegraf(TOKEN);

bot.telegram.setWebhook(URL)
  .then(() => {
    console.log(`Webhook set to: ${URL} ✅`);
    console.log('Your bot is now live on your production server!');
  })
  .catch(err => {
    console.error('Error setting webhook:', err);
  });
