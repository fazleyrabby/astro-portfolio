You are a senior product designer, systems UX architect, and frontend design systems engineer.

Your task is to redesign and refactor ONLY the visual design system, layout structure, spacing system, navigation system, and component presentation of an existing developer portfolio.

IMPORTANT:
This is STRICTLY a UI/UX and frontend presentation redesign.

DO NOT:

* modify business logic
* modify application logic
* modify backend architecture
* modify routing logic
* modify data fetching
* modify APIs
* modify Astro/Laravel application structure
* modify database logic
* modify content structure unless required for layout density
* remove existing functionality
* rewrite core application behavior
* change existing project/article data models
* alter SEO logic
* alter localization logic
* modify authentication/session systems
* break current responsive behavior
* rewrite working components unnecessarily

This redesign should:

* preserve all current functionality
* preserve all routes/pages
* preserve existing content
* preserve application logic
* preserve interactions unless visually improving them
* preserve accessibility
* preserve responsiveness

The goal is:

* purely a design-system evolution
* layout modernization
* information-density optimization
* navigation restructuring
* visual hierarchy redesign
* operational workspace transformation

==================================================
PROJECT CONTEXT

The current portfolio already exists and contains:

* Home page
* Work/projects page
* Blog archive
* Blog article pages
* Uses page
* Resume/CV page

The current problems:

* excessive whitespace
* oversized typography
* too much vertical scrolling
* landing-page SaaS structure
* isolated sections
* weak persistent navigation
* low information density
* too much editorial spacing
* project cards are too large
* content feels disconnected
* pages feel like marketing pages instead of operational systems

The redesign goal is NOT:

* a generic startup SaaS site
* a glassmorphism dashboard
* a fake hacker movie UI
* a cyberpunk overload
* an admin template

The redesign SHOULD feel like:

* a developer operating environment
* a compact engineering workspace
* a modular systems interface
* a technical knowledge workstation
* a premium developer tool
* an infrastructure-aware product ecosystem

==================================================
GLOBAL DESIGN PHILOSOPHY

Core design direction:

* Swiss Systems UI
* Industrial minimalism
* Retro-terminal influence
* Compact information density
* Editorial grid discipline
* Developer tooling aesthetics
* Observability-inspired layouts
* Modular operational workspace

Visual personality:

* technical
* calm
* dense
* precise
* systematic
* operational
* professional
* tactile
* mature

The interface should feel inspired by:

* Linear
* Raycast
* Warp
* Obsidian
* Grafana
* Retool
* VSCode
* Teenage Engineering
* modern observability dashboards
* premium developer tooling

==================================================
CRITICAL RULES

DO NOT:

* use giant hero sections
* use huge typography
* use oversized whitespace
* create generic startup landing pages
* create fake sci-fi dashboards
* overuse telemetry
* create noisy cyberpunk clutter
* use excessive gradients
* use giant card padding
* create vertically stretched sections
* create decorative-only UI
* create fake metrics
* create empty atmospheric layouts

INSTEAD:

* prioritize information density
* use modular panels
* compress spacing intelligently
* make navigation persistent
* make content scannable
* create workspace-like hierarchy
* use operational UI structure
* maintain readability
* make every block useful
* make the UI feel productive

==================================================
GLOBAL LAYOUT SYSTEM

Use a persistent desktop layout:

┌──────────────────────────────────────────┐
│ Top System Bar                           │
├────────┬─────────────────────────────────┤
│ Rail   │ Main Workspace                  │
│ Nav    │                                 │
│        │ Modular Grid                    │
│        │                                 │
│        │ Panels / Projects / Articles    │
│        │                                 │
└────────┴─────────────────────────────────┘

==================================================
LEFT RAIL NAVIGATION

The left rail is NOT a traditional sidebar.

It should feel like:

* a workspace dock
* an operating system activity rail
* a developer tool navigator

Width:

* 72px–88px

Contents:

* logo
* compact navigation icons
* active section indicator
* theme switcher
* status indicator
* optional clock/system state

Navigation items:

* Home
* Work
* Blog
* Labs
* Uses
* Resume
* Contact

Behavior:

* persistent on desktop
* compact
* minimal labels
* icon-first
* hover expansion optional
* subtle active states
* tactile interactions

Visual direction:

* thin borders
* compact spacing
* subtle depth
* monochrome surfaces
* industrial feel

==================================================
TOP SYSTEM BAR

This is NOT a marketing navbar.

It should feel like:

* a workspace command bar
* system navigation layer
* application frame

Height:

* 44px–56px

Include:

* breadcrumb navigation
* current section
* search
* theme/mode
* availability status
* optional quick actions
* optional command menu trigger

Example:
Workspace > Projects > SignalStack

Visual style:

* compact
* technical
* subtle separators
* operational
* low visual noise

==================================================
TYPOGRAPHY SYSTEM

Typography must become compact and operational.

Use:

* Swiss hierarchy
* technical rhythm
* compact scaling

Recommended scale:

* Hero: 40–48px max
* Section titles: 20–28px
* Card titles: 14–18px
* Body: 13–15px
* Labels/meta: 11–12px

Avoid:

* giant marketing typography
* oversized headings
* huge paragraph widths

Typography direction:

* editorial precision
* compact rhythm
* developer tooling feel
* strong hierarchy
* readable density

Recommended font pairing:
Primary:

* Inter
* Geist
* Neue Haas Grotesk
* General Sans

Technical/mono:

