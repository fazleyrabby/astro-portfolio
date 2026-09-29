// Canvas 2D exhibits (§12.5). No WebGL. Two-tier visibility lifecycle:
// render only while on-screen and document visible; one static frame under reduced motion.

export type ExhibitContext = {
  mode: "runtime" | "debug";
  reducedMotion: boolean;
  lowPower: boolean;
};

export interface Exhibit {
  mount(canvas: HTMLCanvasElement, ctx: ExhibitContext): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  poster(): void;
}

function palette(mode: string) {
  return mode === "debug"
    ? { trace: "rgba(120,220,255,0.5)", accent: "#f5a524", bg: "#0a0d12" }
    : { trace: "rgba(14,116,144,0.5)", accent: "#c2410c", bg: "#f5f4f1" };
}

function fit(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width));
  const h = Math.max(1, Math.floor(rect.height));
  if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
  }
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

class FormulaeExhibit implements Exhibit {
  private canvas?: HTMLCanvasElement;
  private ctx?: ExhibitContext;
  private raf = 0;
  private phase = 0;

  mount(canvas: HTMLCanvasElement, ctx: ExhibitContext) {
    this.canvas = canvas;
    this.ctx = ctx;
    if (ctx.reducedMotion) this.poster();
    else this.resume();
  }

  private draw(time: number) {
    if (!this.canvas || !this.ctx) return;
    const { ctx: c, w, h } = fit(this.canvas);
    if (!c) return;
    const { trace, accent, bg } = palette(this.ctx.mode);
    c.clearRect(0, 0, w, h);
    c.fillStyle = bg;
    c.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) * 0.38;
    const curves = 3 + (this.ctx.lowPower ? 0 : 2);

    for (let k = 0; k < curves; k += 1) {
      c.beginPath();
      const ratio = (k + 2) / (k + 3);
      const spin = time * 0.00018 * (k % 2 === 0 ? 1 : -1);
      for (let t = 0; t <= Math.PI * 2; t += 0.02) {
        const r = scale * (0.72 + 0.28 * Math.sin(ratio * t + this.phase + k));
        const x = cx + r * Math.cos(t + spin);
        const y = cy + r * Math.sin(ratio * t + spin);
        if (t === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.strokeStyle = k === 0 ? accent : trace;
      c.lineWidth = k === 0 ? 1.6 : 1;
      c.stroke();
    }
  }

  private loop = (time: number) => {
    this.phase += 0.004;
    this.draw(time);
    this.raf = requestAnimationFrame(this.loop);
  };

  poster() {
    this.draw(0);
  }
  pause() {
    cancelAnimationFrame(this.raf);
  }
  resume() {
    cancelAnimationFrame(this.raf);
    if (this.ctx?.reducedMotion) return this.poster();
    this.raf = requestAnimationFrame(this.loop);
  }
  destroy() {
    cancelAnimationFrame(this.raf);
  }
}

class AsciiExhibit implements Exhibit {
  private canvas?: HTMLCanvasElement;
  private ctx?: ExhibitContext;
  private raf = 0;
  private cols = 0;
  private rows = 0;
  private glyphs = " .:-=+*#%@";
  private grid: number[] = [];

  mount(canvas: HTMLCanvasElement, ctx: ExhibitContext) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.resize();
    if (ctx.reducedMotion) this.poster();
    else this.resume();
  }

  private resize() {
    if (!this.canvas) return;
    const { w, h } = fit(this.canvas);
    const size = 14;
    this.cols = Math.floor(w / size);
    this.rows = Math.floor(h / size);
    this.grid = new Array(this.cols * this.rows).fill(0).map(() => Math.random());
  }

  private draw() {
    if (!this.canvas || !this.ctx) return;
    const { ctx: c, w, h } = fit(this.canvas);
    if (!c) return;
    const { trace, accent, bg } = palette(this.ctx.mode);
    c.fillStyle = bg;
    c.fillRect(0, 0, w, h);
    c.font = "13px 'IBM Plex Mono', monospace";
    c.textBaseline = "top";
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.cols; x += 1) {
        const i = y * this.cols + x;
        let v = this.grid[i];
        v += 0.004;
        if (v > 1) v = 0;
        this.grid[i] = v;
        const gi = Math.floor(v * this.glyphs.length);
        c.fillStyle = v > 0.82 ? accent : trace;
        c.fillText(this.glyphs[gi], x * 14, y * 14);
      }
    }
  }

  private loop = () => {
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  };

  poster() {
    this.draw();
  }
  pause() {
    cancelAnimationFrame(this.raf);
  }
  resume() {
    cancelAnimationFrame(this.raf);
    if (this.ctx?.reducedMotion) return this.poster();
    this.raf = requestAnimationFrame(this.loop);
  }
  destroy() {
    cancelAnimationFrame(this.raf);
  }
}

export function createExhibit(kind: "formula" | "ascii"): Exhibit {
  return kind === "ascii" ? new AsciiExhibit() : new FormulaeExhibit();
}
