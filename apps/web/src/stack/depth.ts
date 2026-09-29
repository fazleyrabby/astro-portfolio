import {
  getState,
  setState,
  subscribe,
  setReducedMotion,
  type Mode,
} from "./store";
import { playSound } from "./audio";
import { track } from "./analytics";

// Discrete depth: the active layer is flat; neighbours recede by one or more
// steps. We never re-transform on every frame — that is what made it wobble.
const MAX_DP = 3;

export function initStack() {
  // ?view=manifest is the guaranteed flat fallback from any state (§16/§25).
  if (new URLSearchParams(location.search).get("view") === "manifest") {
    location.replace("/manifest/");
    return;
  }

  const root = document.querySelector<HTMLElement>("[data-stack-root]");
  if (!root) return;

  const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-layer]"));
  if (layers.length === 0) return;

  const layerIndex = new Map(layers.map((el, i) => [el.dataset.layer ?? "", i]));
  const railLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>("[data-nav-layer]"));
  const readout = root.querySelector<HTMLElement>("[data-depth-readout]");
  let suppressUrl = false;
  let settling = false;

  const applyRoot = () => {
    const s = getState();
    root.dataset.mode = s.mode;
    document.documentElement.dataset.mode = s.mode;
    root.dataset.quality = s.quality;
    root.classList.toggle("is-reduced", s.reducedMotion);
    root.classList.toggle("is-low-power", s.quality === "performance");
  };

  const updateDepth = () => {
    const s = getState();
    const active = layerIndex.get(s.activeLayer) ?? 0;
    const flat = s.reducedMotion || s.quality === "performance";
    for (let i = 0; i < layers.length; i += 1) {
      const dp = flat ? 0 : Math.min(MAX_DP, Math.abs(i - active));
      layers[i].style.setProperty("--dp", String(dp));
    }
    root.style.setProperty("--trace-progress", String(active / Math.max(1, layers.length - 1)));
  };

  const updateNav = () => {
    const active = getState().activeLayer;
    for (const link of railLinks) {
      const isActive = link.dataset.navLayer === active;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    }
    if (readout) {
      const link = railLinks.find((l) => l.dataset.navLayer === active);
      const idx = layerIndex.get(active) ?? 0;
      readout.textContent = `L${idx} · ${(link?.dataset.name ?? active).toUpperCase()}`;
    }
  };

  // --- URL sync (§16): scroll replaces, explicit jumps push.
  function syncUrl(historyMode: "replace" | "push") {
    const s = getState();
    const url = new URL(location.href);
    if (s.activeLayer && s.activeLayer !== "edge") url.searchParams.set("layer", s.activeLayer);
    else url.searchParams.delete("layer");
    if (s.mode === "debug") url.searchParams.set("mode", "debug");
    else url.searchParams.delete("mode");
    const href = `${url.pathname}${url.search}${url.hash}`;
    if (historyMode === "push") history.pushState({ layer: s.activeLayer }, "", href);
    else history.replaceState({ layer: s.activeLayer }, "", href);
  }

  // --- scroll spy: the section crossing the viewport centre wins
  const observer = new IntersectionObserver(
    (entries) => {
      if (settling) return;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = (entry.target as HTMLElement).dataset.layer;
        if (id && id !== getState().activeLayer) {
          setState({ activeLayer: id });
          if (!suppressUrl) syncUrl("replace");
        }
      }
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
  );
  layers.forEach((el) => observer.observe(el));

  const jump = (id: string, push = true, instant = false) => {
    const el = layers.find((l) => l.dataset.layer === id);
    if (!el) return;
    el.scrollIntoView({
      behavior: instant || getState().reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    setState({ activeLayer: id });
    if (push) {
      syncUrl("push");
      playSound("open");
      track("depth_travel_used", { layer: id });
    }
  };

  window.addEventListener("popstate", () => {
    const p = new URLSearchParams(location.search);
    const id = p.get("layer") ?? "edge";
    const mode = p.get("mode") === "debug" ? "debug" : "runtime";
    suppressUrl = true;
    if (mode !== getState().mode) setState({ mode });
    jump(id, false);
    suppressUrl = false;
  });

  root.addEventListener("click", (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-jump]");
    if (!target) return;
    event.preventDefault();
    const id = target.dataset.jump;
    if (id) jump(id);
  });

  root.addEventListener("click", (event) => {
    const toggle = (event.target as HTMLElement).closest<HTMLElement>("[data-mode-toggle]");
    if (!toggle) return;
    const next: Mode = getState().mode === "runtime" ? "debug" : "runtime";
    setState({ mode: next });
    syncUrl("push");
    playSound("mode");
    track("mode_switch", { mode: next });
  });

  root.addEventListener("click", (event) => {
    const toggle = (event.target as HTMLElement).closest<HTMLElement>("[data-sound-toggle]");
    if (!toggle) return;
    const next = !getState().sound;
    setState({ sound: next });
    if (next) playSound("toggle");
  });

  const setMap = (open: boolean) => {
    setState({ systemMapOpen: open });
    if (open) track("system_map_open");
  };
  root.addEventListener("click", (event) => {
    const el = event.target as HTMLElement;
    if (el.closest("[data-map-toggle]")) setMap(!getState().systemMapOpen);
    else if (el.closest("[data-map-close]") || el.closest("[data-map-backdrop]")) setMap(false);
    else if (el.closest("[data-map-jump]")) setMap(false);
  });

  window.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const tag = (event.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (event.key === "m" || event.key === "M") {
      setMap(!getState().systemMapOpen);
    } else if (event.key === "Escape" && getState().systemMapOpen) {
      setMap(false);
    }
  });

  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", (e) => setReducedMotion(e.matches));

  subscribe(applyRoot);
  subscribe(updateNav);
  subscribe(updateDepth);
  applyRoot();
  updateNav();
  updateDepth();

  // Deep links win over the initial scroll position (§16).
  const initialLayer = new URLSearchParams(location.search).get("layer");
  if (initialLayer && initialLayer !== "edge") {
    settling = true;
    suppressUrl = true;
    requestAnimationFrame(() => jump(initialLayer, false, true));
    window.setTimeout(() => {
      settling = false;
      suppressUrl = false;
      syncUrl("replace");
    }, 700);
  }
}
