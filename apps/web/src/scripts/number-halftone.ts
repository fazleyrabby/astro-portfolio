// Number halftone ground: a grid of digits whose size carries the tone, the
// way dot size does in print. Still at rest, thin behind the copy and heavier toward
// the right edge. While the pointer is over its host section the tone rolls in waves and ripples
// out from the cursor (digits tick over as a crest passes), then settles and stops.
const COL = 13; // CSS px per digit cell
const ROW = 15;

function mount(canvas: HTMLCanvasElement) {
  const host = canvas.closest<HTMLElement>("[data-halftone-host]") ?? canvas.parentElement;
  const ctx = canvas.getContext("2d");
  if (!host || !ctx || canvas.dataset.ready) return;
  canvas.dataset.ready = "true";

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const atlas = document.createElement("canvas"); // digits 0-9, pre-inked
  let glyph = 0; // atlas cell size in device px
  let dpr = 1;
  let cols = 0;
  let rows = 0;
  let tone = 1; // thinned on narrow screens, where copy spans the full width
  let ink = "13 105 112";
  let mx = -9999; // pointer, CSS px inside the canvas
  let my = -9999;
  let amp = 0; // 0 = still field, 1 = full waves
  let target = 0;
  let t = 0;
  let rafId: number | null = null;

  const buildAtlas = () => {
    const raw = getComputedStyle(document.body).getPropertyValue("--accent-rgb").trim();
    if (raw) ink = raw;
    glyph = Math.ceil(ROW * 1.5 * dpr);
    atlas.width = glyph * 10;
    atlas.height = glyph;
    const a = atlas.getContext("2d");
    if (!a) return;
    a.clearRect(0, 0, atlas.width, atlas.height);
    a.fillStyle = `rgb(${ink.split(/[\s,]+/).join(",")})`;
    a.font = `600 ${Math.floor(glyph * 0.86)}px "IBM Plex Mono", ui-monospace, monospace`;
    a.textAlign = "center";
    a.textBaseline = "middle";
    for (let d = 0; d < 10; d++) a.fillText(String(d), glyph * (d + 0.5), glyph * 0.54);
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < rows; r++) {
      const ny = (r + 0.5) / rows;
      const cy = (r + 0.5) * ROW;
      for (let c = 0; c < cols; c++) {
        const nx = (c + 0.5) / cols;
        const cx = (c + 0.5) * COL;
        // resting tone: thin behind the copy, heavier toward the right edge
        let v = (0.01 + 0.34 * nx * nx + 0.05 * Math.sin(nx * 5.2 + ny * 3.4) + 0.04 * ny) * tone;
        let digit = ((c * 73856093) ^ (r * 19349663)) >>> 0;
        if (amp > 0.002) {
          const roll = Math.sin(nx * 13 + t * 1.9 + Math.sin(ny * 8 + t * 1.2) * 1.4);
          const dx = cx - mx;
          const dy = cy - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          const ripple = Math.sin(d * 0.065 - t * 5.2) * Math.exp(-d / 150);
          v += amp * (0.09 * roll + 0.24 * ripple);
          digit += Math.floor(amp * (roll * 2 + ripple * 6) + 8);
        }
        if (v < 0.035) continue;
        const size = ROW * Math.min(1.45, 0.3 + 1.25 * v) * dpr;
        ctx.drawImage(atlas, (digit % 10) * glyph, 0, glyph, glyph, cx * dpr - size / 2, cy * dpr - size / 2, size, size);
      }
    }
  };

  const frame = () => {
    amp += (target - amp) * 0.05;
    t += 1 / 60;
    if (target === 0 && amp < 0.004) {
      amp = 0;
      draw();
      rafId = null;
      return;
    }
    draw();
    rafId = requestAnimationFrame(frame);
  };
  const run = () => {
    if (!still && rafId === null) rafId = requestAnimationFrame(frame);
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const nextDpr = Math.min(2, window.devicePixelRatio || 1);
    const nw = Math.max(1, Math.round(rect.width * nextDpr));
    const nh = Math.max(1, Math.round(rect.height * nextDpr));
    if (nw === canvas.width && nh === canvas.height && nextDpr === dpr) return;
    dpr = nextDpr;
    canvas.width = nw;
    canvas.height = nh;
    cols = Math.ceil(rect.width / COL);
    rows = Math.ceil(rect.height / ROW);
    tone = rect.width < 640 ? 0.5 : 1;
    buildAtlas();
    draw();
  };

  resize();
  new ResizeObserver(resize).observe(canvas);
  // Digits are drawn from the mono face; repaint once it has loaded.
  document.fonts?.load('600 16px "IBM Plex Mono"').then(() => {
    buildAtlas();
    draw();
  });
  // Theme switch: re-ink the digits and repaint the still field.
  new MutationObserver(() => {
    buildAtlas();
    draw();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  if (still || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  window.addEventListener(
    "pointermove",
    (e) => {
      const rect = host.getBoundingClientRect();
      const inside = e.clientY >= Math.max(64, rect.top) && e.clientY <= rect.bottom;
      if (!inside) {
        target = 0;
        return;
      }
      const c = canvas.getBoundingClientRect();
      mx = e.clientX - c.left;
      my = e.clientY - c.top;
      target = 1;
      run();
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => {
    target = 0;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) target = 0;
  });
}

/** Mount every `canvas[data-halftone]` on the page; its host is the nearest `[data-halftone-host]`. */
export function initHalftones() {
  document.querySelectorAll<HTMLCanvasElement>("canvas[data-halftone]").forEach(mount);
}