* IBM Plex Mono
* Geist Mono
* JetBrains Mono

==================================================
SPACING SYSTEM

Use a compact spacing scale.

Base grid:
4px

Allowed spacing:
4
8
12
16
20
24
32
40
48

Avoid:
64+
80+
120+
160+

Section spacing should feel:

* compressed
* intentional
* modular
* operational

==================================================
COLOR SYSTEM

Primary direction:

* dark industrial UI
* low-noise surfaces
* warm accent color
* subtle glow only when meaningful

Palette ideas:

* near-black backgrounds
* graphite surfaces
* muted borders
* warm amber/orange accent
* optional phosphor green
* soft grayscale typography

Use color sparingly.

Avoid:

* rainbow dashboards
* loud gradients
* saturated UI overload

==================================================
HOME PAGE REDESIGN

The home page should become:
“Developer System Dashboard”

NOT:

* a giant hero page
* a marketing funnel

Structure the homepage as modular operational panels.

Recommended structure:

[System Status]
[Current Focus]
[Availability]
[Now Building]

[Featured Projects Grid]

[Engineering Notes]
[Latest Articles]

[Infrastructure Stack]

[Current Experiments]

[Activity Feed]

[Terminal/Logs optional]

Use:

* compact cards
* split layouts
* metadata-heavy panels
* persistent structure

==================================================
PROJECTS PAGE

Current project cards are too large.

Redesign into:

* compact modular grids
* scannable systems
* operational project panels

Each project card should include:

* title
* short summary
* stack
* architecture tags
* deployment info
* status
* links
* metrics
* role
* infra indicators

Cards should feel:

* compact
* information-dense
* operational
* comparable
* structured

Avoid giant image-heavy cards.

==================================================
PROJECT DETAIL PAGE

Use a split-layout workspace structure.

Layout:

┌────────────────────────────────┐
│ Project Header                 │
├──────────────┬─────────────────┤
│ Metadata     │ Main Content    │
│ Stack        │                 │
│ Architecture │ Screenshots     │
│ Status       │ Case Study      │
│ Infra        │                 │
│ Metrics      │                 │
└──────────────┴─────────────────┘

Persistent metadata panel should include:

* stack
* architecture
* deployment
* infra
* APIs
* queues
* scaling
* role
* timeline
* status

Main content:

* concise
* modular
* technical
* visualized
* structured

==================================================
BLOG ARCHIVE REDESIGN

The current archive is close but needs:

* tighter density
* better scanning
* reduced spacing
* stronger grouping

Add:

* filtering system
* compact metadata
* category rail
* technical tags
* reading time
* architecture labels

Cards should feel like:

* engineering knowledge modules
* technical research entries
* system notes

==================================================
ARTICLE PAGE REDESIGN

The article page should become:
“technical reading workspace”

Add:

* persistent right-side TOC
* left utility rail
* reading progress
* share tools
* notes/bookmark actions
* section tracking

Reduce:

* giant paragraph spacing
* excessive max width
* oversized typography

Ideal reading width:
680px–760px

Line height:
1.6–1.7

Use:

* compact technical rhythm
* dense readability
* structured article sections

==================================================
USES PAGE REDESIGN

Current page is too prose-heavy.

Transform into:
“Developer Environment Configuration”

Use:

* grouped system panels
* collapsible modules
* compact hardware/software blocks
* operational setup cards

Suggested sections:

* Development
* Infrastructure
* Virtualization
* Hardware
* Automation
* AI Tooling
* Current Experiments

Each section:

* compact
* structured
* metadata-rich

==================================================
RESUME PAGE REDESIGN

Transform resume into:
“Technical Profile Workspace”

Structure:

Left:

* identity
* quick stats
* links
* availability
* focus areas

Right:

* experience timeline
* architecture expertise
* infrastructure skills
* stack matrix
* technical depth

The resume should feel:

* operational
* technical
* concise
* systems-oriented

==================================================
THEME SYSTEM

The portfolio supports multiple themes.

Primary themes:

1. Retro Terminal
2. Swiss Systems
3. FUI Experimental

IMPORTANT:
Do NOT create completely separate layouts.

Maintain:

* same spacing system
* same component system
* same layout engine
* same interaction model

Only change:

* colors
* typography
* borders
* shadows
* accents
* density tuning
* visual atmosphere

==================================================
RETRO TERMINAL THEME

Characteristics:

* CRT terminal influence
* monospace UI
* phosphor green or amber
* thin borders
* bitmap labels
* industrial computing feel

Mood:

* hacker workstation
* UNIX terminal
* developer lab

==================================================
SWISS SYSTEMS THEME

Characteristics:

* editorial grids
* structured hierarchy
* clean typography
* premium developer tooling
* restrained minimalism

Mood:

* modern systems company
* infrastructure SaaS
* engineering precision

==================================================
FUI EXPERIMENTAL THEME

Characteristics:

* subtle telemetry
* modular diagnostics
* tactical overlays
* observability-inspired UI
* cinematic systems aesthetics

IMPORTANT:
Keep readable and restrained.

Avoid:

* fake movie UI chaos
* unusable cyberpunk clutter

==================================================
FINAL GOAL

The final portfolio should feel like:

“a modular developer operating environment”

NOT:

* a startup landing page
* a generic dark portfolio
* a fake hacker dashboard
* an art project

The experience should communicate:

* systems thinking
* engineering maturity
* operational awareness
* infrastructure knowledge
* technical credibility
* product craftsmanship
* dense but elegant information architecture