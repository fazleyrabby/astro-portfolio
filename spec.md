# SPEC.md — "THE STACK"

**A 2.5D layered-systems portfolio for Md. Fazley Rabbi.**

Status: **Design specification / PRD — approved for implementation**
Owner: Md. Fazley Rabbi
Target builder: implementation agent
Repository: **existing `astro-portfolio` monorepo, `apps/web`, on a long-lived branch** (see §26)
Document version: 2.1 (2026-09, direction revised from "The Deck"; adds repository workflow + legacy migration caveats)
Environment date at authoring: September 2026

---

## 0. Read Me First (For The Implementation Agent)

This document is the **single source of truth**. If this document and any other artifact disagree, this document wins.

Non-negotiables:

1. **Do not invent content.** Every person, project, metric, URL, employer, date, and technology in this portfolio must come from the **Content Inventory (Appendix A)**, which is drawn **exclusively from the existing `astro-portfolio`**. Anything absent must be emitted at build time as a visible `[CONTENT REQUIRED]` placeholder. Never fabricate a project, a client, a metric, a testimonial, or an achievement.
2. **Do not build a generic developer template.** No logo walls, no floating glass cards on gradient meshes, no "Building the future" copy, no decorative 3D, no themed admin dashboard cosplay.
3. **Depth, not a diorama.** The experience is a **2.5D layered-systems interface** built with **DOM + CSS 3D depth + SVG schematics + Canvas accents**. It is *not* a 3D world and *not* a Three.js showcase. **WebGL is not required anywhere.** At most one optional, flag-gated, lazy exhibit is permitted (default **off**); nothing may depend on it.
4. **The site must work as a normal, semantic website if every effect fails.** Content lives in the DOM. Canvas layers are decorative and `aria-hidden`. There is always a readable "MANIFEST" view.
5. **Performance and accessibility are features, not passes.** Budgets in §19/§20 are acceptance criteria, not aspirations.
6. **Build inside the existing repository on a branch.** The new experience is developed in the existing **`astro-portfolio` monorepo (in `apps/web`)** on a long-lived branch (recommended: `rebuild/stack`) — **not** in a separate repo and **not** on `main`. `main` stays live the entire time. Vercel preview deployments from the branch are the live-test environment. At cutover, swap the homepage and merge. See §26 and Appendix C.
7. **Build fresh, then swap — do not re-skin legacy.** Author the new stack, layouts, tokens, and routes under new paths. Do **not** mutate the old `apps/web` components in place; swapping the page at cutover is how this avoids stalling. Remove dead legacy components only at cutover (Appendix C).

**Why this direction (one paragraph).** The author is a backend/systems engineer, not a 3D artist. A spatial world (the earlier "The Deck" concept) would compete in a category he does not own and misrepresent his strengths. Instead, the portfolio is modeled as **a running system viewed as a stack of layers** — a metaphor native to his actual work (Laravel apps, APIs, queues, databases, Redis, Docker, observability, infra). The interaction is spatial and "3D-inspired" through **depth, layering, parallax, and perspective**, but the subject is systems, not scenery. The site proves systems thinking by *being* a system.

---

## 1. Product Vision

**Vision.** The portfolio is presented as **a running software system, drawn as a cross-section**: a vertical stack of layers from the Edge (where a visitor enters) down to Infrastructure. Each portfolio section is a layer; each project is a **service** running in a layer. Navigating the site is *traversing the stack* — descending from the surface into the foundation and back. The experience demonstrates, rather than claims, that the author thinks in systems.

**One-sentence pitch.** *"Descend the stack. Inspect the services. See how I build."*

**Positioning statement (verbatim, from the existing site):**
> Designing scalable backend systems, payment infrastructure, and APIs for products that serve real users.

**Secondary line (verbatim, from the existing site):**
> Building scalable systems, not just interfaces.

**What "done" feels like.** A visitor lands on the Edge layer, immediately reads name, role, availability, and two CTAs; scrolling (or the layer rail) moves them down through Interface → Application → Jobs → Data → Infrastructure, with real content at every level. A CTO sees production systems with ownership and live URLs; a recruiter reaches contact and résumé in one action; a creative-dev peer sees the Lab and the craft. Nothing blocks, nothing is decorative-only, and every fact is real. On mobile it feels intentional, not shrunken.

**Strategic tension to resolve.** The site must read as (a) a **credible backend engineer** to a CTO/recruiter and (b) a **systems-minded creative technologist** to a design-engineering audience. The stack metaphor is the creative layer; the case-study pages and the MANIFEST are the credibility layer. Both draw from one content model.

---

## 2. Design Principles

Derived from the author's own projects (see §5). Each principle implies concrete rules.

1. **Systems is the identity, not scenery.** The metaphor must be native to the author's actual work. → Layers, services, traces, queues, a manifest — not harbors, islands, or fantasy.
2. **Constraint keeps it honest.** One committed visual system beats a pile of effects. → One palette, one easing token, one shadow scale, one depth ladder. No one-off styles.
3. **One dataset, multiple lenses.** Content is data; presentation is a lens. → The same projects power the stack, the case-study pages, and the MANIFEST/SEO pages.
4. **Depth without deception.** Spatial feel is created with layering, parallax, scale, blur, and perspective — not by pretending to be 3D art. → Never compete with 3D artists on their turf.
5. **Motion has a job.** Animate to orient, focus, confirm, or add material life — never to decorate. → Every animation in §11 has a stated purpose; cut anything without one.
6. **Data-driven mood.** Light/dark is a *runtime state*, not a gimmick. → Mode swaps a single token set and cross-fades all layers (modeled on Yorimichi's day/night blend and TrendTimeline's era theming — inspiration only).
7. **Procedural over heavyweight.** Synthesized audio, SVG schematics, Canvas primitives, baked visuals. → Zero audio files, minimal image weight, no animation framework beyond GSAP.
8. **Bake heavy, render cheap.** Anything expensive is computed once (poster, sigil, gradient, noise) then transformed. → No per-frame allocation; no live 3D on the critical path.
9. **Resilience is UX.** Offline, no-WebGL, old browsers, reduced motion, and no-JS are first-class states. → Every failure has a designed fallback (§25).
10. **The interface is the résumé.** Navigation, state, and the content engine themselves demonstrate engineering maturity. → Keyboard, command palette, deep links, persistence, a real data model.
11. **Readability wins.** Depth must never cost legibility. → Contrast ratios, max line lengths, generous type, and an instant flat "MANIFEST."

---

## 3. Target Audience

| Priority | Audience | What they need in 30–60s | What must be obvious |
|---|---|---|---|
| P0 | Engineering leads / CTOs / senior engineers (hiring) | Evidence of production depth, architecture, and judgment | Flagship production systems, role/ownership, stack, live URLs, résumé |
| P0 | Recruiters (technical and semi-technical) | Role, seniority, location/remote, contact, résumé download | Name, "Backend Engineer (Laravel)", availability, one-click CV + email |
| P1 | Freelance / consulting clients | Proof of delivery, reliability, payments/API expertise, how to start | "What I build", shipped products, "Start a conversation" |
| P1 | Creative-dev / design community | Interaction craft, originality, technical range | The stack itself, the Jobs/Lab experiments, inventive details |
| P2 | Peer engineers / prospective collaborators | Technical curiosity, writing, open-source | Writing, experiments, GitHub |

**Primary conversion action:** the primary action is **"Contact"** (start a conversation), with **Résumé** as the strong secondary. Rationale: for a mid/senior backend role, an initiated conversation is higher value than a file download; the CV should be one keystroke away regardless.

---

## 4. Portfolio Goals

**Must communicate (in priority order):**

1. I am a **backend/software engineer** (Laravel/PHP core) who builds **real production systems** — not only visual demos.
2. I have **5+ years** of production experience and up-to-date, current work.
3. I work across **backend, databases, infrastructure, APIs, payments, automation, and AI-assisted development**.
4. I have **strong creative range** — games, generative art, real-time systems, retro interfaces — and I build them myself, end to end.
5. The portfolio **is itself one of those projects**: considered, engineered, and maintained.
6. I am **available** and **easy to contact**.

**Must NOT communicate:** that I am a frontend designer or 3D artist first; that I only do demo work; that the site is a template; that I collect trendy effects.

**Success signals (qualitative):**
- A senior engineer says "this person ships."
- A visitor can name one flagship project and one surprising experiment after a 60-second visit.
- Recruiters reach contact/résumé without having to learn the stack metaphor.
- The site is memorable enough to be described by someone else in one sentence.

---

## 5. Reference & Concept Analysis

### 5.1 Analysis of the author's own projects (primary references — INSPIRATION ONLY)

These projects are the strongest signal for the author's taste and skill. They are **inspiration only**: they define the visual language, interaction grammar, and technical principles of The Stack. They are **NOT a content source**: no project, stack, metric, or claim from this table may enter the portfolio unless it also exists in the existing `astro-portfolio` content (Appendix A). We extract **principles**, never copy assets or layouts.

**Content provenance rule (binding):** *All portfolio content comes exclusively from the existing `astro-portfolio`.* The provided project directories are design/engineering inspiration only. Do not lift facts, stacks, or URLs from them into the portfolio.

| Project | Medium / tech | Signature idea | Reusable principle for The Stack |
|---|---|---|---|
| **SPOT** (ClaimYourSpot) | Astro + Canvas 2D grid + Canvas 2D city + Three.js voxel; Node/Express + SSE; Postgres/Supabase | One dataset rendered through **three lenses**; permanent addressable coordinates; day/night as a token system; physical shadows + one glass surface; `⌘K` search; deep links | **Multiple lenses over one dataset**; permanent deep-link per artifact; mode tokens; HUD de-clutter on small screens; load into a status pill, not a splash |
| **Swarmguard** | TypeScript + PixiJS + Vite; WebAudio; Vitest | Clean **simulation/view separation**; baked textures + object pools; distance-driven gait; trauma² shake; data-driven waves/modes | Data-driven content/modes; **bake-then-transform** performance mindset; one input resolver; explicit layer ordering |
| **Yorimichi** | Three.js + Vite; GLSL water/sky; procedural GLBs | Fixed orthographic camera; **art-bible-first** token config; **day/night cross-fade across 9 subsystems**; atmosphere over polycount; QualityGovernor | One token config driving all states; graceful degradation + adaptive quality; ambience from a few cheap systems |
| **SanctuaryMainframe** | Pixi v8 2.5D + Three.js **baked to sprites**; fixed-step sim; deterministic advisor | **3D-authored → 2D-rendered** baking; depth-sorted 2.5D; explainable advisor with confidence + "Ask Why"; semantic accents | Bake heavy art once; **2.5D depth sorting** instead of live 3D; an explainable, data-driven "advisor" pattern; reserved signature accent |
| **8bitOS** | React + Tailwind; **DOM/CSS/SVG only**; WebAudio; hash deep links | The **interface IS the product**: window manager, app registry, power state machine, command palette, terminal; token themes; CSS/SVG dither | **Guided state machine as onboarding**; central manager + small primitives; data-driven registry; token theming; multiple navigation affordances over one model |
| **ascii-shooter** | **Zero-dependency** software 3D renderer → ASCII grid on Canvas 2D; WebAudio | Constraint as identity (ASCII-only); semantic color + glyph ramps; **selective glow whitelist**; live attract-mode | **Constraint defines the aesthetic**; reserve emphasis for what matters; live/auto demo as idle state; HUD in the content's language |
| **retro-console** (KROMA 01) | Vanilla HTML/CSS/JS; 2D Canvas 640×480 hardware sim | **Product-as-narrative** editorial tour; hotspot↔detail bidirectional linking; 3-role typography; tactile hard-offset shadows; opt-in CRT mode | **Annotated product-tour structure**; 3-role type system; tactile micro-interactions; effects opt-in and reduced-motion-safe |
| **formula** (Math Art) | Astro 5 + Canvas 2D + WebGL2 + WebGPU/WGSL + p5; KaTeX | Multi-engine gallery; **two-tier visibility lifecycle** (IntersectionObserver + Page Visibility + reduced-motion → 0% idle CPU); visual state ⇄ code; export PNG/WebM | Engine abstraction; **visibility lifecycle** for ambient canvases; progressive enhancement; exportable artifacts |
| **TrendTimeline** (The Web Was Here) | Astro; era theming via one `data-era` attribute; Three.js raymarch; WebAudio; SVG | **Medium is the message** — each era re-skins the whole site from one token file; data/presentation separation; procedural dial-up audio; CRT sim | Theme-per-region possibility; strict data schema; framing content inside a device; synthesized audio identity |
| **SignalStack** | NestJS + Postgres + Redis + Next.js + Tailwind v4 | Command-center density; **"less noise, more signal"**; severity/score as single source of truth; theme via cookie (no flash); operational polish | **Signal-to-noise curation**; progressive disclosure of dense info; persisted preferences; operational polish as craft — and the closest aesthetic precedent for The Stack |
| **Current portfolio** (`astro-portfolio`) | Astro 5 + Tailwind + GSAP + Lenis + Three | Editorial "calm premium" system; WebGL dither hero; ASCII/binary portrait toggle; scroll-driven project showcase; keycap buttons; i18n EN/BN | Preserve: editorial calm, EN/BN i18n, the memoir "Journey", the honest writing archive, the mechanical-keycap button feel, and the credibility density |

