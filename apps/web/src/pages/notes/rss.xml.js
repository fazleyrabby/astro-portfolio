import { getCollection } from "astro:content";
import { SITE_URL } from "../../lib/seo";
import { profile } from "../../data/profile";

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const notes = (await getCollection("notes"))
    .filter((n) => !n.draft)
    .sort((a, b) => new Date(b.data.published_at).valueOf() - new Date(a.data.published_at).valueOf());

  const items = notes
    .map((note) => {
      const slug = note.data.slug ?? note.slug;
      const url = new URL(`/notes/${slug}/`, SITE_URL).toString();
      return `    <item>
      <title>${escapeXml(note.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(note.data.published_at).toUTCString()}</pubDate>
      <description>${escapeXml(note.data.description ?? "")}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Fazley Rabbi — Notes</title>
    <link>${SITE_URL}/notes/</link>
    <description>Writing by ${profile.name} on Laravel, backend systems, and infrastructure.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/notes/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
