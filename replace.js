const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'components');
const layoutsDir = path.join(__dirname, 'src', 'layouts');
const pagesDir = path.join(__dirname, 'src', 'pages');

const replacements = [
  { search: /bg-\[var\(--bg-card\)\]/g, replace: 'bg-surface' },
  { search: /bg-\[var\(--bg-surface\)\]/g, replace: 'bg-surface' },
  { search: /bg-\[var\(--bg-base\)\]/g, replace: 'bg-base' },
  { search: /text-\[var\(--text-primary\)\]/g, replace: 'text-text' },
  { search: /border-\[var\(--border\)\]/g, replace: 'border-border' },
  { search: /border-\[var\(--accent\)\]/g, replace: 'border-accent' },
  { search: /bg-\[var\(--accent\)\]/g, replace: 'bg-accent' },
  { search: /text-\[var\(--accent\)\]/g, replace: 'text-accent' },
  { search: /from-\[var\(--accent\)\]/g, replace: 'from-accent' },
  { search: /to-\[var\(--accent\)\]/g, replace: 'to-accent' }
];

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.astro')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const rx of replacements) {
        if (rx.search.test(content)) {
          content = content.replace(rx.search, rx.replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir(srcDir);
processDir(layoutsDir);
processDir(pagesDir);
console.log('Done replacement');
