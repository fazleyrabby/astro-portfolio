export type LayerId =
  | "edge"
  | "api"
  | "app"
  | "jobs"
  | "data"
  | "infra"
  | "observability"
  | "manifest";

export type LayerKind = "layer" | "rail";

export type Layer = {
  id: LayerId;
  index: number;
  depth: number;
  kind: LayerKind;
  name: string;
  purpose: string;
  accent?: string;
  serviceIds: string[];
};

export const layers: Layer[] = [
  {
    id: "edge",
    index: 0,
    depth: 0,
    kind: "layer",
    name: "Edge",
    purpose: "Positioning, availability, and the way in.",
    accent: "accent",
    serviceIds: [],
  },
  {
    id: "api",
    index: 1,
    depth: 1,
    kind: "layer",
    name: "Interface",
    purpose: "Capabilities and services offered.",
    accent: "signal",
    serviceIds: [],
  },
  {
    id: "app",
    index: 2,
    depth: 2,
    kind: "layer",
    name: "Application",
    purpose: "Production systems I build and own.",
    accent: "accent",
    serviceIds: [
      "electronic-first",
      "acme-switchgear",
      "edubase",
      "litepos",
      "signalstack",
      "oblok",
      "hujjah",
      "larabrix",
      "routine-management-system",
      "lenden",
      "timelock",
      "e-bank",
    ],
  },
  {
    id: "jobs",
    index: 3,
    depth: 3,
    kind: "layer",
    name: "Jobs & Queue",
    purpose: "Experiments, creative work, and generative exhibits.",
    accent: "lab",
    serviceIds: [
      "claimyourspot",
      "8bit-os",
      "ascii-shooter",
      "math-art",
      "swarmguard",
      "prompts-library",
      "mealhq",
      "dailylog",
    ],
  },
  {
    id: "data",
    index: 4,
    depth: 4,
    kind: "layer",
    name: "Data & Archive",
    purpose: "Writing, the memoir, and the workbench.",
    accent: "signal",
    serviceIds: [],
  },
  {
    id: "infra",
    index: 5,
    depth: 5,
    kind: "layer",
    name: "Infrastructure",
    purpose: "Experience, education, and the foundation.",
    accent: "accent",
    serviceIds: [],
  },
  {
    id: "observability",
    index: 6,
    depth: 6,
    kind: "rail",
    name: "Observability",
    purpose: "Contact and status.",
    accent: "ok",
    serviceIds: [],
  },
  {
    id: "manifest",
    index: 7,
    depth: 7,
    kind: "rail",
    name: "Manifest",
    purpose: "A flat, complete index of everything.",
    accent: "signal",
    serviceIds: [],
  },
];

export const layerById = Object.fromEntries(
  layers.map((layer) => [layer.id, layer]),
) as Record<LayerId, Layer>;

export const stackLayers = layers.filter((layer) => layer.kind === "layer");

export const railLayers = layers.filter((layer) => layer.kind === "rail");

export function isLayerId(value: string): value is LayerId {
  return value in layerById;
}

export function getLayer(id: string): Layer | undefined {
  return isLayerId(id) ? layerById[id] : undefined;
}
