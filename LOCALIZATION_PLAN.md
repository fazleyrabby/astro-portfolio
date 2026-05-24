# Localization Plan — fazleyrabbi.xyz

## Project Status (as of 2026-05-24)

**Stack:** Astro 5.13.5 (SSG) · Tailwind CSS · Supabase (blog) · Notion (portfolio data) · Vercel  
**Monorepo:** pnpm workspaces → `apps/web`, `apps/api`, `apps/cms`  
**Current i18n status:** None. English-only. No routing, no translation files, no lang detection.

---

## Project Structure (relevant to i18n)

```
apps/web/
├── astro.config.mjs            ← add i18n config here
├── src/
│   ├── pages/                  ← all routes, need locale prefixes
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── projects.astro
│   │   ├── resume.astro
│   │   ├── uses.astro
│   │   ├── gallery.astro
│   │   ├── resources.astro
│   │   ├── contact-success.astro
│   │   ├── posts/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   └── admin/              ← skip localization (private)
│   ├── layouts/
│   │   ├── MainLayout.astro    ← lang attr, locale context
│   │   ├── Head.astro          ← hreflang meta tags
│   │   ├── Nav.astro           ← nav labels, lang switcher
│   │   ├── Footer.astro        ← footer copy
│   │   └── BlogLayout.astro    ← blog-specific copy
│   ├── components/             ← all hardcoded strings need extraction
│   │   ├── Hero.astro
│   │   ├── Projects.astro
│   │   ├── ProjectCard.astro
│   │   ├── Experience.astro
│   │   ├── Skills.astro
│   │   ├── LatestPosts.astro
│   │   ├── ContactCTA.astro
│   │   ├── ContactForm.astro
│   │   ├── Services.astro
│   │   └── ...others
│   ├── content/
│   │   ├── config.ts           ← may need locale field in schemas
│   │   ├── projects/           ← 10 .md files (need translated versions)
│   │   ├── experiences/        ← 3 .md files
│   │   ├── about.md            ← needs translated version
│   │   ├── uses.md             ← needs translated version
│   │   └── resources/          ← 6 .json files (low priority)
│   └── i18n/                   ← CREATE THIS (translation strings)
│       ├── en.ts
│       └── bn.ts               ← Bengali (Bangla)
└── public/
```

---

## Content Inventory

| Content Type | Location | Localization Approach |
|---|---|---|
| UI strings (nav, buttons, labels) | Components/Layouts | JSON/TS translation files |
| About page | `content/about.md` | Duplicate per locale or locale field |
| Uses page | `content/uses.md` | Duplicate per locale |
| Projects | `content/projects/*.md` | Duplicate per locale |
| Experiences | `content/experiences/*.md` | Duplicate per locale |
| Blog posts | Supabase `posts` table | Add `lang` column; separate posts per locale |
| Resources | `content/resources/*.json` | Low priority, likely skip |
| Resume page | `pages/resume.astro` | Hardcoded? Extract strings |
| SEO meta | `Head.astro` | Pass locale-aware props |

---

## Recommended Approach

### Option A — Astro Built-in i18n (Recommended)
Astro 4+ has first-party i18n routing. No extra package needed.

**Config:**
```js
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'bn'],
    routing: {
      prefixDefaultLocale: false  // → /about (en), /bn/about (bn)
    }
  }
})
```

**Routes become:**
- `/` → English home
- `/bn/` → Bengali home
- `/about` → English about
- `/bn/about` → Bengali about
- `/posts/[slug]` → English posts
- `/bn/posts/[slug]` → Bengali posts

**Translation utility:**
```ts
// src/i18n/utils.ts
import en from './en'
import bn from './bn'
const translations = { en, bn }
export function t(locale: string, key: string) {
  return translations[locale]?.[key] ?? translations.en[key]
}
```

### Option B — Manual Route Duplication
Copy pages into `pages/bn/` directory. Simpler but harder to maintain. Not recommended.

### Option C — Third-party (astro-i18next, inlang)
More features (plurals, interpolation) but adds dependency. Overkill for a portfolio.

**Verdict: Option A** is cleanest for a static portfolio. Native Astro support, zero extra deps, good DX.

---

## Locales to Support

| Locale | Language | Priority |
|---|---|---|
| `en` | English | Default (already done) |
| `bn` | Bengali (Bangla) | Primary target |

Add more locales later without restructuring.

---

## Implementation Phases

### Phase 1 — Setup & Infrastructure
- [ ] Add i18n config to `astro.config.mjs`
- [ ] Create `src/i18n/` directory
- [ ] Create `en.ts` with all extracted UI strings
- [ ] Create `bn.ts` with Bengali translations
- [ ] Create `src/i18n/utils.ts` helper (`t()` function, `getLangFromUrl()`)
- [ ] Add `lang` prop to `MainLayout.astro`, set `<html lang={lang}>`
- [ ] Add `hreflang` alternate links in `Head.astro`