**Cross-project fingerprint (the author's operating system):**
tokenized design systems · no animation-library reliance · procedural/vector-first assets · synthesized audio · data-driven content registries · art-direction/spec documents as executable constraints · graceful degradation and adaptive quality · simulations decoupled from rendering · one strong accent reserved for meaning.

### 5.2 External directional references (pattern-level only)

- **Editorial credibility:** Linear, Stripe, Vercel — restraint, strong type, real metrics.
- **Systems/blueprint aesthetics:** structural engineering drawings, PCB/EDA schematics, network topology diagrams, `kubectl`/observability dashboards.
- **Developer-tool craft:** Teenage Engineering, classic OS/BIOS ceremonies, observability UIs (Grafana/Prometheus) — diegetic chrome.
- **Depth interfaces:** layered parallax/scroll depth on editorial sites — spatial without literal 3D.
These are references for **quality bar and interaction grammar**, not for visual copying.

### 5.3 Concept candidates evaluated

| # | Concept | Why it fits | Why it's risky | Verdict |
|---|---|---|---|---|
| A | **Full 3D world** (Three.js, fly camera) | Matches the literal "3D" ask; impressive | Heavy on mobile/low-end; hurts LCP/SEO; hard for a11y; long build; author is not a 3D artist | **Rejected** — misrepresents the author; competes with 3D artists |
| B | **The Stack** — 2.5D layered-systems interface (DOM + CSS depth + SVG + Canvas) | Native to the author's domain; spatial and memorable; cheap to render; responsive; content stays in DOM; no WebGL | Requires discipline to keep depth readable; must avoid "dashboard cosplay" | **SELECTED** |
| C | Personal Operating System (desktop/apps) | Proven (8bitOS); fun | Already done by the author; risks re-skin; weak for fast evidence | Rejected (used only as *navigation vocabulary*) |
| D | Digital museum / gallery | Fits projects | Passive; weak for résumé/recruiter path; overused | Rejected |
| E | Floating project cards / parallax depth | Easy, fast | Generic AI-template smell; forgettable | Rejected |
| F | Canvas-based 2D world | Strong heritage (SPOT) | No depth without more work; still needs DOM overlay | Folded into B |
| G | WebGL/WebGPU scene | Novelty | GPU variance, battery, a11y, complexity | **Rejected as default**; optional flag only |
| H | Interactive laboratory | Fits experiments | Undersells production work; niche | Folded into B as the "Jobs & Queue" layer |

### 5.4 Selected direction — decision record

**Chosen: B — "The Stack": the portfolio as a running system drawn as a vertical stack of layers, built as a DOM + CSS-3D-depth + SVG + Canvas hybrid. No WebGL required.**

**Why not a 3D world (the author's own framing):**
A full 3D world is the correct move for a **3D artist / design engineer** (e.g. Bruno Simon) whose craft *is* the medium. The author is a **backend/systems engineer**; his craft is architecture, data flow, reliability, and scale. A 3D world would (a) compete in a category he does not own, (b) spend months on asset/projection work instead of showcasing his real strengths, and (c) force performance and accessibility compromises that undercut credibility with a hiring audience.

1. **The metaphor should be native to the domain.** Systems have layers: edge/CDN → API → application → jobs/queues → data → infrastructure, plus cross-cutting observability. A stack is legible to the exact audience he wants and immediately signals how he thinks.
2. **"3D-inspired" ≠ "3D."** Depth, parallax, perspective, layering, scale, and blur produce a spatial feel at a fraction of the cost — and can be turned off without losing content.
3. **Credibility beats spectacle for a hiring audience.** A CTO should think "this person designs systems," not "this person can render a tree."
4. **Performance, mobile, SEO, a11y.** DOM-first depth is compositor-friendly, crawlable, keyboard-operable, and screen-reader-readable. A WebGL canvas is a black box.
5. **Maintainability.** CSS depth + SVG schematics are inspectable and greppable; no 3D pipeline, model optimization, or LOD tooling.
6. **Real 3D is optional at most.** If the author ever wants a set piece (e.g. SPOT's voxel view), it is a single flag-gated, user-initiated, lazy enhancement with a poster fallback — default **off**.

**So:** a layered depth interface as the spine; SVG schematics and Canvas accents for system texture; no WebGL on the critical path (default none at all); everything degrades to a flat, fast, accessible document.

### 5.5 Direction ↔ inspirations alignment

| Inspiration | What it contributes to The Stack | Alignment | Where it shows up |
|---|---|---|---|
| **SignalStack** | Command-center density; "less noise, more signal"; telemetry/monospace UI; operational polish | **Strong (core)** | Layer panels, HUD/readouts, curation (`§6.4`), loading/error polish (`§25`) |
| **SPOT** | Multiple lenses over one dataset; deep links; day/night tokens; minimap-style orientation | **Strong (core)** | MANIFEST lens, `?layer=` deep links, RUNTIME/DEBUG tokens (`§10.2`), layer rail |
| **SanctuaryMainframe** | 2.5D depth-sorting; bake-3D→2D art; semantic accents; explainable data | **Strong** | Depth ladder (`§10.5`), sigil/posters (`§18`), semantic color (`§10.3`) |
| **Yorimichi** | One art-bible token config; day/night cross-fade; atmosphere > polycount; QualityGovernor | **Strong** | Tokens (`§10`), mode cross-fade, `§12.6` |
| **8bitOS** | Command palette; registry; boot/ceremony vocabulary | **Strong** | `⌘K` palette (`§9.1`), layer registry (`§12.4`), status pill |
| **retro-console** | Annotated product tour; 3-role type; tactile keycaps; opt-in effects | **Strong** | Case-study structure (`§8.3`), typography (`§10.4`), buttons (`§9.4`) |
| **TrendTimeline** | One-attribute re-skin; data/presentation split; procedural audio; CRT layer | **Strong** | Runtime-mode token system, content model (`§14`), synthesized audio, ASCII egg |
| **Swarmguard** | 60fps discipline; baked/pooled assets; layer contract; data-driven modes | **Medium-strong** | Bake-then-transform (`§18`), layer ordering (`§12.3`), motion (`§11`) |
| **ascii-shooter** | Constraint identity; selective emphasis; ASCII mode | **Medium (egg)** | Optional ASCII/CRT overlay (`§9.5`) |
| **formula** | Generative exhibits; visibility lifecycle; exportable artifacts | **Medium** | Exhibits (`§12.5`), two-tier visibility (`§19`) |
| **Existing `astro-portfolio`** | Editorial calm; EN/BN i18n; the memoir; honest writing archive; keycap feel; credibility density | **Strong (foundation + content)** | Everything: it is the content source (Appendix A) and the baseline to elevate |

**Verdict.** The Stack maps directly onto the author's true domain (systems) and the strongest interaction patterns from his projects (SignalStack's command-center, SPOT's lenses, 8bitOS's registry, SanctuaryMainframe's 2.5D depth), while deliberately *not* chasing the 3D-artist category. It is spatial and interactive without pretending to be a game or a 3D showcase.

---

## 6. Information Architecture

### 6.1 Layers (the stack)

The stack is a vertical system. Each **layer** is a portfolio section; each **service/module** is a project. Two **cross-cutting rails** (Observability, Manifest) are reachable from anywhere. Depth index increases as you descend.

| ID | Layer | Depth | Portfolio function | Primary content | Default priority |
|---|---|---|---|---|---|
| `edge` | **L0 · Edge** | 0 | Hero / positioning | Name, role, tagline, availability, primary CTAs, system status | P0 |
| `api` | **L1 · Interface** | 1 | Capabilities / services | Capability groups, services offered, stack | P1 |
| `app` | **L2 · Application** | 2 | Production / professional work | Flagship production projects | P0 |
| `jobs` | **L3 · Jobs & Queue** | 3 | Experiments / creative work | Experimental projects + generative exhibits | P0 |
| `data` | **L4 · Data & Archive** | 4 | Writing, memoir, workbench | 44 notes, the 6-chapter Journey, Uses/homelab | P1 |
| `infra` | **L5 · Infrastructure** | 5 | Experience / foundation | Employment timeline, education, résumé | P0 |
| `observability` | **⊕ Observability** (rail) | — | Contact | Email, form, socials, résumé CTA, availability | P0 |
| `manifest` | **⊕ Manifest** (rail) | — | Flat index / fallback | Full semantic index of everything + a11y path | P0 |

The Journey is both a Data-layer entry point and its own deep page (recommended: keep it as its own page to avoid overloading the stack).

### 6.2 Top-level routes

```
/                     The Stack (layered interface) — default
/work                 Application + Jobs index (flat grid; SSG)
/work/[slug]          Project case study (SSG, one per project)
/notes                Writing index (SSG)
/notes/[slug]         Article (SSG)
/about                About / profile (flat page; SSG)
/journey              Memoir (SSG)
/uses                 Workbench / homelab (SSG)
/resume               Résumé (SSG) + PDF links
/manifest             Flat, fully semantic index of all content (SSG)
/bn/*                 Bengali-mirrored routes (i18n) — for a subset initially
/404                  Designed not-found (a dead node / unreachable service)
```

### 6.3 Navigation model (three parallel affordances over one model)

1. **Depth (primary, expressive):** scroll descends the stack (and ascends on reverse scroll); the active layer focuses; clicking a service focuses it. The vertical position maps to depth index.
2. **Layer rail (orientation, always available):** a persistent vertical rail on the left edge (desktop) listing all layers + rails with the current depth highlighted; clicking jumps to a layer. On mobile it becomes a horizontal, snap-scrolling **layer strip**. A `M` key / button opens a full **system map** (the whole stack as a labeled schematic) to jump anywhere.
3. **Command palette (power path):** `⌘K` / `Ctrl K` opens a fuzzy list of every layer, project, note, and action (résumé, email, mode switch, manifest). Keyboard-first.
4. **Manifest (accessibility + speed):** a persistent "MANIFEST" link and `L` shortcut switches to a plain, semantic document with all content. Guaranteed path for screen readers, crawlers, and low-power devices.

**Top bar (minimal, constant):** brand `Fazley Rabbi.` · current layer indicator · mode switch (`RUNTIME / DEBUG`) · sound toggle · MANIFEST · `⌘K` · contrast. On mobile this collapses to brand + layer strip + a menu sheet.

### 6.4 Content hierarchy (what gets prominence)

- **Edge (L0):** name, role, one-line positioning, availability, system status, two CTAs (`Contact`, `View Résumé`). The stack diagram itself is the hero art.
- **Immediately after (one layer down):** L2 Application surfaces the 3–4 flagship production systems (Electronic First, ACME Switchgear, EduBase, and one of LitePOS/Oblok/SignalStack).
- **Then:** L1 Interface (capabilities), L3 Jobs (experiments), L4 Data (writing/journey/uses), L5 Infrastructure (experience/education/résumé).
- **De-emphasized:** the full 25-item project scope lists, the 44-post archive (summarized, paged), résumé detail (on its page).
- **Always reachable:** Observability (contact) and Manifest.

---

## 7. User Journeys

**J1 — The 45-second recruiter.**
Lands on `/`. Reads the Edge layer (name, "Backend Engineer (Laravel)", available, location) in ~4s. Sees `Résumé` and `Contact` in the top bar. Clicks `Résumé`. → *Requirement: résumé one click from every state; hero text legible before any canvas paints.*

**J2 — The senior engineer evaluating depth.**
Lands, descends to L2 Application, opens Electronic First. Reads problem → approach → impact → highlights → stack → live URL. Opens the architecture slot. → *Requirement: case studies lead with problem and ownership; architecture/highlights scannable; live + repo links prominent.*

**J3 — The creative-dev explorer.**
Ignores CTAs, descends further to L3 Jobs, notices DEBUG mode recolors the whole stack, opens a generative exhibit, finds the ASCII easter egg. → *Requirement: mode switch + at least one delightful discovery path; nothing blocks exploration.*

**J4 — The mobile visitor.**
Arrives on a phone. Sees an Edge hero card, a horizontal **layer strip**, and a status pill. Taps a layer/project → full-height **bottom sheet** with the same content. No pinch-zoom required, no hover-only affordances, no horizontal scroll traps. → *Requirement: intentional mobile composition (§23), not a shrunk desktop.*

**J5 — The keyboard / assistive-tech user.**
Tabs into "Skip to content." Uses the command palette or MANIFEST. Reads every project's full text with a screen reader; all interactive nodes have roles/labels; focus always visible; reduced motion honored. → *Requirement: full parity in the MANIFEST view.*

**J6 — The return visitor.**
Previously selected mode/preferences persist; the stack opens at the last layer or a deep-linked layer; sound preference respected. → *Requirement: persist mode, view, sound, last layer in `localStorage`; deep links win.*

---

## 8. Page & Section Specifications

### 8.1 `/` — The Stack (layered interface)

- **DOM structure (semantic, crawlable):** `<main>` contains one `<section>` per layer (and the two rails) in document order, each with a real `<h2>`, real copy, and real links. Canvas/SVG schematic layers are `aria-hidden="true"`. Visual depth is applied with CSS transforms; semantic order stays linear (Edge → Interface → Application → Jobs → Data → Infrastructure → Observability → Manifest).
- **Stack rendering:** a perspective container renders layer planes receding in Z (§12). Content panels sit on their layer plane. The depth transform is applied to the stack; layers become fully legible when active.
- **Layer behavior:** each layer has (a) a compact **header strip** always visible when in view (id, name, one-line purpose, status), and (b) an **active panel** that becomes fully legible when focused. Inactive panels are dimmed and `inert`/`aria-hidden` until focused (focus driven by scroll, click, keyboard, or deep link).
- **Scroll mapping:** vertical scroll advances **depth**. Depth travel is *not* hijacked for more than one pinned region at a time; `prefers-reduced-motion` disables continuous travel and switches layers discretely (§11, §20).
- **HUD:** layer rail (left desktop, bottom strip mobile), current-depth readout, mode, "system status" (available), and a `⌘K` hint.
- **Depth grammar (visual):** deeper layers are subtly smaller, lower-contrast, and further blurred until active; a thin **trace line** (SVG) runs vertically through the stack and animates a "packet" toward the active layer. This is the single signature motion.
- **Extras:** ASCII/CRT mode toggle (easter egg, `A`), synthesized UI audio (opt-in), a system map overlay (`M`).

### 8.2 `/work` — Application & Jobs index

- Flat, fast, SSG grid. Grouped into **Application (production)** and **Jobs (experiments)**.
- Filters: category (production / experimental), tech tag, search. Sort: featured, recency.
- Card = generated project sigil, title, one-line description, status, stack chips, live/repo.
- This route is the SEO-rich list and the fallback for no-JS/old devices.

### 8.3 `/work/[slug]` — Project case study

Canonical, readable, server-rendered. Sections:
1. Header: title, type, status, period, role, live/repo/`View in Stack`.
2. One-line hook (`description`).
3. **The Problem** (`problem`).
4. **The Approach** (`solution`).
5. **Impact** (`impact`) — must render (the current site drops this due to a schema bug; the new schema fixes it).
6. **Highlights** (`highlights[]`) — the engineering decisions.
7. **Scope of Work** (`scope[]`) — collapsible, for depth without clutter.
8. **Stack** (`tech[]`).
9. Architecture slot → `[CONTENT REQUIRED]` until supplied (render as a labeled schematic frame).
10. Media: screenshots/video → `[CONTENT REQUIRED]` per project; until then show the generated sigil/poster.
11. Lessons learned → `[CONTENT REQUIRED]` per project (optional field).
12. Prev/next project + back to `/work` + `Open in Stack`.

### 8.4 `/about` (Profile)

Bio, positioning, current focus, location/availability, socials, a compact Journey teaser, and the memoir link. Portrait asset → `[CONTENT REQUIRED]`.

### 8.5 `/journey` (The Long Way)

Editorial, chapter-based memoir reusing the existing six-chapter structure (2001 → now). Long-form, quiet, generous type, a couple of ambient SVG illustrations. Content source: existing `journey.md` (verbatim; light web editing only with author approval).

### 8.6 `/uses` (Workbench / Infrastructure)

The existing workbench + homelab detail (41+ Docker containers, hardware, terminal, tooling). A credibility asset for peer engineers; keep it factual.

### 8.7 `/resume`

Reuse the existing résumé content, restyled to the new system. Prominent **Download PDF** plus an in-page readable version. Print stylesheet required.

### 8.8 `/notes` & `/notes/[slug]`

Writing index + article. 44 posts (42 EN, 2 BN) from the existing data source. Featured + latest, tags, reading time. Article pages plain, fast, highly legible, with code styling.

### 8.9 `/manifest`

A flat, semantic, fully accessible index of *everything*: identity, all projects with summaries and links, experience, skills, writing, contact, résumé. Intentionally plain and fast. The no-JS/SEO/AT guarantee.

### 8.10 `/404`

Diegetic: "Node unreachable — 404." Returns links to the Edge layer, the Manifest, and search.

---

## 9. Interaction Specifications

Every interaction states **purpose**, **trigger**, **behavior**, and **fallback**.

### 9.1 Navigation & depth

| Interaction | Purpose | Trigger | Behavior | Fallback |
|---|---|---|---|---|
| Depth travel | Orient / descend | Scroll (desktop), layer strip tap (mobile) | Stack depth transform tweens; 700ms, `--ease-expo` | Reduced-motion: discrete layer switch, no tween/pin |
| Jump to layer | Navigate | Layer rail click / `M` system map / `⌘K` | Depth tweens to target layer; URL updates `?layer=` | Manifest anchor |
| System map | Global orientation | `M` / rail button | Overlay schematic of all layers + services; keyboard-navigable | Layer rail always visible |
| Command palette | Power navigation | `⌘K` / `Ctrl K` | Fuzzy list: layers, projects, notes, actions | A `⌘K` button is always visible in the bar |
| Back/forward | Recover | Browser back | Real history entries for layer/mode changes | Always works |

### 9.2 Selection & focus

| Interaction | Purpose | Trigger | Behavior | Fallback |
|---|---|---|---|---|
| Focus layer | Read a section | Scroll settle / rail click / `Enter` on focused node | Layer panel becomes legible; `?layer=` updates; rail marks focus | Manifest anchor |
| Open service | Read evidence | Click a module / project card | Opens `/work/[slug]` *or* an in-stack readout with "Open full case study" | Direct link always present |
| Mode switch | Change runtime state | Toggle chip / `S` | Tokens cross-fade (~600ms); Application/Jobs emphasis swaps; persisted | Applies instantly under reduced motion |
| Close / back | Recover | `Esc`, backdrop click, browser back | Returns to previous layer/scroll | Browser back always works |

### 9.3 Hover & cursor (desktop only, never load-bearing)

- Interactive nodes gain a subtle **trace/node cursor** and a 1–2px lift; a small label appears (`aria-hidden` duplicate of real text). Hover is *never* required to read content.
- Service hover reveals a compact "status strip": title, status, stack.
- No hover effects on touch. All hover affordances have a click/tap equivalent.

### 9.4 Micro-interactions

- Buttons: hard-offset "keycap" press (255–320ms), reusing the author's signature from the current site.
- Copy-to-clipboard on email (with `aria-live` confirmation).
- Sound: opt-in synthesized blips for focus/open/mode (WebAudio; never autoplay; persisted mute).
- Loading: a peripheral status pill ("Establishing connection…") that fades; never a blocking splash.

### 9.5 Easter eggs (optional, non-blocking)

- ASCII/CRT overlay mode (`A`) — a nod to the author's ASCII experiments (inspiration only).
- The vertical trace "packet" speeds up as it approaches the active layer.
- A rare console easter egg (`console.log` greeting + a `sudo` joke — no data).

### 9.6 Explicit anti-patterns (forbidden)

- No scroll-jacking that traps the user for more than one pinned region.
- No cursor that hides the real pointer without a fallback.
- No interaction whose only affordance is hover.
- No modal that traps focus without a close and `Esc`.
- No autoplaying audio or video with sound.
- No motion that cannot be disabled by `prefers-reduced-motion`.
- No "dashboard cosplay": no fake charts whose numbers are decorative, no invented telemetry, no metrics not in Appendix A.

---

## 10. Visual Design System

### 10.1 Art direction

*An engineering cross-section.* The stack is drawn like a technical schematic rendered with real interface craft: thin traces, node markers, labels, depth planes, and a subtle PCB/graph-paper grid. Surfaces are matte; borders are hairlines; controls use **hard offset shadows** (retro-console/keycap discipline); exactly **one** translucent "glass" surface is reserved for transient readouts. One warm accent (amber/orange) means *the author / active*; cyan means *data / interactive*; coral/magenta is *only* experiments. No gradient-mesh backgrounds, no floating glass-card walls, no neon everywhere, no decorative 3D.

### 10.2 Runtime modes (single token system, two states)

- **RUNTIME (default, light):** calm, high-contrast, "production" — optimized for reading evidence. Mirrors the credibility of the existing editorial site.
- **DEBUG (dark):** raw, denser, neon traces — optimized for exploring the build and experiments (Jobs layer emphasis).
Mode swaps **only CSS custom properties** and a few SVG/Canvas stroke tokens; every layer listens to the same tokens. Persist the choice; default to RUNTIME.

### 10.3 Color tokens

Semantic tokens (values are proposals; verify contrast during build). Both modes share names.

| Token | RUNTIME (light) | DEBUG (dark) | Purpose |
|---|---|---|---|
| `--bg` | `#F5F4F1` | `#0A0D12` | Page base |
| `--void` | `#EAE9E4` | `#06080C` | Recessed/background plane |
| `--layer` | `#FFFFFF` | `#121722` | Layer plane surface |
| `--layer-2` | `#F0EFEA` | `#1A2130` | Elevated/alternate surface |
| `--grid` | `rgba(20,23,28,0.06)` | `rgba(255,255,255,0.05)` | Schematic grid lines |
| `--trace` | `rgba(20,23,28,0.16)` | `rgba(120,220,255,0.20)` | Connector traces / active packet |
| `--line` | `rgba(20,23,28,0.12)` | `rgba(255,255,255,0.10)` | Hairline borders |
| `--text-hi` | `#14171C` | `#E8EDF5` | High-emphasis text |
| `--text-mid` | `#4A5260` | `#9AA7B8` | Secondary text |
| `--text-lo` | `#6B7280` | `#6B7A8D` | Muted/meta (must still pass AA on `--bg`) |
| `--accent` | `#C2410C` | `#F5A524` | Primary accent — me/active |
| `--accent-hi` | `#EA580C` | `#FFC24D` | Accent hover |
| `--signal` | `#0E7490` | `#4CC9F0` | Secondary — data/links/interactive |
| `--lab` | `#BE185D` | `#FB7185` | Experiments/Jobs semantic |
| `--ok` | `#047857` | `#34D399` | Success/live status |
| `--warn` | `#B45309` | `#FBBF24` | Warning |
| `--danger` | `#B91C1C` | `#F87171` | Danger/error |
| `--focus` | `#0E7490` | `#FFD166` | Focus ring |

**Rules:** amber = author/active only; cyan = data/interactive; coral = experiments only. No fourth chromatic accent. Status colors are semantic only. Contrast must pass WCAG AA in both modes (§20).

### 10.4 Typography (3 roles)

| Role | Family | Use | Notes |
|---|---|---|---|
| Display | **Space Grotesk** (or Chakra Petch for a more technical feel) | H1/H2, layer names, big numbers | Tight tracking, weights 500–700 |
| Body | **Inter** | Paragraphs, UI copy, nav | 400/500/600 |
| Mono | **IBM Plex Mono** | Metadata, labels, coordinates, stack chips, code, telemetry | Uppercase, wide tracking for labels |

Self-host via `@fontsource`; preload the two critical Latin faces; `font-display: swap`; subset if feasible. Bengali articles use **Hind Siliguri** (per existing i18n) with line-height overrides.

**Scale (fluid, `clamp`):** display XL `clamp(2.5rem, 6vw, 5rem)`, display L `clamp(2rem,4vw,3.25rem)`, H3 `1.5rem`, body L `1.125rem`, body `1rem`, small `0.875rem`, micro/label `0.75rem` (mono, `letter-spacing: .08em`). Reading measure `60–72ch`; UI copy measure `~48ch`.

### 10.5 Space, grid, layout, depth

- Base unit **4px**; spacing scale 4/8/12/16/24/32/48/64/96/128.
- Content max width `1200px`; reading max `680px`; layer rhythm `clamp(80px, 12vh, 160px)`.
- Breakpoints: `sm 480`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`.
- **Depth ladder** (z / parallax / emphasis): `void -5` → `grid -4` → `trace lines -3` → `inactive layers -2..-1` → `active layer 0` → `layer header +1` → `HUD +10` → `readout +20` → `modal +30` → `cursor +40`. Deeper layers scale slightly down and desaturate; parallax factor per depth (e.g. `-0.06`, `-0.12`, `-0.20`).

### 10.6 Surfaces, shadows, borders, radii, icons

- **Two surface families only:** (a) matte panels (`--layer`, 1px hairline, small radius 4–6px) and (b) one glass readout (translucent + `backdrop-filter: blur(12px)`, used sparingly, capable devices only).
- **Shadows:** hard offset for controls (`0 3px 0 rgba(0,0,0,.35)` light / `0 3px 0 #000` dark); one soft elevation for panels (`0 12px 32px -8px rgba(0,0,0,.35)`). No colored glow halos except a single focus/active trace.
- **Radii:** 4 / 6 / 10 / 999. Prefer tight radii; no 24px+ cards.
- **Icons:** custom 1.5px-stroke SVG set (16/20/24) with a small **schematic** vocabulary (node, trace, layer, queue, database, shield, terminal), plus a small pixel/ASCII glyph set for the easter-egg layer. No icon fonts; no emoji as UI.
- **Borders:** hairline by default; 2px accent for focus/active only.
- **Gradients:** only structural (layer depth shading, trace fade), never decorative UI gradients or text gradients.

### 10.7 Background treatment

A persistent schematic environment behind the DOM stack: a faint grid (`--grid`), a few non-interactive trace paths, and a soft vignette. DEBUG adds subtle scanlines. Optional film grain (SVG turbulence, ≤3% opacity). Grain/scanlines toggle off under reduced motion / low-power.

### 10.8 Responsive rules (summary; full in §23)

- Desktop: full stack depth + rail + system map + hover traces.
- Tablet: stack + touch/tap + bottom-sheet readouts; rail compacted; no hover-only.
- Mobile: **portrait composition** — Edge hero card, horizontal layer strip as primary nav, tap → bottom sheet, status pill; no free-look; no continuous depth travel.

---

## 11. Motion System

**One easing token everywhere:** `--ease-expo: cubic-bezier(0.16, 1, 0.3, 1)`. Secondary: `--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)` for color/mode fades.

| Motion | Duration | Easing | Purpose | Reduced-motion behavior |
|---|---|---|---|---|
| Depth travel between layers | 700ms | expo | Spatial continuity | Discrete layer switch |
| Layer focus (panel in) | 320ms | expo | Focus/readability | Instant, opacity only |
| Panel out | 200ms | in-out | Return | Instant |
| Trace packet toward active layer | 900ms, loops subtly | linear/in-out | Orientation / system life | Static trace; no packet |
| Micro hover lift | 150ms | expo | Affordance | None |
| Button press | 120ms down / 180ms up | expo | Tactile confirmation | Instant |
| Mode cross-fade | 600ms | in-out | Runtime-state change | Instant |
| Readout open (sheet/modal) | 280ms | expo | Focus | Instant |
| Status pill fade | 240ms | in-out | Feedback | Instant |
| Background grid drift (very slow) | continuous | sine | Life/texture | Frozen |
| Count-up metrics | 900ms | expo (ease-out cubic) | Emphasis | Final value immediately |
| Staggered list reveal | 60ms steps, ≤480ms total | expo | Reading order | Instant |

**Rules:** animate only `transform`/`opacity` (plus `filter` sparingly). Never animate layout properties. Canvas work pauses when offscreen or `document.hidden` (two-tier lifecycle, per `formula`). No spring/overshoot except optionally a single "packet arrival" ping. Keep simultaneous tweens small (< ~12).

---

## 12. Depth / Layer Architecture

### 12.1 Depth model

- **Not a 3D scene.** Depth is expressed with a **stack of DOM layer planes** inside a CSS perspective container (`perspective: ~1400px`). Each `.layer` is a normal, readable DOM section positioned on its depth plane.
- Each layer receives a depth transform based on its index relative to the active layer: `translateZ(-N*step)` + slight `scale()` + opacity/desaturation, so inactive layers recede and the active layer is crisp and flat-on.
- **Prefer readability over literal 3D:** the active layer should render essentially flat (minimal tilt/blur) so text is pixel-crisp; only inactive layers carry perspective. This is the key rule that prevents the "3D hurts legibility" trap.
- SVG traces connect layer anchors; a single animated "packet" travels along the trace to the active layer (the signature motion).

### 12.2 Depth controller

A single `DepthController` state `{ depth, targetDepth, mode, dragging }` drives the stack transform. It:
- Maps **scroll progress → depth index** through layer anchors (deterministic, clamped).
- Supports **jump-to-layer** (rail, map, palette) with a tween to the target.
- Uses damping (~0.14) and clamps to `[minDepth, maxDepth]`.
- Publishes depth to the rail, HUD, SVG packet, and Canvas accents each frame.
- Under reduced motion: discrete switches only; no continuous travel; no packet.

### 12.3 Stack composition (visual layers)

1. **Environment** (SVG/DOM): schematic grid + vignette; CSS gradient recess. `aria-hidden`.
2. **Traces** (SVG): vertical connectors between layers + animated packet; `aria-hidden`.
3. **Layer planes** (DOM): the readable sections, each on its depth plane.
4. **Layer headers** (DOM): id/name/purpose/status strips.
5. **Readouts** (DOM): focused panels / bottom sheets.
6. **HUD** (DOM): rail, depth readout, mode, status.
7. **Overlays** (DOM): system map, mode, ASCII/CRT, reduced-motion/low-power.
8. **Manifest** (DOM): the flat document (replaces the stack when active).

### 12.4 Layer registry

A data-driven registry in `src/data/layers.ts`:

```
edge(0) → api(1) → app(2) → jobs(3) → data(4) → infra(5)   [+] observability, manifest
```

Each entry: `id`, `name`, `purpose`, `depth`, `contentRef`, `accent?`, `serviceIds[]` (projects shown in that layer). Deep link: `?layer=jobs`. Adding a layer = editing this registry.

### 12.5 Embedded creative exhibits (Canvas/DOM, no WebGL)

- One or two live **generative pieces** (Canvas 2D only, inspired by the author's generative-art experiments) mounted in the Jobs layer as ambient exhibits, using the visibility lifecycle (render only when visible; static frame under reduced motion). Content is the author's; only the *technique* is inspired.
- A small **ASCII strip** as an optional Jobs easter egg.
- These implement a common `Exhibit` interface: `mount(el, {mode, reducedMotion})`, `pause()`, `resume()`, `destroy()`, `poster()`.

### 12.6 Optional WebGL (default: none)

- **No WebGL is required anywhere.** The default build ships zero WebGL.
- At most **one** optional, flag-gated, user-initiated enhancement is permitted (e.g., a 3D view of one project the author chooses). It must: be disabled by default; load only on explicit user action; cap DPR; pause offscreen/hidden; and have a poster fallback. Nothing on the site may depend on it.
- Decision to add such a piece is the author's, made later; it is **not** an acceptance criterion.

### 12.7 Quality governor

A `QualityGovernor` samples frame time and steps among:
- **ULTRA:** full trace animation, grid drift, grain, glass, all depth parallax, exhibits at full rate.
- **BALANCED:** fewer accents, no grain, glass allowed.
- **PERFORMANCE:** static environment, no packet/grid motion, flat panels, discrete depth switches only.
Tiers down automatically on slow frames/touch/low `deviceMemory`/`hardwareConcurrency`, and up with hysteresis. Users may pin a tier via the HUD/`?quality=`.

---

## 13. Component Architecture

Astro-first, mostly vanilla TS for the engine, framework-optional for complex islands.

```
src/
  components/
    shell/    TopBar, ManifestToggle, ModeSwitch, SoundToggle, CommandPalette,
              LayerRail, LayerStrip, SystemMap, StatusPill, LoadingPill, SkipLink
    stack/    StackStage, DepthRig, EnvironmentGrid, TraceLayer, LayerPlane,
              LayerHeader, LayerPanel, ServiceNode, ServiceReadout
    ui/       KeycapButton, Panel, Chip, Tag, Divider, ProjectSigil,
              StatCount, Callout, Sheet, Modal, Toast
    exhibits/ Exhibit (interface), FormulaExhibit, AsciiExhibit, Poster
    content/  ProjectCard, ProjectGrid, CaseStudy, ArticleCard, Timeline,
              SkillGroups, ResumeBlock
    seo/      SeoHead, JsonLd
  engine/
    depth.ts         DepthController + scroll↔depth mapping
    governor.ts      QualityGovernor
    loop.ts          rAF loop with visibility + delta clamp
    visibility.ts    two-tier visibility lifecycle
    projection.ts    depth math, layer transforms, trace path math
    input.ts         pointer/keyboard/touch resolver (single intent resolver)
    audio.ts         WebAudio synth (clicks, focus, mode)
    state.ts         nanostores store + persistence + deep-link sync
    stores.ts        derived selectors (layers, projects, filters)
  data/              content collections + config (single source of truth)
  layouts/           BaseLayout, StackLayout, DocumentLayout (manifest/plain)
  pages/             routes (§16)
  styles/            tokens.css, base.css, stack.css, components.css, print.css
  lib/               markdown, i18n, seo, rss, search index builder
```

**Rules:**
- One **input resolver** routes all pointer/touch/click intents (per Swarmguard) to prevent double-trigger bugs.
- One **state store**; all islands subscribe; no prop-drilling between islands.
- The depth engine is framework-free TypeScript; it reads/writes the store and DOM. Complex UI (command palette, system map) may use **Preact** (via `@astrojs/preact`) *only if* vanilla complexity exceeds a threshold; default to vanilla.
- No component may hard-code content; all content comes from `src/data`/`src/content`.
- Every interactive component defines all states: default/hover/focus-visible/active/disabled/loading/error.

---

## 14. Data / Content Model

**Single source of truth:** Astro content collections (Zod-validated) + small config/data files. The stack, `/work`, `/notes`, `/manifest`, RSS, sitemap, and JSON-LD all read the same data.

```
src/content/
  projects/      *.md (or .mdx)   — one per project
  experiences/   *.md
  notes/         *.md
  journey/       *.md             — memoir chapters
  pages/         *.md             — about, uses
src/data/
  profile.ts          identity, links, availability, education
  capabilities.ts     skill groups
  layers.ts          layer registry + project mapping (replaces stations.ts)
  modes.ts            runtime-mode token presets
  nav.ts              top-level nav + command palette sources
```

**Build-time validations (must fail the build):**
- Every `layer` referenced exists; every `project.slug` resolves.
- No project is orphaned (each appears in Application or Jobs).
- All required content fields present, or the field renders `[CONTENT REQUIRED]` (see Appendix B register).
- All URLs parse and are https.

**i18n:** EN default; BN mirror for a defined subset initially (`/bn/`), extending the existing approach. Bengali line-height/letter-spacing overrides required for Hind Siliguri.

---

## 15. Project Schema

Extends the current portfolio schema and **fixes the known `impact` bug** (current `config.ts` omits `impact`, so it never renders). Adds `lessons`, `architecture`, `media`, and `sigil_seed`.

```ts
// src/content/config.ts (specification)
const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    slug: z.string(),                       // URL-safe; derived if omitted
    description: z.string().max(180),       // one-line hook
    type: z.string().optional(),            // "E-commerce / Backend"
    tier: z.enum(['flagship', 'standard', 'experiment']).default('standard'),
    category: z.enum(['production', 'experimental']).default('production'),
    featured: z.boolean().default(false),   // shown on the Edge/featured rail
    hidden: z.boolean().default(false),     // excluded from all lists
    position: z.number().default(999),      // ordering

    problem: z.string().optional(),         // "The Problem"
    solution: z.string().optional(),        // "The Approach"
    impact: z.string().optional(),          // "Impact"  <-- restored
    highlights: z.array(z.string()).default([]), // engineering decisions
    scope: z.array(z.string()).default([]),      // detailed work items
    lessons: z.array(z.string()).default([]),    // [CONTENT REQUIRED] if empty

    tech: z.array(z.string()).default([]),
    status: z.enum(['Production','Active','Ongoing','WIP','Archived','ACTIVE']).optional(),
    period: z.string().optional(),
    role: z.string().optional(),
    commits: z.number().optional(),

    live: z.string().url().nullable().optional(),
    github: z.string().url().nullable().optional(),
    exhibit: z.enum(['none','formula','ascii']).default('none'), // optional Canvas exhibit

    thumbnail: z.string().optional(),       // real screenshot if available
    media: z.array(z.object({
      type: z.enum(['image','video','diagram']),
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).default([]),                         // [CONTENT REQUIRED] until supplied

    architecture: z.string().optional(),     // prose or mermaid; [CONTENT REQUIRED] if empty
    sigil_seed: z.string().optional(),       // deterministic generative sigil seed

    lang: z.enum(['en','bn']).default('en'),
  })
});
```

**Content rules:**
- `impact` and `highlights` must be real, quoted from the author's files (Appendix A). No invented metrics. Where a project has no metrics, write qualitative impact only, or omit.
- `lessons`, `architecture`, and `media` are intentionally honest gaps → render `[CONTENT REQUIRED]` until the author provides them.
- Two projects are `hidden: true` in current data (Xencode CLI, `.lol directory`); preserve that unless the author says otherwise.

---

## 16. Routing

- **Astro static output (SSG)** by default; no SSR unless a real server need appears (contact form, analytics endpoint). Prefer reuse of the existing CMS/contact API rather than a new backend.
- Routes per §6.2. Every project/note gets a real, descriptive, canonical URL.
- **Deep links into the stack:** query params `?layer=`, `?project=`, `?mode=runtime|debug`, `?view=stack|manifest`, `?quality=`, `?exhibit=`. The stack must initialize to a deep-linked state on load (read params before first paint where possible; otherwise settle quickly without flash).
- **History:** layer focus and mode changes push real history entries so browser Back feels natural. Readout open/close does not create history spam (replace for transient UI, push for meaningful state).
- **Trailing slashes / casing:** consistent lowercase, trailing slash; redirects handled at host.
- **Language:** `/` (EN) and `/bn/` prefix for Bengali; `hreflang` alternates.

---

## 17. State Management

- **`nanostores`** (tiny, framework-agnostic) shared across islands.
- Store slices:
  - `depth` (current, target, dragging, reduceMotion)
  - `stack` (activeLayer, focusedProject)
  - `prefs` (mode, sound, quality, view[stack|manifest], reducedMotionOverride) — persisted `localStorage` (`stack.prefs`)
  - `progress` (lastLayer, visited) — persisted
  - `ui` (commandPaletteOpen, systemMapOpen, sheetOpen, loading)
- **Persistence:** prefs + last layer; deep-link params override stored values on load.
- **Derived selectors** for filtered project lists, layer→projects mapping.
- **No global re-render:** store subscribers update only their element(s).
- **SSR/initial state:** serialize a minimal initial state into the page (`<script type="application/json">`) so islands hydrate without guessing and deep links work pre-JS.

---

## 18. Asset Strategy

- **Fonts:** self-hosted `@fontsource` (`Space Grotesk`, `Inter`, `IBM Plex Mono`, `Hind Siliguri` for BN). Subset Latin (+ Bengali subset for BN routes). Preload critical faces; `swap`.
- **Images:** AVIF/WebP via Astro `<Image>`; explicit width/height (no CLS); `loading="lazy"` below fold, `fetchpriority="high"` only for the hero poster. Portrait → `[CONTENT REQUIRED]`; until then use a generated monogram/schematic sigil as Edge art.
- **Project media:** real screenshots/videos → `[CONTENT REQUIRED]` per project. Until supplied, render the deterministic **ProjectSigil** (generative, seeded) so no project looks broken.
- **Schematics:** SVG drawn in-DOM; no raster diagram assets required (architecture diagrams → `[CONTENT REQUIRED]` and rendered as labeled frames until supplied).
- **Generative art:** Canvas-drawn at runtime (no asset weight) for sigils, accents, and exhibits. Posters pre-rendered at build time to a small static image for reduced-motion/no-JS/`og:image`.
- **Audio:** fully synthesized via WebAudio (no files). Mute by default; persisted.
- **Icons:** inline SVG sprite; no icon fonts.
- **3D/WebGL:** none shipped. Optional single enhancement only, if the author later chooses (§12.6).
- **OG images:** generated at build (or via the author's existing resvg/sharp OG pipeline) per route with title/meta.
- **Total asset budget (target):** initial JS ≤ ~110KB gzip; initial CSS ≤ ~40KB; fonts ≤ ~120KB subset; no hero image > ~120KB; total critical path ≤ ~450KB.

---

## 19. Performance Strategy

**Targets (field, mid-tier mobile, p75):**
- LCP ≤ 2.0s (hero text is the LCP element; it must render before any decorative layer).
- CLS ≤ 0.05.
- INP ≤ 200ms.
- TBT low; long tasks avoided.
- 60 FPS desktop for depth travel; ≥ 45–60 FPS mid mobile; never below 30.
- No main-thread blocking > 50ms during interaction.

**Rules:**
- **Content first, effects second.** Edge H1/role/CTAs are server-rendered HTML/CSS. Decorative layers initialize after first paint (`requestIdleCallback`/`load`).
- **Single rAF loop** with delta clamp (≤100ms) and a rolling FPS buffer; pause on `document.hidden`.
- **Two-tier visibility:** IntersectionObserver + Page Visibility + reduced-motion → ambient Canvas/SVG animation renders 0 frames when offscreen; single static frame under reduced motion.
- **DPR clamp** to `min(devicePixelRatio, 2)`; 1.0–1.5 on low-power/touch.
- **Zero per-frame allocation** in hot paths (pre-allocate arrays/typed arrays; pool particles/packets).
- **No layout thrash:** batch reads/writes; transforms only.
- **Lazy islands:** command palette, system map, and exhibits load on interaction (`client:visible`/`client:idle` or dynamic `import()`).
- **Code splitting:** engine + stack + exhibits as separate chunks; `/work`, `/notes`, `/manifest` ship almost no JS.
- **Prefetch** the likely next route on intent (hover/focus of a project card).
- **Caching:** immutable hashed assets; long cache; HTML short cache.
- **Fonts:** no FOIT; size-adjust fallbacks to reduce shift.
- **SEO/CWV guard:** if the budget is exceeded in CI (Lighthouse budget or `bundlewatch`), the build warns/blocks.

**Degradation ladder:** full stack depth → balanced → performance (flat, discrete) → static document → MANIFEST. All are acceptable shipped states.

---

## 20. Accessibility

**Standard: WCAG 2.2 AA (aim AAA for body text where practical).**

- **Semantic HTML:** one `<h1>`, ordered headings, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`; landmarks labeled.
- **Skip link** to content; the depth engine is purely decorative (`aria-hidden`), content is real DOM in linear layer order.
- **Keyboard:** every action reachable — Tab/Shift-Tab, arrows to move between layers, Enter to focus/open, `Esc` to close, `⌘K` palette, `M` system map, `L` manifest, `S` mode. Focus visible at all times (2px `--focus`, ≥3:1 contrast).
- **Focus management:** focusing a layer moves focus to its heading; opening a sheet/modal traps focus and restores it on close; `aria-live` for status (loading, mode change, copy confirmation).
- **Screen readers:** layer panels are real text; project content is fully available on the focused panel and on `/work/[slug]`; the MANIFEST is a complete alternative. Test with VoiceOver + NVDA (+ TalkBack).
- **Reduced motion:** `prefers-reduced-motion: reduce` (and the in-app override) disables depth travel, parallax, the trace packet, grid drift, scanlines, and count-ups; layers switch discretely; all transitions instant/opacity-only.
- **Contrast:** body ≥4.5:1, large ≥3:1, UI/borders ≥3:1, in both modes. Audit token pairs; the dark-theme trap (muted gray on near-black) must be avoided — `--text-lo` must still pass on `--bg`.
- **Touch targets:** ≥44×44px; ≥8px spacing.
- **No color-only meaning:** status uses text/icon + color.
- **Forms:** visible labels, associated errors, `aria-describedby`, honeypot (not CAPTCHA if avoidable), no timeouts.
- **Media:** captions/transcripts for any demo video; alt text required on all real images.
- **Motion/flash:** no flashing >3Hz; no rapid auto-rotating carousels.
- **Zoom:** usable at 200% and 400%; no content loss.
- **Language:** correct `lang` attributes (en / bn).
- **Testing:** automated (axe/Lighthouse) + manual keyboard + screen reader passes are part of Definition of Done.

---

## 21. SEO

- **Metadata per route:** unique `<title>`, `<meta name="description">`, canonical URL, `hreflang` (en/bn), `robots`.
- **Open Graph + Twitter/X cards** with generated OG images (1200×630) per route.
- **Structured data (JSON-LD):**
  - `Person` (name, jobTitle "Backend Engineer (Laravel)", email, sameAs [GitHub, LinkedIn, X], address/Chittagong, worksFor Electronic First, alumniOf Port City International University, knowsAbout).
  - `WebSite` (+ `SearchAction` if search exists).
  - `SoftwareApplication`/`CreativeWork` for each project where appropriate (no invented offers).
  - `BlogPosting` for notes; `BreadcrumbList` on nested routes.
- **Sitemap** (`@astrojs/sitemap`) + **robots.txt** (allow all; point to sitemap).
- **RSS/Atom** feed for `/notes`.
- **Descriptive, stable URLs** (`/work/electronic-first`), lowercase, no params for canonical content.
- **Crawlability:** the stack is enhancement; every layer's content exists in HTML on `/` and in full on `/work/[slug]` and `/manifest`.
- **Performance = SEO:** CWV targets in §19 are part of ranking.
- **Canonical domain:** `https://fazleyrabbi.xyz` (from existing config). Choose one canonical host and 301 the rest.
- **Do not** keyword-stuff or mass-generate thin pages. The 44 existing articles are enough; prioritize quality.

---

## 22. Analytics

- **Privacy-respecting only.** Recommend the author's existing **Umami** (he already has an ID) and/or Vercel Analytics. No invasive third-party trackers; no selling data.
- **Events (minimal, purposeful):** `view_manifest`, `open_contact`, `download_resume`, `open_project` (slug), `mode_switch`, `command_palette_open`, `system_map_open`, `exhibit_start`, `depth_travel_used`, `quality_tier` (initial tier). No scroll-depth spam; no hover tracking.
- **Consent:** if any cookie-based tool is used, gate behind a minimal, dismissible notice; prefer cookieless.
- **Performance monitoring:** real-user CWV if easy; otherwise rely on lab budgets.
- **Do not** let analytics JS affect CWV (defer/idle; no blocking).

---

## 23. Responsive Behavior

Four intentional experiences; mobile is **redesigned**, not reduced.

**Large desktop (≥1280):** full stack depth; layer rail (left); system map (`M`); all parallax/traces; glass readouts; hover traces; sound available; command palette prominent.

**Laptop (1024–1279):** full stack; reduced accent counts; rail; slightly tighter spacing; same interactions.

**Tablet (768–1023, touch):** stack with **tap-to-focus**; **bottom-sheet readouts** (not floating panels); rail compacted; no hover-only affordances; discrete depth switches rather than continuous drag; portrait refinement for tall screens.

**Mobile (<768):** **portrait composition.** An Edge hero card (name/role/CTAs) over a simplified schematic, a horizontal **layer strip** (snap-scroll) as the primary navigator, tap → full-height **bottom sheet** with the layer/readout content, a fixed **status pill**, and the top bar collapsed to brand + layer strip + menu sheet. `touch-action: manipulation` on controls; `touch-action: none` only on any decorative canvas; safe-area insets respected. No pinch-zoom requirement; no horizontal page scroll.

**Rules:** type scales down; hit targets grow to ≥44px; DPR capped; accents reduced; no autoplay audio; the layer strip replaces the rail as the dominant nav on the smallest screens. Test at 320px width.

---

## 24. Browser Support

- **Full experience (tier 1):** latest 2 versions of Chrome/Edge, Firefox, Safari (desktop + mobile); Safari ≥16.4; Chrome/Edge ≥111; Firefox ≥113. Requires: CSS custom properties, CSS transforms/perspective, `clamp()`, `:has()` (progressive), `backdrop-filter` (progressive), `IntersectionObserver`, `ResizeObserver`, Web Audio, `color-mix()`/`oklch()` (progressive — provide sRGB fallbacks).
- **Good experience (tier 2):** slightly older evergreen → no glass (opaque fallback), no grain, static environment, everything still readable and navigable.
- **Baseline (tier 3):** older/limited browsers and **no-JS** → the MANIFEST document renders (server-rendered HTML/CSS), all content and links present, no depth engine.
- **Explicitly unsupported:** IE; anything without CSS custom properties → MANIFEST only.
- **Feature detection** (not UA sniffing) for: `backdrop-filter`, `color-mix`, `matchMedia` reduced motion/memory, `navigator.deviceMemory`/`hardwareConcurrency`; WebGL is not required.
- **Progressive enhancement order:** content → layout/type → SVG schematic environment → CSS depth → Canvas accents → optional exhibit.

---

## 25. Error & Fallback States

| Failure | Detection | Designed fallback |
|---|---|---|
| Depth engine fails | try/catch on init | All layers render flat and stacked in normal document flow; fully navigable |
| SVG/CSS env fails | feature detect | Plain colored background; stack still works |
| Canvas accent fails | try/catch on init | Static CSS schematic; stack still works |
| JS disabled | server output | MANIFEST-style document at `/` with all content; next/prev links |
| Reduced motion | media query / override | Discrete layer switches; no travel/packet/parallax |
| Low-power device | governor heuristics | PERFORMANCE tier automatically |
| Slow network | loading states | Peripheral status pill; skeleton readouts; content streams first |
| Fonts fail | `font-display: swap` + local fallbacks | System stack; layout stays stable (size-adjust) |
| Content/markdown missing | build-time validation | Build fails (dev) / `[CONTENT REQUIRED]` (allowed optional fields) |
| Project has no media | schema default | Deterministic ProjectSigil + "media coming soon" |
| Deep link to unknown layer | param validation | Redirect to Edge + toast "Layer not found" |
| Contact form / API down | fetch failure | Clear inline error, retry, and a direct `mailto:` fallback |
| 404 | routing | Designed diegetic 404 with links to Edge + Manifest |
| Audio blocked | play() rejection | Silent; toggle shows "enable sound" |
| Session/prefs corrupted | JSON parse guard | Reset to defaults, no crash |
| Optional WebGL unavailable | feature detect | Poster fallback; exhibit marked "unavailable" (only if that flag is ever enabled) |

**Principle:** no error may leave a blank screen or an inaccessible state. Every failure resolves to readable content.

---

## 26. Deployment Architecture

### 26.1 Repository & branch workflow (binding)

The build happens **inside the existing `astro-portfolio` monorepo**, in `apps/web`, on a long-lived branch:

1. Create `rebuild/stack` from `main`. **`main` remains the live production site throughout.**
2. Build the new system in `apps/web` under **new paths** (`src/stack/**`, new layouts, new `tokens.css`, new pages), leaving existing live routes/components intact and untouched.
3. Push the branch → **Vercel creates a preview deployment per push automatically**. This preview URL is the real, shareable, device-testable "staging" environment. No new infra required.
4. Use feature branches off `rebuild/stack` for parallel work; PRs deploy previews.
5. At cutover: swap the homepage, add redirects, delete dead legacy components (Appendix C), then merge `rebuild/stack` → `main`. Vercel deploys production to the existing domain.
6. Keep the previous static build for instant rollback.

**Why not a separate repo:** the existing repo already owns the domain, deploy pipeline, content collections, i18n, résumé, blog data, analytics, and contact API. A branch gets go-live for free and eliminates content drift. **Why not on `main`:** a rewrite on `main` would either break the live site or freeze shipping.

### 26.2 Hosting & environment

- **Static-first:** Astro static output (SSG). Host on **Vercel** (existing project/domain). Cloudflare Pages is an acceptable alternative only if migrating hosts deliberately.
- **Optional serverless endpoints** (only if needed): `/api/contact` and `/api/track` reuse the author's existing `cms.fazleyrabbi.xyz` API rather than adding infrastructure. Do not stand up a new backend unnecessarily.
- **Environment:** `.env` for analytics IDs and API base; **never commit secrets.** The current repo has a committed Cloudinary API URL with embedded credentials (plus Telegram chat ID, Supabase URL, Umami ID) in `.env.production` — **rotate the Cloudinary key and move all of it to env** before proceeding (Appendix C, C4).

### 26.3 CI/CD & delivery

- **GitHub Actions:** install → typecheck → build → content validation → Lighthouse CI budget → axe/a11y checks → link/URL validation → deploy preview on PR → deploy production on `main`.
- **Caching/CDN:** hashed immutable assets, long `max-age`; HTML short/no-cache; Brotli; HTTP/2/3.
- **Domain:** `fazleyrabbi.xyz` canonical; 301 redirects for old routes (`/projects/*` → `/work/*`, `/posts/*` → `/notes/*`) to preserve SEO.
- **Observability:** build logs; optional uptime check; lightweight error reporting — no PII.
- **Rollback:** Vercel instant rollback; keep the previous static build.

---

## 27. Development Phases

**Phase 0 — Foundations (must precede all design work).**
Create `rebuild/stack`; confirm Vercel preview deploys work. Scaffold the new stack under new paths (Astro 5 + TS + Tailwind + tokens); content model + Zod schemas; migrate existing content into `src/data`/`src/content` from the current source; **resolve the legacy content issues in Appendix C** (restore `impact`, pick one canonical blog source, rotate the committed secret, add 404); content validation; MANIFEST route rendering all real content; SEO base (meta/OG/JSON-LD/sitemap/robots); CI with typecheck + content validation + Lighthouse budget. *Outcome: an accessible, indexable, content-complete text site on a preview URL — already shippable.*

**Phase 1 — Visual system.**
Tokens (both modes), typography, surfaces/shadows/radii/icons, keycap buttons, base components, `/work`, `/work/[slug]`, `/notes`, `/resume` (with print), `/about`, `/uses`. *Outcome: a fast, beautiful, distinct document site — already shippable.*

**Phase 2 — The Stack (depth spine).**
StackStage + CSS depth model, layer planes + registry, DepthController + scroll↔depth mapping, layer headers/panels, layer rail, system map, top bar, layer strip (mobile), status pill. Governor + reduced-motion + MANIFEST fallback wired. *Outcome: the layered systems experience works; content remains accessible.*

**Phase 3 — Interaction & motion polish.**
Trace packet, hover traces, micro-interactions, mode cross-fade, sound (opt-in), deep links + history, command palette, preferences persistence, transitions, 404. *Outcome: finishes + delight, no gimmicks, no dashboard cosplay.*

**Phase 4 — Exhibits (Canvas).**
Exhibit interface, generative exhibits in the Jobs layer, ASCII easter egg, Before/After visuals.

**Phase 5 — Hardening.**
Performance budgets, Lighthouse/axe, cross-browser/device matrix, screen-reader passes, responsive audit at 320/768/1024/1440/1920, content gaps (`[CONTENT REQUIRED]`) closed with the author, analytics, SEO verification, launch.

---

## 28. Implementation Milestones

| # | Milestone | Phase | Done when |
|---|---|---|---|
| M1 | Content model + MANIFEST | 0 | All real content renders as semantic HTML; build validates; sitemap + JSON-LD present |
| M2 | Design tokens + core components | 1 | Both modes themed from one token file; keycap buttons; components documented |
| M3 | Document routes complete | 1 | `/work`, `/work/[slug]`, `/notes`, `/about`, `/uses`, `/resume`, `/journey` shipped; print CSS; Lighthouse ≥95 a11y/SEO |
| M4 | Stack depth + controller | 2 | Depth travel between all layers; rail + strip + system map navigate; reduced motion switches discretely |
| M5 | Layer panels + deep links | 2 | `?layer=` + history + focus management work; content fully readable in-stack |
| M6 | Governor + fallbacks | 2 | Tiers auto-switch; flat document + MANIFEST reachable from every state; no blank states |
| M7 | Interaction polish | 3 | Trace packet, hover traces, palette, mode switch, persistence, sound, 404 |
| M8 | Exhibits | 4 | Canvas exhibits use visibility lifecycle; ASCII toggle; posters baked |
| M9 | Performance + a11y hardening | 5 | Budgets met on test devices; axe clean; SR passes; 320px audit clean |
| M10 | Launch | 5 | Redirects, analytics, OG verified, rollback tested, content gaps closed |

---

## 29. Acceptance Criteria

**Functional**
- [ ] `/` presents the layered stack; a first-time visitor can identify name, role, and availability within 5 seconds without interacting.
- [ ] Every project in Appendix A is reachable from the stack, `/work`, and `/manifest`; each has a working `/work/[slug]` page.
- [ ] Deep links (`?layer=`, `?project=`, `?mode=`, `?view=manifest`) initialize correctly and shareably.
- [ ] Command palette (`⌘K`), layer rail, and system map (`M`) navigate to every layer/project; keyboard-only users can complete J5 end-to-end.
- [ ] Mode switch changes the entire token set; preference persists across reloads.
- [ ] Browser Back behaves naturally after layer/mode changes.

**Quality**
- [ ] LCP ≤ 2.0s (p75, mid mobile), CLS ≤ 0.05, INP ≤ 200ms; initial JS ≤ ~110KB gzip.
- [ ] 60 FPS depth travel on desktop; ≥45 FPS on mid mobile; governor engages on slow frames.
- [ ] No layout shift from fonts or decorative layers; no long tasks > 50ms during interaction.
- [ ] All degradation states render correctly: full depth → balanced → performance (flat) → MANIFEST.
- [ ] Zero WebGL on the critical path; the default build ships no WebGL.

**Accessibility**
- [ ] axe/Lighthouse a11y ≥ 95; zero critical violations.
- [ ] Full keyboard operation; visible focus; focus trapped/restored correctly in sheets/modals.
- [ ] Screen-reader pass (VoiceOver + NVDA): all content and links reachable; the depth engine announced as decorative.
- [ ] `prefers-reduced-motion` removes depth travel/parallax/packet; content identical.
- [ ] Contrast AA met in both modes; 320px–1920px usable; 200%/400% zoom usable.

**Content & SEO**
- [ ] No fabricated content anywhere; every optional gap shows `[CONTENT REQUIRED]` and is listed in Appendix B.
- [ ] Unique titles/descriptions/canonicals/OG per route; JSON-LD valid (Person/WebSite/Project/Posting); sitemap + robots + RSS present.
- [ ] Old URLs redirect to new ones.
- [ ] No fake telemetry, no invented metrics, no decorative charts presented as real data.

---

## 30. Definition of Done

The project is Done when **all** of the following hold:

1. **Content:** Every fact traces to Appendix A; every gap is explicitly `[CONTENT REQUIRED]` and tracked in Appendix B; no invented project, client, metric, testimonial, or technology exists.
2. **Experience:** The layered stack is implemented and is the default `/`; all layers and rails are explorable; the three navigation affordances (depth, layer rail/system map, command palette) plus MANIFEST all work.
3. **Direction integrity:** The site reads as a **system** (layers, traces, services, manifest), not as a 3D world, game, or themed dashboard; there is no dashboard cosplay and no fabricated data.
4. **Accessibility:** WCAG 2.2 AA met; keyboard + screen reader + reduced motion verified; MANIFEST provides full parity; mobile and desktop both pass.
5. **Performance:** Budgets in §19 met in CI on a throttled mid-tier profile; the site is fully usable with all effects disabled; zero WebGL by default.
6. **SEO:** Metadata, OG/Twitter, structured data, sitemap, robots, RSS, canonical/hreflang, and redirects verified.
7. **Engineering:** Types strict, content validated at build, no dead alternate systems, no committed secrets, CI green, deployment reproducible.
8. **Design:** One token system drives both modes; one easing token; the stack reads as one coherent system; no generic-template patterns remain.
9. **Maintainability:** Adding a project = editing one content file + one registry mapping; documented in the repo README.
10. **Honesty:** The site makes no claim the author cannot back with a link, a repo, a live URL, or a shipped system.

---

## Appendix A — Content Inventory (Verified Facts Only)

> **Content provenance (binding):** every fact in this appendix is extracted **solely** from the author's existing portfolio at `Sites/astro-portfolio` (its content collections, `src/data`, `src/i18n`, `journey.md`, `uses.md`, `resume.astro`, `posts.json`). The provided project directories (SPOT, Swarmguard, Yorimichi, SanctuaryMainframe, 8bitOS, ascii-shooter, retro-console, formula, TrendTimeline, SignalStack, etc.) are **inspiration only** and are **NOT** a content source; they appear exclusively in §5.1/§5.5. **Use this appendix as the only source of truth.** Do not embellish.

### A.1 Identity
- **Name:** Md. Fazley Rabbi (short: Fazley Rabbi; Bengali: ফজলে রাব্বি)
- **Role:** Backend Engineer (Laravel); variants used: "Mid-Level Backend Engineer", "Software Engineer (Laravel)", "Backend / Web Developer"
- **Positioning:** "Designing scalable backend systems, payment infrastructure, and APIs for products that serve real users."
- **Secondary:** "Building scalable systems, not just interfaces."
- **Description:** "Laravel & Backend Engineer specializing in SaaS platforms, REST APIs, and high-performance applications."
- **Location:** Chittagong, Bangladesh · UTC+6 · Open to Remote
- **Availability:** "Available for Mid-Level Backend Roles & Consulting"; "Currently accepting new collaborations for late 2026."
- **Experience claim:** 5+ years (start 2021)
- **Focus:** Distributed Systems, Payment Infrastructure, Cloud Infrastructure, AI Workflows
- **Education:** Port City International University — B.Sc. Computer Science & Engineering, 2020; Daffodil Institute of IT — Diploma in Computer Technology, 2016
- **Languages:** Bengali (Native), English (Professional Working Proficiency)

### A.2 Links
- Website: `https://fazleyrabbi.xyz`
- Email: `fazley111@gmail.com`
- GitHub: `https://github.com/fazleyrabby`
- LinkedIn: `https://linkedin.com/in/fazley-rabby`
- X/Twitter: `https://x.com/fazley111`
- YouTube: `https://youtube.com/@fazleyrabby`
- CodePen: `https://codepen.io/fazleyrabby`
- Résumé PDFs exist: `resume.pdf`, `cv.pdf`, `Fazley_Rabby_cv.pdf`

### A.3 Experience
1. **Electronic First FZ LLE** — Software Engineer (Laravel) — Oct 2021 – Present — Remote, UAE — `https://www.electronicfirst.com/`
   Skills: Laravel, Web Automation, REST API, Version Upgrades, Query Optimization.
2. **AMCoders** — Laravel Developer — Jan 2021 – Jul 2021 — Remote, Bangladesh — `https://codecanyon.net/user/amcoders`
   Skills: Laravel, Payment Gateways, CV Builder, API.
3. **Freelance** — Web Developer / Backend / Web Developer — Jan 2020 – Present
   Skills: PHP, CodeIgniter, jQuery, CMS, Blog Sites; projects incl. Education Management System, POS, Library Management, CMS.
4. **Rcreation** — intern → developer, ~2 years (from `journey.md`, Chittagong).

### A.4 Projects (as authored — do not alter facts)

**Production / professional:**
- **Electronic First** — E-commerce / Backend — Production — Oct 2021–Present — role: Software Engineer — 2,430 commits — live: `https://www.electronicfirst.com/` — tech: Laravel 9, PHP 8.2, MySQL, Redis, ClickHouse, Checkout.com, PayPal, RapidAPI. Highlights: multi-rule fraud engine; PayPal + Checkout.com dispute sync; ClickHouse analytics; Personalized Gift Card platform; versioned REST API + Swagger + AI chatbot endpoints; bundle commerce ("generated at least 30% more sales"); server-side GA4 `add_to_cart` with dedup. Impact (authored): "Reduced chargeback rates, automated dispute tracking, and enabled data-driven decisions on thousands of daily transactions." (25-item `scope` available in source.)
- **ACME Switchgear** — Industrial Platform / Full-Stack — Production — Aug 2026–Present — role: Lead Full-Stack Engineer — live: `https://acmeswitchgear.com/` — tech: Laravel 12, PHP 8.4, Livewire 3, Alpine.js, Tailwind CSS, MySQL, SMTP. Highlights: RFQ engine; multi-channel SMTP; admin CMS; asset optimization reducing payload "by over 90%"; daily cron backups.
- **LitePOS** — POS / E-commerce — Active — Mar 2026–Present — role: Full-stack Engineer — 87 commits — live: `https://pos.fazleyrabbi.xyz/` — tech: Laravel, DaisyUI, Tailwind, Alpine.js, MySQL 8, Redis, Docker, Cloudflare Tunnel, SSLCommerz, bKash, Stripe. 3 storefront themes (Nova/Style/Fresh).
- **Oblok** — DevOps / Observability — WIP — Jun 2026–Present — role: Solo Developer — 105 commits — `https://github.com/fazleyrabby/oblok` — tech: Laravel 13, PHP 8.4, PostgreSQL, Redis, Laravel Reverb, Alpine.js, Tailwind CSS, ApexCharts. `oblok-agent` log shipper; Horizon/Redis queue control plane.
- **SignalStack** — AI / Analytics Engine — Ongoing — Apr 2026–May 2026 — role: Solo Developer — live: `https://signal.fazleyrabbi.xyz/` · repo: `https://github.com/fazleyrabby/signal-stack` — tech: Node.js, NestJS, Groq, OpenRouter, Redis, Real-time AI. Highlights: multi-tier local AI pipeline; Pulse social distribution; Company Radar; Bengali translation queue; 35 DirectoryCrawlerService unit tests.
- **EduBase** — Education Intelligence Platform — Active — May 2026–Present — role: Solo Developer — live: `https://edubase.fazleyrabbi.xyz/` — tech: Laravel 13, PHP 8.4, MySQL, PostgreSQL, Redis, Meilisearch, Alpine.js, Tailwind CSS v4, Docker. Highlights: 12+ modules / 52+ tables; Fee Intelligence Engine; Comparison Engine; scrapers (BANBEIS, DSHE, UGC); Public REST API v1 (19 endpoints); 53+ tests.
- **Hujjah** — Web Application / Research Tools — Ongoing — Apr 2026–May 2026 — role: Solo Developer — live: `https://hujjah.fazleyrabbi.xyz/` · repo: `https://github.com/fazleyrabby/hujjah` — tech: Next.js, SQLite, FTS5, Groq AI, Transformers.js, BGE-M3. 111 Quran translations; RAG; sanad chain explorer.
- **Larabrix** — Open Source — Mar 2025–Feb 2026 — role: Solo Developer — live: `https://larabrix.rhtech.dev/` · repo: `https://github.com/fazleyrabby/larabrix` — tech: PHP, Laravel 12+, JavaScript, Tabler UI. Service-layer CRUD engine; drag-and-drop form builder; Tiptap page builder; Kanban; SaaS billing.
- **Lenden** — SaaS — live: `https://codecanyon.net/item/lenden-multipurpose-payment-gateway-system-saas/32131005`
- **Timelock** — SaaS — live: `https://codecanyon.net/item/timelock-project-management-system-with-screenshot-capture/32354442`
- **E-bank** — FinTech — live: `https://codecanyon.net/item/ebank-complete-online-banking-system-with-dps-loan/30597974`
- **Routine Management System** — Internal Tool — 2020–2024 — Final Year Project (Solo) — live: `https://routine-pciu.rhtech.dev/` · repo: `https://github.com/fazleyrabby/routine-lte` — 15 entities, 15 CRUD modules, Laravel 7→8 migration, AdminLTE 3, GitHub Actions.

**Experiments / creative:**
- **ClaimYourSpot (SPOT)** — live: `https://www.claimyourspot.lol/` · repo: `https://github.com/fazleyrabby/spot` — tech: Astro, TypeScript, Canvas 2D, Node.js, Express, PostgreSQL, Supabase, SSE. Collaborative real-time 10,000-tile (100×100) infinite 2D world; claim a permanent coordinate; 8-bit avatar; link your profile.
- **8Bit OS** — live: `https://8bit-os-portfolio.vercel.app/` — tech: CSS, Retro UI. Retro-style 8-bit operating-system interface portfolio.
- **ASCII Shooter** — live: `https://ascii-shooter.vercel.app/` — tech: ASCII, Game. Terminal-style ASCII shooter game for the web.
- **Math Art** — live: `https://art.fazleyrabbi.xyz/` — tech: Creative Coding, Mathematics. Generative mathematical animations and creative-coding experiments.
- **Swarmguard** — live: `http://swarmguard.fazleyrabbi.xyz/` — tech: HTML5 Canvas, PixiJS, Game Development, Tower Defense. Free colorful top-down tower-defense game across 10 waves.
- **Prompts Library** — live: `https://prompts.fazleyrabbi.xyz/` · repo: `https://github.com/fazleyrabby/prompts-library` — tech: Astro, Node.js, TypeScript, npm — 33+ prompts + CLI; interactive variable engine; deep links to ChatGPT/Claude.
- **MealHQ** — live: `https://mealhq.fazleyrabbi.xyz/` — tech: Laravel, PHP, Tailwind CSS v4, Alpine.js, MySQL, Docker. Editorial restaurant website + admin dashboard + POS + offers.
- **DailyLOG** — repo: `https://github.com/fazleyrabby/dailylog` — tech: Laravel 12, PostgreSQL, Tailwind CSS v4, Alpine.js, Vite, Tiptap, LibreSpeed, Supabase. Personal Life OS: bidirectional notes, task boards, journals; multi-theme (Warm Stone, Neon Grid, Retro 8-Bit).

> **Excluded from content (inspiration only, §5.1):** Yorimichi, SanctuaryMainframe, retro-console (KROMA 01), and TrendTimeline (The Web Was Here) are local experiments used solely as design/interaction inspiration. They are **not** portfolio content. If the author later wants them listed, they must first be added to the `astro-portfolio` content source.

**Hidden in current data (keep hidden unless told otherwise):**
- **Xencode CLI** — `https://github.com/fazleyrabby/xencode` — local-first agentic AI coding CLI.
- **.lol directory** — live: `http://lol.fazleyrabbi.xyz/` — directory/curation.

### A.5 Capabilities (groups & primary items)
- **Backend & Systems:** Laravel*, PHP 8.x*, REST APIs, Livewire, Queue Workers, Event-Driven Architecture*
- **Databases & Analytics:** MySQL*, ClickHouse*, Redis*, SQLite, Read Replicas, Query Optimization*
- **Infrastructure & DevOps:** Docker*, Docker Compose, Linux (Ubuntu)*, Nginx, VPS Hardening, GitHub Actions, Cloudflare, Tailscale
- **Security & Integrations:** Fraud Engines*, PayPal API, Checkout.com, Stripe*, Webhooks*, Local LLMs / Groq
- **Languages:** PHP, TypeScript, JavaScript, SQL
- **Architecture:** Fraud Detection, High Concurrency, Database Replication/Idempotent Webhooks
- **Frontend & Tooling:** Astro, Tailwind CSS, Alpine.js, JavaScript
(* = designated primary)

### A.6 Workbench / Homelab (for `/uses`)
Editor: VS Code, Antigravity, PhpStorm · Theme: Monochrome (GitHub Edition) · Fonts: Menlo/JetBrains Mono · Tools: Herd/Docker, Chrome/Zen, ClickUp, Discord, Slack, Postman, Sequel Ace/DBeaver, CleanShot X, Apple Notes · Terminal: iTerm2/Warp, Zsh + Oh My Zsh (`bira`) · Primary machine: MacBook Pro M1 14" 16GB/512GB + LG 32UN650 4K · Secondary: AMD Ryzen 5 8600G · Homelab: Ubuntu 24.04 LTS, 7.5GB RAM, 232GB NVMe, **41+ active Docker containers**, Docker Compose + Traefik, Tailscale + Cloudflare Tunnels, Redis, ClickHouse, Portainer CE, Nextcloud, Jellyfin, Prometheus/Grafana/Loki, `llama-server` (Qwen) & Hermes, FrankenPHP/Swoole.

### A.7 Writing
- **44 posts** (42 EN, 2 BN) in the existing data source (`src/data/posts.json`), ~72 tags. Featured (by flag): "Running a Production-Grade Homelab on Bare Metal." Themes: Laravel production patterns, scaling, payments/idempotency, queues, multi-tenancy, ClickHouse, AI workflows, homelab. **Source of truth note:** current site reads posts from Supabase with a local JSON fallback; the new build should define one canonical source and migrate cleanly.

### A.8 Journey (memoir chapters)
CH.01 ~2001 first family computer; CH.02 2010–2013 Symbian tethering, Android, rooting/custom ROMs (LG Nexus 4), Ubuntu Touch/MultiROM, photography; CH.03 2013–2018 diploma, Rcreation internship, PHP/CodeIgniter; CH.04 2021 "Starting Over", AMCoders; CH.05 Oct 2021–Present, ">100 job applications", Electronic First, Laravel 5→9→13; CH.06 Now & Beyond, AI, still building.

---

## Appendix B — `[CONTENT REQUIRED]` Register

The following are missing and must be supplied by the author (or rendered as visible placeholders until then). **Do not fabricate these.**

| # | Item | Needed for | Priority |
|---|---|---|---|
| B1 | High-res neutral portrait photo (and permission to use) | Edge hero, `/about`, OG image | High |
| B2 | Project screenshots / short demo videos for production projects (Electronic First, ACME, LitePOS, Oblok, EduBase, SignalStack, Hujjah, Larabrix, Lenden, Timelock, E-bank, Routine) | `/work/[slug]`, cards, OG | High |
| B3 | Architecture diagrams for flagship projects (at minimum Electronic First, EduBase, SignalStack) | Case studies | High |
| B4 | "Lessons learned" text per project | Case studies | Medium |
| B5 | Confirm whether any inspiration-only local experiments (Yorimichi, SanctuaryMainframe, retro-console, TrendTimeline) should become portfolio content. If yes, the author must first add them to the `astro-portfolio` content source; otherwise they remain inspiration only | Content scope | Low |
| B6 | Correct/authoritative résumé PDF (one canonical file) | `/resume`, downloads | High |
| B7 | Testimonials / references (if any exist; otherwise omit entirely) | Social proof | Optional |
| B8 | Real, measurable metrics where currently qualitative (e.g., QPS, latency, uptime, user counts) — **only if verifiable** | Case-study impact | Optional |
| B9 | Confirmation of the canonical contact endpoint / whether to reuse `cms.fazleyrabbi.xyz` | Observability/contact | Medium |
| B10 | Bengali coverage scope (which routes get `/bn/` at launch) | i18n | Medium |
| B11 | Logo/brand mark preference (wordmark vs. monogram) | Brand | Low |
| B12 | Analytics choice confirmation (Umami ID vs Vercel Analytics) | Analytics | Low |
| B13 | OG/Twitter handle and preferred card copy | SEO/social | Low |

---

## Appendix C — Legacy Issues & Migration Tasks (from the existing repo)

These are **verified problems in the current `astro-portfolio` codebase** that the rebuild must resolve during Phase 0. They are not optional polish; several directly break the new spec's requirements.

| # | Issue (verified in existing repo) | Why it matters | Required action |
|---|---|---|---|
| C1 | Project `impact:` frontmatter is **not in the Zod schema** (`src/content/config.ts`), so Zod strips it and the case-study "Impact" block never renders (`projects/[slug].astro`) | The spec's case study requires `impact` (§8.3, §15) | Add `impact` to the schema and render it |
| C2 | Blog is read from **Supabase JSON fallback** (`src/data/posts.json`, 44 posts) rather than a content collection; an orphaned `src/content/blog/*.md` and empty `src/content/posts/` also exist, and the AI pipeline writes to a path that isn't read | Content source of truth is ambiguous; risks drift/duplication | Pick **one canonical source** (recommend content collection or a single JSON), migrate the 44 posts, delete orphans, update the API path |
| C3 | `packages/shared` is referenced by README/workspace globs but **does not exist** | Misleading architecture; shared types/tokens have no home | Either create it (shared tokens/types) or remove the references |
| C4 | **Committed secret:** `.env.production` contains a Cloudinary API URL with embedded key+secret, plus Telegram chat ID, Supabase URL, and Umami ID | Live credential exposure | **Rotate the Cloudinary key**, move all values to env/host secrets, purge from tracked files |
| C5 | Dead alternate components never mounted: entire `components/playground/*`, unmounted `home/*` panels, `Metrics`, `Skills`, `Services`, `Experience`, `ProjectCard` (old), etc. | Confusing surface; bundle risk | Delete at cutover (not before) |
| C6 | **No `404.astro`** exists; `posts/[slug]` redirects toward `/404` | Broken not-found experience | Add the designed 404 (§8.10) |
| C7 | Bengali case-study routes are generated only for EN projects (`projects/[slug].astro` `getStaticPaths`) | Incomplete i18n; broken expectations for BN-only projects | Generate BN routes for BN projects; align with the i18n scope (B10) |
| C8 | Duplicate `position` values (three projects at `position: 2`) | Ordering relies on file-order stability | Assign stable, unique ordering |
| C9 | Project/experience dates run into **2026** (up to "Aug 2026 – Present") | Not errors | **Preserve exactly.** Do not "correct" dates |
| C10 | AI/posts path mismatch: `apps/api` writes Markdown to `apps/web/src/content/posts`, which the site does not read | Silent content-pipeline bug | Reconcile the pipeline with the chosen canonical source (C2) |
| C11 | `.env.production` also references legacy `NOTION_*` IDs; Notion appears unused | Noise/confusion | Remove unused config |

**Migration rule:** resolve C1–C4 and C6 in Phase 0 (they block correctness/security); resolve C5, C7–C11 before cutover. Never delete legacy before the preview build proves parity.

---

## Implementation Contract

This section is binding for the implementation agent.

### What MUST be implemented
1. **Semantic, crawlable, accessible content first** — the MANIFEST-equivalent content must exist as real DOM and render without JS.
2. **The Stack** as the default `/` experience: a **layered-systems depth interface** built with **DOM + CSS depth + SVG schematics + Canvas accents** (not a 3D world, no We3.js/WebGL requirement), with the layers/depth-controller/rail/system-map/palette/mode switch specified above.
3. **All 30 sections' requirements**, specifically: the single token system (§10), motion system (§11), depth/layer architecture (§12), data model + project schema (§14–15), routing/deep links (§16), state/persistence (§17), performance budgets (§19), accessibility (§20), SEO (§21), responsive experiences including the intentional mobile design (§23), and all error/fallback states (§25).
4. **Case-study pages** for every project where content exists, with the restored `impact` field.
5. **MANIFEST** flat view with full content parity and a persistent way to reach it from any state.
6. **Content validation at build** and visible `[CONTENT REQUIRED]` for gaps.
7. **Resolve the legacy issues in Appendix C**, in particular C1 (restore `impact`), C2 (single canonical blog source), C3 (`packages/shared`), C4 (rotate committed secret), C6 (404) in Phase 0; the rest before cutover.
8. **Deliver on the branch/preview workflow** (§26.1): build in `apps/web` on `rebuild/stack`, keep `main` live, and reserve the legacy swap/deletion for cutover.

### What must NOT change without explicit justification
- The **systems-layer direction** (The Stack) and the rejection of a 3D world (§5.4). Reintroducing a 3D/WebGL world requires written justification against every point in §5.4 and re-confirmation by the author.
- The **one-dataset/multiple-lenses** model. Do not fork content per view.
- The **single easing token** and **single token-driven runtime-mode system**. Do not introduce competing easings/palettes.
- The **reduced-motion, MANIFEST, and no-JS guarantees**. These may be extended, never removed.
- **No fabricated content, no fake telemetry, no dashboard cosplay.**
- **No WebGL on the critical path**; default build ships none.

### Fixed decisions
- **Repository & workflow:** build inside the existing **`astro-portfolio` monorepo, `apps/web`**, on branch **`rebuild/stack`**; `main` stays live; Vercel preview deployments are the test environment; cutover = swap homepage + merge (§26.1).
- Framework: **Astro 5** (static) + **TypeScript**; styling: **Tailwind** with CSS custom-property tokens; motion: **GSAP + ScrollTrigger** for depth/scroll choreography + CSS for micro-interactions; smooth scroll: **Lenis** (desktop only, reduced-motion aware); audio: **Web Audio API** (synthesized, opt-in); state: **nanostores**; optional UI framework: **Preact** (islands only, only if justified); **no Three.js / WebGL in the default build**.
- Hosting: existing **Vercel** project/domain; reuse the existing contact API rather than adding a new backend.
- Router/URL scheme and deep-link params (§16).

### Flexible decisions (agent may choose, document the choice)
- Exact library for fuzzy search in the command palette (small custom matcher or a tiny lib).
- Whether the command palette / system map use Preact or vanilla (prefer vanilla; Preact only if it reduces net complexity).
- Exact layer spacing, depth step, trace path design, and accent counts within the specified grammar.
- OG image generation approach (build-time static vs. the existing resvg/sharp pipeline).
- Precise token values within the contrast/legibility constraints.

### Assets required (author must provide; see Appendix B)
Portrait (B1), project screenshots/videos (B2), architecture diagrams (B3), canonical résumé PDF (B6). Until provided, ship deterministic generated sigils/posters and `[CONTENT REQUIRED]` markers — **never fake assets.**

### What must be tested
- **Build/CI:** typecheck, content validation, link/URL check, Lighthouse CI budgets, axe accessibility.
- **Manual matrix:** Chrome, Firefox, Safari (desktop + iOS), Android Chrome; widths 320/768/1024/1440/1920; touch + pointer; reduced motion on/off; JS disabled; slow 3G throttle; low-power tier.
- **AT:** VoiceOver (macOS/iOS) and NVDA (Windows) walkthroughs; keyboard-only completion of all journeys.
- **Content:** every link resolves; every `[CONTENT REQUIRED]` is surfaced; no fabricated facts; no fake telemetry.
- **State:** deep links, back/forward, persistence across reload, mode switch, palette, rail, system map.
- **Failure:** depth engine init failure, SVG/CSS env failure, canvas accent failure, API failure, corrupted prefs, unknown deep link.

### What constitutes completion
Completion = **Definition of Done (§30)** satisfied in full, **Acceptance Criteria (§29)** all checked, the **`[CONTENT REQUIRED]` register (Appendix B)** either resolved by the author or visibly surfaced in the shipped site, and CI green on the production commit.

---

*End of specification.*
