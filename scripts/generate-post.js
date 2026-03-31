import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function generatePost() {
  const contextPath = path.join(__dirname, '../data/blog-context.json');

  const contextStr = await fs.readFile(contextPath, 'utf8');
  const contextRaw = JSON.parse(contextStr);

  // Clean malformed data from multi-command
  const context = {
    topic: contextRaw.topic?.split('\n')[0] || '',
    category: contextRaw.category || '',
    context: contextRaw.context || '',
    notes: contextRaw.notes || ''
  };

  if (!context.topic) {
    console.error('No topic. Run /topic first.');
    process.exit(1);
  }


  const prompt = `Write a blog post as a backend engineer working with Laravel in production.

Topic: ${context.topic}

Category: ${context.category || 'general'}

Context: ${context.context || ''}

Notes: ${context.notes || ''}

Requirements:
- Avoid generic advice
- Focus on real-world problems
- Include practical examples
- Write in first-person
- Include code snippets
- Structure: intro → problem → solution → code → conclusion

Output ONLY JSON:
{
  "title": "Post title",
  "content": "Markdown content"
}`;

  const completion = await openai.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
  });

  let response = completion.choices[0].message.content.trim();
  // Strip markdown code fences if present
  response = response.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/,'');

  let post;
  try {
    post = JSON.parse(response);
  } catch {
    // LLM often returns unescaped newlines in JSON strings — extract fields manually
    const titleMatch = response.match(/"title"\s*:\s*"([^"]+)"/);
    const contentMatch = response.match(/"content"\s*:\s*"([\s\S]*)"\s*\}?\s*$/);
    if (!titleMatch || !contentMatch) {
      throw new Error('Could not parse AI response as JSON or extract title/content');
    }
    post = { title: titleMatch[1], content: contentMatch[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t') };
  }

  const slug = post.title.toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);

  const mdPath = path.join(__dirname, '../src/content/posts', `${slug}.md`);

  try {
    await fs.access(mdPath);
    console.error('Post already exists. Delete or /regen.');
    process.exit(1);
  } catch {}

  const now = new Date();
  const date = now.toISOString().replace(/\.\d{3}Z$/, '');
  const frontmatter = `---
title: "${post.title}"
date: ${date}
draft: true
---
`;

  const content = frontmatter + '\n\n' + post.content;

  await fs.writeFile(mdPath, content);
  console.log(`Generated draft: ${slug}.md`);
}

generatePost().catch(console.error);