### Phase 2 — UI String Extraction
Extract all hardcoded strings from:
- [ ] `Nav.astro` — nav links, aria labels
- [ ] `Footer.astro` — footer copy, links
- [ ] `Hero.astro` — headline, subheading, CTA
- [ ] `Projects.astro` + `ProjectCard.astro` — section title, labels
- [ ] `Experience.astro` — section title, date formats
- [ ] `Skills.astro` — section title
- [ ] `LatestPosts.astro` — section title, "read more", date labels
- [ ] `ContactCTA.astro` + `ContactForm.astro` — form labels, placeholders, validation messages
- [ ] `Services.astro` — service descriptions
- [ ] `BlogLayout.astro` — TOC label, share labels, meta labels

### Phase 3 — Page Routes
- [ ] Restructure `pages/` to support locale routing
- [ ] `pages/index.astro` — pass locale context down to components
- [ ] `pages/about.astro`
- [ ] `pages/projects.astro`
- [ ] `pages/resume.astro`
- [ ] `pages/uses.astro`
- [ ] `pages/gallery.astro`
- [ ] `pages/resources.astro`
- [ ] `pages/posts/index.astro` — filter posts by locale
- [ ] `pages/posts/[slug].astro` — filter `getStaticPaths` by locale
- [ ] `pages/contact-success.astro`

### Phase 4 — Content Collections
- [ ] Add `locale` field to `projects` schema in `content/config.ts`
- [ ] Duplicate project `.md` files with `_bn` suffix or `bn/` subfolder
- [ ] Same for `experiences/*.md`
- [ ] Add translated `about.md` and `uses.md`
- [ ] Add `lang` column to Supabase `posts` table
- [ ] Update `getStaticPaths` in `posts/[slug].astro` to filter by locale

### Phase 5 — EN/BN Toggle (Frontend)
- [ ] Create `LangToggle.astro` component — simple EN | BN toggle pill in `Nav.astro`
- [ ] Toggle maps current URL to alternate locale:
  - `/about` → `/bn/about`
  - `/bn/posts/slug` → `/posts/slug`
  - For blog posts: only show BN link if `translation_of` row exists (no dead links)
- [ ] Pass `alternateUrl` prop from each page down to layout → `Nav.astro`
- [ ] Persist preference in `localStorage` key `lang` — on first visit, redirect if stored lang ≠ current
- [ ] Show toggle only when alternate version exists (blog posts); always show on static pages

### Phase 6 — SEO
- [ ] `hreflang` tags in `<head>` for all pages
- [ ] Locale-aware sitemap (Astro sitemap integration supports i18n natively)
- [ ] Locale-aware Open Graph tags
- [ ] Update `astro.config.mjs` site URL

### Phase 7 — Admin Translation Workflow (Blog Posts)

#### DB Schema Change
```sql
ALTER TABLE posts ADD COLUMN lang VARCHAR(10) NOT NULL DEFAULT 'en';
ALTER TABLE posts ADD COLUMN translation_of INTEGER REFERENCES posts(id) ON DELETE SET NULL;
CREATE INDEX posts_lang_idx ON posts(lang);
CREATE INDEX posts_translation_of_idx ON posts(translation_of);
```

- `lang` — which language this post is in (`en` or `bn`)
- `translation_of` — nullable FK pointing to the original post (null = original, set = translation)

This keeps translations as first-class rows in the same table. No separate table needed.

#### Posts List Page (`/admin/index.astro`)
- [ ] Add `lang` badge on each post row (e.g. `EN` or `BN` pill)
- [ ] Add **"Add BN"** button per row when `translation_of IS NULL AND lang = 'en'`
  - If BN translation already exists → show **"Edit BN"** button linking to `/admin/edit?id={bn_post_id}`
  - If not yet translated → "Add BN" links to `/admin/create?translate_from={original_id}&lang=bn`
- [ ] Add language filter tabs at top of list: **All / EN / BN**

#### Create Page (`/admin/create.astro`)
- [ ] Read `?translate_from` and `?lang` query params
- [ ] When `translate_from` is present:
  - Fetch original post from Supabase
  - Pre-fill: `slug` (append `-bn` suffix or use same slug — decide), `cover_image`, `tags`
  - Leave `title`, `description`, `content` blank for manual Bengali entry
  - Show banner: _"Translating: [Original Title] → Bengali"_
  - On save: set `lang = 'bn'`, `translation_of = {original_id}`
- [ ] When no params: default behavior (new English post)
- [ ] Add `lang` selector (EN / BN) visible when creating standalone posts

#### Edit Page (`/admin/edit.astro`)
- [ ] Show translation status panel in sidebar/below editor:
  - If post is English (`lang = 'en'`, `translation_of IS NULL`):
    - Check if BN translation exists
    - If yes → **"Edit Bengali Translation"** button → `/admin/edit?id={bn_id}`
    - If no → **"Add Bengali Translation"** button → `/admin/create?translate_from={id}&lang=bn`
  - If post is Bengali (`lang = 'bn'`):
    - Show **"View Original (EN)"** link → `/admin/edit?id={translation_of}`
