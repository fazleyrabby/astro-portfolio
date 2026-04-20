import fs from 'fs';
import path from 'path';

const postsDir = 'apps/web/src/content/posts';
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

console.log('-- Supabase Migration SQL');
console.log('-- Run this in your Supabase SQL Editor\n');

files.forEach(file => {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const slug = file.replace(/\.md$/, '');
    
    // Simple frontmatter parser
    const fmMatch = raw.match(/^---([\s\S]*?)---\s*([\s\S]*)$/);
    if (!fmMatch) return;

    const fm = fmMatch[1];
    const content = fmMatch[2].trim();

    const title = (fm.match(/^title:\s*["']?(.*?)["']?\s*$/m)?.[1] || slug).replace(/'/g, "''");
    const date = fm.match(/^date:\s*["']?(.*?)["']?\s*$/m)?.[1] || new Date().toISOString().split('T')[0];
    const draft = fm.match(/^draft:\s*(\S+)/m)?.[1] === 'true';
    const description = (fm.match(/^description:\s*["']?(.*?)["']?\s*$/m)?.[1] || '').replace(/'/g, "''");
    const thumbnail = fm.match(/^thumbnail:\s*["']?(.*?)["']?\s*$/m)?.[1] || '';
    
    // Extract tags
    let tags = "'{}'";
    const tagsMatch = fm.match(/^tags:\s*\[(.*?)\]/m);
    if (tagsMatch && tagsMatch[1].trim()) {
        const tagList = tagsMatch[1].split(',')
            .map(t => t.trim().replace(/^['"]|['"]$/g, '')) // Remove quotes if present
            .filter(t => t.length > 0);
        if (tagList.length > 0) {
            tags = `ARRAY[${tagList.map(t => `'${t.replace(/'/g, "''")}'`).join(',')}]::text[]`;
        }
    }

    const status = draft ? 'draft' : 'published';
    const published_at = draft ? 'NULL' : `'${date}'`;

    const sql = `INSERT INTO posts (title, slug, description, content, tags, cover_image, status, published_at)
VALUES (
  '${title}',
  '${slug}',
  '${description}',
  '${content.replace(/'/g, "''")}',
  ${tags},
  '${thumbnail}',
  '${status}',
  ${published_at}
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  description = EXCLUDED.description,
  tags = EXCLUDED.tags,
  cover_image = EXCLUDED.cover_image,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;
`;

    console.log(sql);
    console.log('--------------------------------------------------\n');
});
