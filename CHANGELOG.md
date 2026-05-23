# Changelog

All notable changes to astro-portfolio will be documented in this file.

---

## [2026-05-06] — CMS Env Vars & PM2 Config Fix

### Fixed
- **CMS crashing on boot (2 restarts)**: `SUPABASE_SERVICE_KEY`, `CLOUDINARY_API_URL`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`, and `UMAMI_ID` were missing from `apps/cms/ecosystem.config.cjs` on the VPS.
  - `server.js` uses `SUPABASE_SERVICE_KEY || SUPABASE_KEY` — without the service key it fell back to the publishable key (`sb_publishable_*`), causing Supabase write operations (posts upsert, storage) to fail silently or return RLS errors.
  - Cloudinary image uploads would also fail without the Cloudinary vars.
  - Fix: Added all missing vars to `ecosystem.config.cjs` and ran `pm2 reload`.
- **Admin "Invalid Token. Access Denied."**: Caused by the above — CMS was intermittently broken on boot, making `/cms/posts` unreachable. The admin login page (`/admin/login`) shows this error when the API returns anything other than 200.

### Notes
- `~/.cloudflared/config.yml` and `/etc/cloudflared/config.yml` are different files. Systemd uses `/etc/cloudflared/config.yml` — always edit that one (requires sudo).
- Correct CMS admin token is in `ecosystem.config.cjs` as `CMS_TOKEN`.