- [ ] Show `lang` badge in page header so it's always clear which version is being edited

#### Slug Strategy for Translated Posts
Two options — pick one:
1. **Same slug, different lang** — slug `my-post` exists for both `en` and `bn`. Route `/posts/my-post` = EN, `/bn/posts/my-post` = BN. Clean URLs. Requires `getStaticPaths` to scope by locale.
2. **Suffixed slug** — BN post gets slug `my-post-bn`. Simpler DB queries but ugly URLs.

**Recommended: Option 1 (same slug, lang scoped).** Cleaner frontend URLs.

#### Other CMS Updates
- [ ] Update Telegram bot `/generate` command to accept `--lang bn` flag
- [ ] Update Notion sync script to include `lang` metadata if Notion is source of truth

---

## Key Technical Decisions

### Blog Posts (Supabase)
Blog posts live in Supabase. Schema:
```sql
-- Add to existing posts table
ALTER TABLE posts ADD COLUMN lang VARCHAR(10) NOT NULL DEFAULT 'en';
ALTER TABLE posts ADD COLUMN translation_of INTEGER REFERENCES posts(id) ON DELETE SET NULL;
CREATE INDEX posts_lang_idx ON posts(lang);
CREATE INDEX posts_translation_of_idx ON posts(translation_of);
```

`getStaticPaths` scopes by locale + same slug:
```ts
// pages/posts/[slug].astro  (English)
const { data: posts } = await supabase
  .from('posts')
  .select('*, original:translation_of(slug)')
  .eq('lang', 'en')
  .eq('status', 'published')

// pages/bn/posts/[slug].astro  (Bengali)
const { data: posts } = await supabase
  .from('posts')
  .select('*, original:translation_of(slug)')
  .eq('lang', 'bn')
  .eq('status', 'published')
```

Blog post page fetches alternate URL for the toggle:
```ts
// in [slug].astro — check if translation exists
const { data: translation } = await supabase
  .from('posts')
  .select('slug, lang')
  .eq('translation_of', post.id)
  .single()
// pass to layout as alternateUrl = translation ? `/bn/posts/${translation.slug}` : null
```

### Content Collections
Two strategies for markdown content:
1. **Subfolder per locale:** `content/projects/en/`, `content/projects/bn/`
2. **Locale field in frontmatter:** `locale: en` in each file, filter in queries

Subfolder approach is cleaner. Easier to see what's translated.

### URL Strategy
- English (default): no prefix → `/about`, `/posts/slug`
- Bengali: `/bn/about`, `/bn/posts/slug`
- Avoids breaking existing URLs (SEO safe)

---

## Files to Create

```
apps/web/src/i18n/
├── en.ts          ← all UI strings in English
├── bn.ts          ← all UI strings in Bengali
└── utils.ts       ← t(), getLangFromUrl(), getRouteFromUrl()
```

## Files to Modify

```
apps/web/astro.config.mjs              ← i18n config
apps/web/src/layouts/MainLayout.astro  ← lang prop, html[lang]
apps/web/src/layouts/Head.astro        ← hreflang meta
apps/web/src/layouts/Nav.astro         ← translated labels + switcher
apps/web/src/layouts/Footer.astro      ← translated copy
apps/web/src/layouts/BlogLayout.astro  ← translated labels
apps/web/src/components/*.astro        ← all components (extract strings)
apps/web/src/pages/**/*.astro          ← pass locale, locale-aware queries
apps/web/src/content/config.ts         ← add locale field to schemas
```

---

## Risks & Notes

| Risk | Mitigation |
|---|---|
| Breaking existing `/posts/slug` URLs | Use `prefixDefaultLocale: false` |
| Supabase schema change affects API | Test on staging Supabase project first |
| Missing translations fall back silently | `t()` function falls back to `en` key |
| Notion sync doesn't support locale | Add `locale` property to Notion DB |
| Build time increases (more static paths) | Expected — monitor Vercel build limits |
| Admin pages need locale awareness | Admin UI stays English; only post `lang` field changes |
| Dead toggle links (BN post doesn't exist) | Toggle hidden on blog posts when no translation exists |
| Slug collision (same slug, two langs) | Scoped by `lang` column — DB allows duplicate slugs across langs |
| Accidental translation_of loop | `translation_of` only set on non-original posts; originals always null |

---

## Estimated Effort

| Phase | Effort |
|---|---|
| Phase 1 — Infrastructure | ~2h |
| Phase 2 — String extraction | ~3h |
| Phase 3 — Page routes | ~3h |
| Phase 4 — Content collections | ~4h |
| Phase 5 — Language switcher | ~2h |
| Phase 6 — SEO | ~1h |
| Phase 7 — Admin translation workflow | ~5h |
| **Total** | **~20h** |

Translation work (actual Bengali copy) is separate and depends on content volume.
