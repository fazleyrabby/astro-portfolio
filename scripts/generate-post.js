import 'dotenv/config';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { slug } from 'github-slugger';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function generatePost() {
  const contextPath = path.join(__dirname, '../data/blog-context.json');

  const contextStr = await fs.readFile(contextPath, 'utf8');
  let contextRaw;
  try {
    contextRaw = JSON.parse(contextStr);
  } catch {
    contextRaw = { topics: [] };
  }

  // Use the first topic from the queue
  const topics = contextRaw.topics || [];
  if (!topics.length) {
    console.error('No topics in queue. Run /topic first.');
    process.exit(1);
  }

  const context = topics[0];
  const remainingTopics = topics.slice(1);

  const prompt = `You are a senior backend engineer (expert in Laravel, Node.js, and Systems Design). Write a technical, portfolio-grade blog post.

TOPIC: ${context.topic}
CATEGORY: ${context.category || 'general'}
CONTEXT / BACKGROUND: ${context.context || 'None provided. Focus on real-world best practices.'}
SPECIFIC NOTES: ${context.notes || 'None provided. Fill in with practical scenarios.'}

REQUIREMENTS:
- Tone: Professional, first-person, insightful (like a 10x engineer's case study). Avoid generic tutorial hype.
- Density: Keep it extremely concise and dense with value (around 600-800 words max) to respect token limits. NO fluff.
- Structure: Start with a strong intro/problem statement. Move into architectural decisions, the solution, code snippets, and finally key takeaways.
- Code: Include practical, real-world code snippets demonstrating the solution.
- Formatting: Use proper markdown headings (##, ###), lists, and code blocks.

OUTPUT FORMAT:
Do NOT output JSON. Output raw Markdown only.
Begin your response EXACTLY with a YAML frontmatter block containing ONLY a "title" field and a "tags" field (an array of 3-5 relevant tech tags).

Example:
---
title: "Your High-Quality Post Title"
tags: ["Laravel", "Redis", "Systems Design"]
---
Your article content starts here...`;

  const completion = await openai.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
  });

  let response = completion.choices[0].message.content.trim();
  // Strip markdown code fences if the LLM wrapped the whole thing
  response = response.replace(/^```(?:markdown|md)?\s*\n?/i, '').replace(/\n?```\s*$/,'');

  let title = "New Engineering Post";
  let markdownContent = response;

  const fmMatch = response.match(/^---\n?title:\s*"?([^"\n]+)"?\n?---/);
  if (fmMatch) {
    title = fmMatch[1].trim();
    markdownContent = response.substring(fmMatch[0].length).trim();
  } else {
    // Fallback if no frontmatter
    const lines = response.split('\n');
    if (lines[0].startsWith('# ')) {
      title = lines[0].replace(/^#\s*/, '').replace(/"/g, '').trim();
      markdownContent = lines.slice(1).join('\n').trim();
    }
  }

  const post = { title, content: markdownContent };

  const slugValue = slug(post.title);

  const mdPath = path.join(__dirname, '../src/content/posts', `${slugValue}.md`);

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
  console.log(`Generated draft: ${slugValue}.md`);

  // Remove used topic
  await fs.writeFile(contextPath, JSON.stringify({ topics: remainingTopics }, null, 2) + '\n');
}

generatePost().catch(console.error);

