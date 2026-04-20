/* empty css                                 */
import { c as createComponent, a as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CqgkFk_a.mjs';
import 'kleur/colors';
import { g as getCollection } from '../chunks/_astro_content_ZMj8EG3v.mjs';
import { $ as $$MainLayout } from '../chunks/MainLayout_AZj25lPk.mjs';
import { $ as $$ProjectCard } from '../chunks/ProjectCard_ClEBvcaw.mjs';
/* empty css                                    */
export { renderers } from '../renderers.mjs';

const $$Projects = createComponent(async ($$result, $$props, $$slots) => {
  const projects = await getCollection("projects");
  projects.sort((a, b) => (a.data.position || 0) - (b.data.position || 0));
  const mainProjects = projects.filter((p) => p.data.type !== "frontend");
  const frontendProjects = projects.filter((p) => p.data.type === "frontend");
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Projects \u2014 Fazley Rabbi", "data-astro-cid-aid3sr62": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="py-20" data-astro-cid-aid3sr62> <div class="max-w-6xl mx-auto px-6" data-astro-cid-aid3sr62> <div class="mb-14" data-astro-cid-aid3sr62> <span class="section-label" data-astro-cid-aid3sr62>Projects</span> <h1 class="font-display font-bold text-[clamp(2.5rem,6vw,4rem)] text-[var(--text-primary)] leading-tight" data-astro-cid-aid3sr62>Selected Work</h1> <p class="font-serif italic text-[1.2rem] text-[var(--text-secondary)] mt-4" data-astro-cid-aid3sr62>Selected work and experimental labs.</p> </div> <div class="project-grid" data-astro-cid-aid3sr62> ${mainProjects.map((p) => renderTemplate`${renderComponent($$result2, "ProjectCard", $$ProjectCard, { "project": p, "data-astro-cid-aid3sr62": true })}`)} </div> ${frontendProjects.length > 0 && renderTemplate`<div class="mt-24 pt-16 border-t border-[var(--border)]" data-astro-cid-aid3sr62> <div class="mb-10" data-astro-cid-aid3sr62> <span class="section-label" data-astro-cid-aid3sr62>More</span> <h2 class="font-display font-bold text-3xl text-[var(--text-primary)]" data-astro-cid-aid3sr62>Other Works & Experiments</h2> <p class="text-sm text-[var(--text-muted)] mt-2 font-mono uppercase tracking-widest" data-astro-cid-aid3sr62>Frontend experiments & templates.</p> </div> <div class="project-grid" data-astro-cid-aid3sr62> ${frontendProjects.map((p) => renderTemplate`${renderComponent($$result2, "ProjectCard", $$ProjectCard, { "project": p, "data-astro-cid-aid3sr62": true })}`)} </div> </div>`} </div> </main> ` })} `;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/projects.astro", void 0);

const $$file = "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/projects.astro";
const $$url = "/projects";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Projects,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
