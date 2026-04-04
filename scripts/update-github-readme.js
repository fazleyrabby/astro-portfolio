import 'dotenv/config';
import { Octokit } from '@octokit/rest';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const PROFILE_REPO = 'fazleyrabby/fazleyrabby';
const SITE_URL = 'https://fazleyrabbi.xyz';

async function updateReadme() {
  const postsDir = path.join(__dirname, '../src/content/posts');
  const files = await fs.readdir(postsDir);
  
  const posts = [];
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const content = await fs.readFile(path.join(postsDir, file), 'utf8');
    const { data } = matter(content);
    if (!data.draft) {
      posts.push({
        id: file.replace('.md', ''),
        ...data
      });
    }
  }

  // Sort by date and find the latest featured post
  const featured = posts
    .filter(p => p.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  if (!featured) {
    console.log('No featured post found to update README.');
    return;
  }

  const postUrl = `${SITE_URL}/posts/${featured.id}`;
  const highlightSection = `<!-- START_POST_HIGHLIGHT -->
### 🌟 Featured Article
**[${featured.title}](${postUrl})**
> ${featured.description || 'Dive deep into my latest technical deep-dive and production engineering patterns.'}
<!-- END_POST_HIGHLIGHT -->`;

  const [owner, repo] = PROFILE_REPO.split('/');

  try {
    const { data: readmeFile } = await octokit.repos.getContent({ owner, repo, path: 'README.md' });
    let content = Buffer.from(readmeFile.content, 'base64').toString('utf8');

    const regex = /<!-- START_POST_HIGHLIGHT -->[\s\S]*<!-- END_POST_HIGHLIGHT -->/;
    
    if (regex.test(content)) {
      content = content.replace(regex, highlightSection);
    } else {
      // If the markers don't exist, append it (or you can specify where to insert)
      content += `\n\n${highlightSection}`;
    }

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'README.md',
      message: `Update featured post: ${featured.title}`,
      content: Buffer.from(content).toString('base64'),
      sha: readmeFile.sha
    });

    console.log(`Successfully updated GitHub profile README with: ${featured.title} ✅`);
  } catch (e) {
    console.error(`Error updating README: ${e.message}`);
  }
}

updateReadme();
