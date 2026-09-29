export type Mode = "runtime" | "debug";
export type Quality = "ultra" | "balanced" | "performance";

export type StackState = {
  activeLayer: string;
  mode: Mode;
  quality: Quality;
  systemMapOpen: boolean;
  paletteOpen: boolean;
  sound: boolean;
  reducedMotion: boolean;
};

const PREFS_KEY = "stack.prefs";

type Prefs = { mode?: Mode; quality?: Quality; lastLayer?: string; sound?: boolean };

function readPrefs(): Prefs {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PREFS_KEY) ?? "{}") as Prefs;
  } catch {
    return {};
  }
}

function writePrefs(patch: Prefs) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...readPrefs(), ...patch }));
  } catch {
    /* storage unavailable */
  }
}

function params(): URLSearchParams {
  if (typeof location === "undefined") return new URLSearchParams();
  return new URLSearchParams(location.search);
}

function prefersReducedMotion(): boolean {
  if (typeof matchMedia === "undefined") return false;
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function detectQuality(): Quality {
  if (typeof navigator === "undefined") return "ultra";
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;
  if ((memory != null && memory <= 2) || (cores != null && cores <= 2)) return "performance";
  if ((memory != null && memory <= 4) || (cores != null && cores <= 4)) return "balanced";
  return "ultra";
}

const queryMode = params().get("mode");
const queryQuality = params().get("quality") as Quality | null;
const prefs = readPrefs();

let state: StackState = {
  activeLayer: params().get("layer") ?? prefs.lastLayer ?? "edge",
  mode: (queryMode === "debug" || queryMode === "runtime" ? queryMode : prefs.mode) ?? "runtime",
  quality:
    queryQuality && ["ultra", "balanced", "performance"].includes(queryQuality)
      ? queryQuality
      : detectQuality(),
  systemMapOpen: false,
  paletteOpen: false,
  sound: prefs.sound ?? false,
  reducedMotion: prefersReducedMotion(),
};

const listeners = new Set<(s: StackState) => void>();

export function getState(): StackState {
  return state;
}

export function setState(patch: Partial<StackState>) {
  state = { ...state, ...patch };
  if (patch.mode) writePrefs({ mode: patch.mode });
  if (patch.quality) writePrefs({ quality: patch.quality });
  if (patch.activeLayer) writePrefs({ lastLayer: patch.activeLayer });
  if (patch.sound !== undefined) writePrefs({ sound: patch.sound });
  for (const listener of listeners) listener(state);
}

export function subscribe(listener: (s: StackState) => void): () => void {
  listeners.add(listener);
  listener(state);
  return () => listeners.delete(listener);
}

export function setReducedMotion(reduced: boolean) {
  state = { ...state, reducedMotion: reduced };
  for (const listener of listeners) listener(state);
}
