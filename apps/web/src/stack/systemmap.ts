// Persistent vertical system map (the "spine"). Highlights the active layer
// as you descend and lets you click a node to open its project / layer.
import { getState } from "./store";

export type SystemMapData = {
  layers: { id: string; name: string; accent?: string }[];
  nodes: { label: string; layer: string; href?: string }[];
};

export type SystemMapContext = {
  mode: "runtime" | "debug";
  reducedMotion: boolean;
  lowPower: boolean;
};

export interface SystemMap {
  attach(canvas: HTMLCanvasElement, data: SystemMapData, ctx: SystemMapContext): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  poster(): void;
}

const ACCENT_LIGHT: Record<string, string> = {
  accent: "#c2410c",
  signal: "#0e7490",
  lab: "#be185d",
  ok: "#047857",
};
const ACCENT_DARK: Record<string, string> = {
  accent: "#f5a524",
  signal: "#4cc9f0",
  lab: "#fb7185",
  ok: "#34d399",
};

function accent(key: string | undefined, mode: string) {
  const table = mode === "debug" ? ACCENT_DARK : ACCENT_LIGHT;
  return table[key ?? "signal"] ?? table.signal;
}

function hash(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Node = { x: number; y: number; label: string; href?: string; layer: string; color: string; r: number };

export class SystemMapExhibit implements SystemMap {
  private canvas?: HTMLCanvasElement;
  private ctx?: SystemMapContext;
  private data: SystemMapData = { layers: [], nodes: [] };
  private laidOut: Node[] = [];
  private bandY: number[] = [];
  private raf = 0;
  private hover = -1;
  private pointer = { x: -1, y: -1 };

  private onMove = (e: PointerEvent) => {
    const rect = this.canvas?.getBoundingClientRect();
    if (!rect) return;
    this.pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };
  private onLeave = () => {
    this.pointer = { x: -1, y: -1 };
    this.hover = -1;
  };
  private onUp = () => {
    const n = this.hover >= 0 ? this.laidOut[this.hover] : null;
    if (!n) return;
    if (n.href) location.assign(n.href);
    else document.querySelector<HTMLElement>(`[data-jump="${n.layer}"]`)?.click();
  };

  attach(canvas: HTMLCanvasElement, data: SystemMapData, ctx: SystemMapContext) {
    this.canvas = canvas;
    this.data = data;
    this.ctx = ctx;
    canvas.addEventListener("pointermove", this.onMove);
    canvas.addEventListener("pointerleave", this.onLeave);
    canvas.addEventListener("pointerup", this.onUp);
    if (ctx.reducedMotion) this.poster();
    else this.resume();
  }

  private activeIndex() {
    const id = getState().activeLayer;
    const i = this.data.layers.findIndex((l) => l.id === id);
    return i < 0 ? 0 : i;
  }

  private layout(w: number, h: number) {
    const mode = this.ctx?.mode ?? "runtime";
    const padTop = 30;
    const padBottom = 34;
    const n = Math.max(1, this.data.layers.length - 1);
    const band = (h - padTop - padBottom) / n;
    this.bandY = this.data.layers.map((_, i) => padTop + i * band);
    this.laidOut = [];
    this.data.layers.forEach((layer, li) => {
      const inLayer = this.data.nodes.filter((nd) => nd.layer === layer.id);
      const y = this.bandY[li] + 12;
      const startX = 92;
      const endX = w - 18;
      inLayer.forEach((nd, j) => {
        const seed = hash(nd.label);
        const t = inLayer.length === 1 ? 0.5 : j / (inLayer.length - 1);
        const jitter = (((seed >> 3) % 100) / 100 - 0.5) * 18;
        const x = inLayer.length === 1 ? (startX + endX) / 2 : startX + (endX - startX) * t;
        this.laidOut.push({
          x,
          y: y + jitter,
          label: nd.label,
          href: nd.href,
          layer: layer.id,
          color: accent(layer.accent, mode),
          r: 4.5 + (seed % 3),
        });
      });
    });
  }

  private draw(time: number) {
    if (!this.canvas || !this.ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    if (this.canvas.width !== w * dpr || this.canvas.height !== h * dpr) {
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
    }
    const c = this.canvas.getContext("2d");
    if (!c) return;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    const dark = this.ctx.mode === "debug";
    c.clearRect(0, 0, w, h);
    c.fillStyle = dark ? "#121722" : "#ffffff";
    c.fillRect(0, 0, w, h);

    this.layout(w, h);
    const active = this.activeIndex();

    // faint grid
    c.strokeStyle = dark ? "rgba(255,255,255,0.045)" : "rgba(20,23,28,0.045)";
    c.lineWidth = 1;
    for (let x = 0; x <= w; x += 26) {
      c.beginPath();
      c.moveTo(x + 0.5, 0);
      c.lineTo(x + 0.5, h);
      c.stroke();
    }

    // active band highlight
    const padTop = 30;
    const padBottom = 34;
    const band = (h - padTop - padBottom) / Math.max(1, this.data.layers.length - 1);
    const top = this.bandY[active] - band / 2 + 4;
    const grad = c.createLinearGradient(0, top, w, top + band);
    grad.addColorStop(0, accent(this.data.layers[active].accent, this.ctx.mode) + "22");
    grad.addColorStop(1, "transparent");
    c.fillStyle = grad;
    c.fillRect(0, top, w, band - 4);

    // spine
    c.strokeStyle = dark ? "rgba(120,220,255,0.22)" : "rgba(20,23,28,0.14)";
    c.beginPath();
    c.moveTo(22, this.bandY[0]);
    c.lineTo(22, this.bandY[this.bandY.length - 1]);
    c.stroke();

    // node traces
    for (const n of this.laidOut) {
      const yi = this.data.layers.findIndex((l) => l.id === n.layer);
      const y0 = this.bandY[yi];
      c.strokeStyle = dark ? "rgba(120,220,255,0.18)" : "rgba(20,23,28,0.12)";
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(22, y0);
      c.bezierCurveTo(56, y0, n.x - 40, n.y, n.x, n.y);
      c.stroke();
    }

    // layer markers + labels
    this.data.layers.forEach((layer, i) => {
      const y = this.bandY[i];
      const isActive = i === active;
      c.fillStyle = accent(layer.accent, this.ctx!.mode);
      c.beginPath();
      c.arc(22, y, isActive ? 5 : 3.2, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = isActive ? (dark ? "#e8edf5" : "#14171c") : dark ? "#6b7a8d" : "#9aa3b0";
      c.font = `${isActive ? "600 " : ""}9px 'IBM Plex Mono', monospace`;
      c.textBaseline = "middle";
      c.fillText(layer.name.toUpperCase(), 32, y, w - 40);
    });

    // packets down the spine
    const progress = (time * 0.00018) % 1;
    for (let k = 0; k < 3; k += 1) {
      const p = (progress + k / 3) % 1;
      const y = this.bandY[0] + p * (this.bandY[this.bandY.length - 1] - this.bandY[0]);
      c.fillStyle = accent("accent", this.ctx!.mode);
      c.globalAlpha = 0.2;
      c.beginPath();
      c.arc(22, y, 8, 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
      c.beginPath();
      c.arc(22, y, 3, 0, Math.PI * 2);
      c.fill();
    }

    // nodes
    this.hover = -1;
    let best = 18;
    for (let i = 0; i < this.laidOut.length; i += 1) {
      const n = this.laidOut[i];
      const d = Math.hypot(n.x - this.pointer.x, n.y - this.pointer.y);
      if (d < best) {
        best = d;
        this.hover = i;
      }
    }
    for (let i = 0; i < this.laidOut.length; i += 1) {
      const n = this.laidOut[i];
      const isHover = this.hover === i;
      const pulse = 1 + Math.sin(time * 0.002 + i) * 0.06;
      c.fillStyle = n.color;
      c.globalAlpha = isHover ? 1 : 0.85;
      c.beginPath();
      c.arc(n.x, n.y, n.r * pulse * (isHover ? 1.6 : 1), 0, Math.PI * 2);
      c.fill();
      c.globalAlpha = 1;
    }
    if (this.hover >= 0) {
      const n = this.laidOut[this.hover];
      c.fillStyle = dark ? "#121722" : "#ffffff";
      const label = n.label;
      c.font = "10px 'IBM Plex Mono', monospace";
      const tw = c.measureText(label).width;
      const bx = Math.min(n.x + 12, w - tw - 16);
      c.fillRect(bx - 6, n.y - 16, tw + 12, 18);
      c.strokeStyle = n.color;
      c.strokeRect(bx - 6, n.y - 16, tw + 12, 18);
      c.fillStyle = dark ? "#e8edf5" : "#14171c";
      c.fillText(label, bx, n.y - 4);
      if (this.canvas) this.canvas.style.cursor = "pointer";
    } else if (this.canvas) {
      this.canvas.style.cursor = "default";
    }
  }

  private loop = (time: number) => {
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
    this.canvas?.removeEventListener("pointermove", this.onMove);
    this.canvas?.removeEventListener("pointerleave", this.onLeave);
    this.canvas?.removeEventListener("pointerup", this.onUp);
  }
}

export function createSystemMap(): SystemMap {
  return new SystemMapExhibit();
}
