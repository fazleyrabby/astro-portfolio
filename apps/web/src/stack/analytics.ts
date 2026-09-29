// Privacy-respecting analytics bridge (§22). No-ops unless a cookieless
// provider (Umami / Vercel Web Analytics) is present on the page.

type Umami = { track: (event: string, data?: Record<string, unknown>) => void };

export function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const provider = (window as unknown as { umami?: Umami }).umami;
  if (!provider?.track) return;
  try {
    provider.track(event, data);
  } catch {
    /* analytics must never break the page */
  }
}
