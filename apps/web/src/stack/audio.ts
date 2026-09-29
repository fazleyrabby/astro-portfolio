import { getState } from "./store";

let ctx: AudioContext | null = null;

function ensureContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType, gain: number, delay = 0) {
  const audio = ensureContext();
  if (!audio) return;
  const start = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  amp.gain.setValueAtTime(0, start);
  amp.gain.linearRampToValueAtTime(gain, start + 0.008);
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(amp).connect(audio.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

export type SoundKind = "focus" | "open" | "mode" | "toggle";

export function playSound(kind: SoundKind) {
  if (!getState().sound) return;
  switch (kind) {
    case "focus":
      tone(320, 0.05, "triangle", 0.03);
      break;
    case "open":
      tone(440, 0.06, "triangle", 0.035);
      tone(660, 0.07, "triangle", 0.03, 0.05);
      break;
    case "mode":
      tone(220, 0.09, "sine", 0.035);
      tone(330, 0.1, "sine", 0.03, 0.06);
      break;
    case "toggle":
      tone(520, 0.04, "square", 0.02);
      break;
  }
}
