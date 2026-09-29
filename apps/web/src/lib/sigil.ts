// Deterministic project sigil generator (§18): no assets, same seed -> same art.

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Sigil = {
  cells: boolean[];
  size: number;
  accent: string;
  trace: string;
};

const ACCENTS = ["var(--accent)", "var(--signal)", "var(--lab)", "var(--ok)"];

export function generateSigil(seed: string, size = 7): Sigil {
  const rng = mulberry32(hashString(seed || "stack"));
  const half = Math.ceil(size / 2);
  const cells = new Array(size * size).fill(false);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < half; x += 1) {
      const on = rng() > 0.52;
      if (!on) continue;
      cells[y * size + x] = true;
      cells[y * size + (size - 1 - x)] = true;
    }
  }

  return {
    cells,
    size,
    accent: ACCENTS[Math.floor(rng() * ACCENTS.length)],
    trace: "var(--trace)",
  };
}
