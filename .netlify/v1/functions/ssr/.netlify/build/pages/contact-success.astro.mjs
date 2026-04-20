/* empty css                                 */
import { c as createComponent, a as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CqgkFk_a.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_AZj25lPk.mjs';
export { renderers } from '../renderers.mjs';

const $$ContactSuccess = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Message Sent \u2014 Fazley Rabbi" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-[60vh] flex items-center justify-center"> <div class="text-center px-6"> <span class="section-label">Contact</span> <h1 class="font-display font-bold text-[clamp(2rem,5vw,3rem)] text-[var(--text-primary)] leading-tight mb-4">
Message received.
</h1> <p class="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
Thanks for reaching out — I'll get back to you as soon as possible.
</p> <a href="/" class="btn-ghost">Back to home</a> </div> </main> ` })}`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/contact-success.astro", void 0);

const $$file = "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/contact-success.astro";
const $$url = "/contact-success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ContactSuccess,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
