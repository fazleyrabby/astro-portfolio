# 🚀 Full Deployment Guide (Astro + Node API Monorepo)

## 📁 Architecture Overview
- **Frontend:** Astro (Static) -> Deployed to **Vercel**.
- **Backend:** Node.js (Express + Telegraf) -> Deployed to **cPanel Shared Hosting**.
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
   - `SUPABASE_URL`: Your project URL.
   - `SUPABASE_ANON_KEY`: Your anon/public key.
   - `CLOUDINARY_CLOUD_NAME`: (Required for Gallery).
   - `CLOUDINARY_API_KEY`: (Required for Gallery).
   - `CLOUDINARY_API_SECRET`: (Required for Gallery).

---

## ⚙️ 2. Backend (cPanel Shared Hosting)
1. **Directory:** Upload `apps/api` contents to `~/api.rhtech.dev`.
2. **Setup Node.js App:**
   - **Version:** 20.x
   - **Root:** `api.rhtech.dev`
   - **URL:** `api.rhtech.dev`
   - **Startup File:** `src/server.js`
3. **Environment Variables (.env file in `~/api.rhtech.dev`):**
   - `PORT`: 3001 (or as assigned).
   - `TELEGRAM_TOKEN`: Your bot token.
   - `TELEGRAM_CHAT_ID`: Your personal Telegram ID.
   - `GITHUB_TOKEN`: Classic token with repo permissions.
   - `GITHUB_REPOSITORY`: `your-user/your-repo`.
   - `SUPABASE_URL`: Your project URL.
   - `SUPABASE_KEY`: **Service Role Key** (Required for uploads/bypassing RLS).
   - `GROQ_API_KEY`: For AI generation.
   - `CMS_TOKEN`: The same token you use to login to `/admin`.
4. **Activation:**
   - Click **Run JS Install**.
   - Click **Restart App**.

---

## 🤖 3. Telegram Bot Setup
1. **Link Webhook:** Run this from your local computer:
   ```bash
   node apps/api/src/set-webhook.js https://api.rhtech.dev/telegram-webhook
   ```
2. **Commands:**
   - `/status`: Verify the API is alive.
   - `/me`: Get your ID to verify permissions.
   - `/generate <topic>`: Create an AI blog draft.

---

## 🖼️ 4. Image Storage (Supabase)
1. **Create Bucket:** Go to Supabase Storage and create a bucket named `blog-images`.
2. **Make Public:** Set the bucket privacy to **Public**.
3. **Policy:** Add a policy to allow `SELECT` (Read) access to `All Users`.
