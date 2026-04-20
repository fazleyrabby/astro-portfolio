/* empty css                                 */
import { c as createComponent, a as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CqgkFk_a.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_AZj25lPk.mjs';
export { renderers } from '../renderers.mjs';

const $$Resume = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Resume" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-6xl mx-auto px-6 py-20"> <div class="mb-14"> <span class="section-label">Resume</span> <h1 class="font-display font-bold text-[clamp(2.5rem,6vw,4rem)] text-[var(--text-primary)] leading-tight">My Professional CV</h1> <p class="font-serif italic text-[1.2rem] text-[var(--text-secondary)] mt-4">Download my resume for my full professional background and skills.</p> </div> <div class="card p-4 rounded"> <object type="application/pdf" data="/cv.pdf" width="100%" height="1000px"> <p class="text-[var(--text-secondary)] text-center py-10">
Your web browser doesn't have a PDF plugin.<br>
You can <a href="/cv.pdf" download="fazley_rabbi_resume.pdf" class="text-[var(--accent)] underline">click here</a> to download the PDF file.
</p> </object> </div> </main> ` })}`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/resume.astro", void 0);

const $$file = "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/resume.astro";
const $$url = "/resume";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Resume,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
