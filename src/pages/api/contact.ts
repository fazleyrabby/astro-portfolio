import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { email, message } = await request.json();

  if (!email || !message) {
    return new Response(JSON.stringify({ error: "Email and message are required" }), { status: 400 });
  }

  const res = await fetch(`${import.meta.env.SUPABASE_URL}/rest/v1/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ email, message }),
  });

  if (res.ok || res.status === 201) {
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Failed to save" }), { status: 500 });
};
