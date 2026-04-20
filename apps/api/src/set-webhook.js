import 'dotenv/config';
import { Telegraf } from 'telegraf';

const TOKEN = process.env.TELEGRAM_TOKEN;
const URL = process.argv[2];

if (!URL) {
  console.error('Usage: node scripts/set-webhook.js <YOUR_NETLIFY_SITE_URL>/api/bot');
  process.exit(1);
}

const bot = new Telegraf(TOKEN);

bot.telegram.setWebhook(URL)
  .then(() => {
    console.log(`Webhook set to: ${URL} ✅`);
    console.log('You can now stop your local bot and use Netlify!');
  })
  .catch(err => {
    console.error('Error setting webhook:', err);
  });
