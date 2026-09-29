// Phase 0 / C2 migration: src/data/posts.json -> src/content/notes/*.md
// Run from apps/web:  node scripts/migrate-posts-to-notes.mjs
// Emits JSON-encoded frontmatter values (valid YAML) so no YAML lib is needed.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = join(here, '..');
const sourcePath = join(webRoot, 'src/data/posts.json');
const outDir = join(webRoot, 'src/content/notes');

const posts = JSON.parse(readFileSync(sourcePath, 'utf8'));

function excerpt(markdown) {
  if (!markdown) return '';
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~\-\[\]()!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= 160) return text;
  return text.slice(0, 157).replace(/\s+\S*$/, '') + '...';
}

function safeFilename(slug, index) {
  if (/^[\x00-\x7F]+$/.test(slug)) return `${slug}.md`;
  return `bn-note-${String(index + 1).padStart(2, '0')}.md`;
}

function yamlValue(value) {
  return JSON.stringify(value);
}

mkdirSync(outDir, { recursive: true });

const manifest = [];

posts.forEach((post, index) => {
  const slug = post.slug;
  const frontmatter = [
    '---',
    `title: ${yamlValue(post.title)}`,
    `slug: ${yamlValue(slug)}`,
    `description: ${yamlValue(post.description || excerpt(post.content))}`,
    `tags: ${yamlValue(Array.isArray(post.tags) ? post.tags : [])}`,
    `published_at: ${yamlValue(post.published_at || post.created_at)}`,
    `updated_at: ${yamlValue(post.updated_at || post.published_at || post.created_at)}`,
    `featured: ${Boolean(post.featured)}`,
    `cover_image: ${post.cover_image ? yamlValue(post.cover_image) : 'null'}`,
    `lang: ${yamlValue(post.lang === 'bn' ? 'bn' : 'en')}`,
    `translation_of: ${post.translation_of ? yamlValue(post.translation_of) : 'null'}`,
    'draft: false',
    '---',
    '',
  ].join('\n');

  const filename = safeFilename(slug, index);
  const body = (post.content || '').replace(/^\uFEFF/, '').trim() + '\n';
  writeFileSync(join(outDir, filename), frontmatter + body, 'utf8');
  manifest.push({ slug, filename, title: post.title, featured: post.featured, lang: post.lang });
});

console.log(`Migrated ${manifest.length} posts to ${outDir}`);
const bn = manifest.filter((p) => p.lang === 'bn');
console.log(`  EN: ${manifest.length - bn.length}  BN: ${bn.length}`);
console.log(`  featured: ${manifest.filter((p) => p.featured).length}`);
writeFileSync(join(here, 'notes-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
