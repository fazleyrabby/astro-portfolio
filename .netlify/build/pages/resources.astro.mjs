/* empty css                                 */
import { c as createComponent, a as renderComponent, r as renderTemplate, m as maybeRenderHead, e as addAttribute } from '../chunks/astro/server_CqgkFk_a.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_AZj25lPk.mjs';
import { g as getCollection } from '../chunks/_astro_content_ZMj8EG3v.mjs';
export { renderers } from '../renderers.mjs';

const $$Resources = createComponent(async ($$result, $$props, $$slots) => {
  const allResources = await getCollection("resources");
  const sections = [
    { id: "php-laravel", title: "PHP & Laravel" },
    { id: "blogs-articles", title: "Blogs & Articles" },
    { id: "portfolios", title: "Portfolio & UI Inspirations" },
    { id: "javascript", title: "JavaScript" },
    { id: "youtube-tutorials", title: "Youtube & Tutorials" },
    { id: "miscellaneous", title: "Miscellaneous" }
  ];
  const getResources = (id) => allResources.find((r) => r.id === id)?.data || [];
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Resources" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-6xl mx-auto px-6 py-20"> <div class="mb-14"> <span class="section-label">Resources</span> <h1 class="font-display font-bold text-[clamp(2.5rem,6vw,4rem)] text-[var(--text-primary)] leading-tight">Resources</h1> <p class="font-serif italic text-[1.2rem] text-[var(--text-secondary)] mt-4">A curated collection of helpful resources and inspirations</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> ${sections.map((section) => renderTemplate`<div class="card rounded p-6"> <h2 class="font-serif font-bold text-xl text-[var(--text-primary)] mb-5">${section.title}</h2> <ol class="list-decimal pl-5 space-y-2"> ${getResources(section.id).map((item) => renderTemplate`<li> <a${addAttribute(item.link, "href")} target="_blank" class="text-[var(--accent)] hover:opacity-80 transition-opacity"> ${item.text} </a> </li>`)} </ol> </div>`)} </div> </main> ` })}`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/resources.astro", void 0);

const $$file = "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/resources.astro";
const $$url = "/resources";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Resources,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
