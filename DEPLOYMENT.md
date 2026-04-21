# 🚀 Full Deployment Guide (Astro + Node API Monorepo)

## 📁 Architecture Overview
- **Frontend:** Astro (Static) -> Deployed to **Vercel**.
- **Backend:** Node.js (Express + Telegraf) -> Deployed to **Ubuntu VM (SignalStack)**.
- **Database:** Supabase (PostgreSQL + Storage).
- **AI Engine:** Groq (Llama 3 70B).

---

## 🎨 1. Frontend (Vercel)
1. **Connect GitHub:** Import your repo to Vercel.
2. **Framework:** Select **Astro**.
3. **Root Directory:** Set to `apps/web`.
4. **Build Command:** `pnpm build`.
5. **Output Directory:** `dist`.
6. **Environment Variables:**
   - `PUBLIC_API_URL`: `https://cms.fazleyrabbi.xyz` (Your backend URL).
   - `SUPABASE_URL`: Your project URL.
   - `SUPABASE_ANON_KEY`: Your anon/public key.
   - `CLOUDINARY_CLOUD_NAME`: (Required for Gallery).
   - `CLOUDINARY_API_KEY`: (Required for Gallery).
   - `CLOUDINARY_API_SECRET`: (Required for Gallery).

---

## ⚙️ 2. Backend (Ubuntu VM / SignalStack)
1. **Directory:** Upload `apps/api` contents to `~/apps/cms` on the VM.
2. **Prerequisites:**
   - Node.js 20+ installed.
   - PM2 installed globally (`npm install -g pm2`).
3. **Environment Variables (.env file in `~/apps/cms/.env`):**
   - `PORT`: 3005.
   - `TELEGRAM_TOKEN`: Your bot token.
   - `TELEGRAM_CHAT_ID`: Your personal Telegram ID.
   - `GITHUB_TOKEN`: Classic token with repo permissions.
   - `GITHUB_REPOSITORY`: `your-user/your-repo`.
   - `SUPABASE_URL`: Your project URL.
   - `SUPABASE_KEY`: **Service Role Key** (Required for uploads/bypassing RLS).
   - `GROQ_API_KEY`: For AI generation.
   - `CMS_TOKEN`: The same token you use to login to `/admin`.
4. **Execution:**
   - Run `npm install` inside the directory.
   - Start with PM2: `pm2 start server.js --name cms --max-memory-restart 300M`.
   - Save the process: `pm2 save`.

---

## ☁️ 3. Cloudflare Tunnel
1. **Config:** Add the following to your `/etc/cloudflared/config.yml` ingress:
   ```yaml
   - hostname: cms.fazleyrabbi.xyz
     service: http://localhost:3005
   ```
2. **DNS:** Run `cloudflared tunnel route dns <tunnel-id> cms.fazleyrabbi.xyz`.
3. **Restart:** `sudo systemctl restart cloudflared`.

---

## 🤖 4. Telegram Bot Setup
1. **Link Webhook:** Run this from your local computer:
   ```bash
   node apps/api/src/set-webhook.js https://cms.fazleyrabbi.xyz/?tg_webhook=1
   ```
2. **Commands:**
   - `/status`: Verify the API is alive.
   - `/me`: Get your ID to verify permissions.
   - `/generate <topic>`: Create an AI blog draft.

---

## 🖼️ 5. Image Storage (Supabase)
1. **Create Bucket:** Go to Supabase Storage and create a bucket named `blog-images`.
2. **Make Public:** Set the bucket privacy to **Public**.
3. **Policy:** Add a policy to allow `SELECT` (Read) access to `All Users`.
