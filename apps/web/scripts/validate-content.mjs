// Build-time content validation (§14). Fails on broken references / orphaned
// projects / malformed URLs / duplicate slugs. Warns on non-fatal issues.
// Run from apps/web:  node scripts/validate-content.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { layers } from '../src/data/layers.ts';

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = join(here, '..');

const errors = [];
const warnings = [];

function readDir(dir) {
  const abs = join(webRoot, dir);
  return readdirSync(abs)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((file) => {
      const raw = readFileSync(join(abs, file), 'utf8');
      const { data, content } = matter(raw);
      return { file, slug: file.replace(/\.(md|mdx)$/, ''), data, content };
    });
}

const projects = readDir('src/content/projects');
const notes = readDir('src/content/notes');

// 1. Duplicate slugs
const seen = new Map();
for (const p of projects) {
  if (seen.has(p.slug)) errors.push(`Duplicate project slug: ${p.slug}`);
  seen.set(p.slug, p);
}
const noteSlugs = new Map();
for (const n of notes) {
  const slug = n.data.slug ?? n.slug;
  if (noteSlugs.has(slug)) errors.push(`Duplicate note slug: ${slug}`);
  noteSlugs.set(slug, n);
}

// 2. Layer -> project references resolve
const projectSlugs = new Set(projects.map((p) => p.slug));
const referenced = new Set();
for (const layer of layers) {
  for (const id of layer.serviceIds) {
    referenced.add(id);
    if (!projectSlugs.has(id)) {
      errors.push(`Layer "${layer.id}" references unknown project "${id}"`);
    }
  }
}

// 3. No orphaned (non-hidden) EN projects
for (const p of projects) {
  const isBn = (p.data.lang ?? 'en') === 'bn';
  if (p.data.hidden || isBn) continue;
  if (!referenced.has(p.slug)) {
    errors.push(`Orphaned project "${p.slug}": not mapped to any layer`);
  }
}

// 4. URLs parse; non-https is a warning (real source has legacy http URLs)
const urlFields = [
  ['live', (p) => p.data.live],
  ['github', (p) => p.data.github],
];
for (const p of projects) {
  for (const [field, get] of urlFields) {
    const value = get(p);
    if (!value) continue;
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:') {
        warnings.push(`${p.slug}: ${field} is not https (${value})`);
      }
    } catch {
      errors.push(`${p.slug}: ${field} is not a valid URL (${value})`);
    }
  }
}

// 5. Required note fields + valid dates
for (const n of notes) {
  if (!n.data.title) errors.push(`Note ${n.slug}: missing title`);
  const date = n.data.published_at;
  if (!date || Number.isNaN(new Date(date).valueOf())) {
    errors.push(`Note ${n.slug}: missing/invalid published_at`);
  }
}

// 6. Duplicate ordering (non-fatal; §C8)
const positions = new Map();
for (const p of projects) {
  if (p.data.position == null) continue;
  const key = p.data.position;
  if (positions.has(key)) {
    warnings.push(`Duplicate position ${key}: ${positions.get(key)} & ${p.slug}`);
  }
  positions.set(key, p.slug);
}

console.log(
  `Validated ${projects.length} projects, ${notes.length} notes, ${layers.length} layers.`,
);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ! ${w}`);
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('\nContent validation passed.');
