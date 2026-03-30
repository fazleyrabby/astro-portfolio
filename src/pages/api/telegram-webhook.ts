import type { APIRoute } from "astro";

const TELEGRAM_TOKEN = import.meta.env.TELEGRAM_TOKEN;
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = import.meta.env.GITHUB_REPOSITORY || "rabbi/astro-portfolio";

export const POST: APIRoute = async ({ request }) => {
  try {
    const update = await request.json();
    const callback = update.callback_query;
    if (!callback?.data) {
      return new Response("OK", { status: 200 });
    }

    const [action, slug] = callback.data.split(":");
    if (!action || !slug) {
      return new Response("OK", { status: 200 });
    }

    const [owner, repo] = GITHUB_REPOSITORY.split("/");
    const mdPath = `src/content/posts/${slug}.md`;

    // Fetch file from GitHub
    const ghRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" } }
    );

    if (!ghRes.ok) {
      await answerCallback(callback.id, `File not found: ${slug}`);
      return new Response("OK", { status: 200 });
    }

    const file = await ghRes.json();
    let resultText: string;

    if (action === "approve") {
      const content = atob(file.content);
      const newContent = content.replace(/\ndraft:\s*true/, "\ndraft: false");
      await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Publish: ${slug}`,
            content: btoa(newContent),
            sha: file.sha,
          }),
        }
      );
      resultText = `✅ Published: ${slug}`;
    } else {
      await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${mdPath}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Reject: ${slug}`,
            sha: file.sha,
          }),
        }
      );
      resultText = `❌ Deleted: ${slug}`;
    }

    // Answer callback + edit message
    await answerCallback(callback.id, resultText);
    await editMessage(callback.message.chat.id, callback.message.message_id, resultText);

    return new Response("OK", { status: 200 });
  } catch (e: any) {
    console.error("Webhook error:", e.message);
    return new Response("OK", { status: 200 });
  }
};

async function answerCallback(callbackId: string, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackId, text }),
  });
}

async function editMessage(chatId: number, messageId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, text }),
  });
}
