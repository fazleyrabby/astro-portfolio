export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  const src = url.searchParams.get("url");
  if (!src) return new Response("Missing url param", { status: 400 });
  try {
    const res = await fetch(src);
    if (!res.ok) return new Response("Failed to fetch image", { status: res.status });
    const contentType = res.headers.get("content-type") || "image/png";
    const buffer = await res.arrayBuffer();
    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400"
      }
    });
  } catch {
    return new Response("Error fetching image", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
