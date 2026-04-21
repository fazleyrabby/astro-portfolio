#!/usr/bin/env node
// One-time sync: pushes all local .md posts into Supabase
// Run: node sync-posts.js

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: new URL('../../.env', import.meta.url).pathname });
dotenv.config(); // fallback to local .env

const __dir = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = join(__dir, '../web/src/content/posts');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY);

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const meta = {};
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':');
    if (!key || !rest.length) continue;
    let val = rest.join(':').trim().replace(/^"|"$/g, '');
    meta[key.trim()] = val;
  }
  return { meta, content: match[2].trim() };
}

function slugFromFilename(filename) {
  return basename(filename, '.md');
}

async function sync() {
  const files = readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} local .md files\n`);

  // Fetch existing slugs from Supabase
  const { data: existing } = await supabase.from('posts').select('slug');
  const existingSlugs = new Set((existing || []).map(p => p.slug));
  console.log(`Supabase has ${existingSlugs.size} posts\n`);

  let inserted = 0, updated = 0, failed = 0;

  for (const file of files) {
    const slug = slugFromFilename(file);
    const raw = readFileSync(join(POSTS_DIR, file), 'utf-8');
    const { meta, content } = parseFrontmatter(raw);

    const isDraft = meta.draft === 'true';
    const status = isDraft ? 'draft' : 'published';
    const title = meta.title || slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    const published_at = meta.date ? new Date(meta.date).toISOString() : null;
    const tags = meta.tags ? meta.tags.replace(/[\[\]]/g, '').split(',').map(t => t.trim()).filter(Boolean) : [];

    const record = { slug, title, content, status, published_at, tags, updated_at: new Date().toISOString() };

    const { error } = await supabase.from('posts').upsert(record, { onConflict: 'slug' });

    if (error) {
      console.error(`  FAIL ${slug}: ${error.message}`);
      failed++;
    } else {
      const action = existingSlugs.has(slug) ? 'updated' : 'inserted';
      console.log(`  ${action === 'inserted' ? '+ ' : '~ '} ${slug}`);
      action === 'inserted' ? inserted++ : updated++;
    }
  }

  console.log(`\nDone. Inserted: ${inserted} | Updated: ${updated} | Failed: ${failed}`);
}

sync().catch(e => { console.error(e); process.exit(1); });
