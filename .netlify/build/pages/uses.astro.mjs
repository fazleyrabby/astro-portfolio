/* empty css                                 */
import { c as createComponent, m as maybeRenderHead, u as unescapeHTML, r as renderTemplate, a as renderComponent } from '../chunks/astro/server_CqgkFk_a.mjs';
import 'kleur/colors';
import { $ as $$MainLayout } from '../chunks/MainLayout_AZj25lPk.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

const html = () => "<h1 id=\"things-i-use\">Things I Use</h1>\n<p>This is my current developer setup — the tools, hardware, and workflow I use for building Laravel applications, REST APIs, and backend systems.</p>\n<p>Some of the links below may be affiliate links — I only recommend tools I actually use.</p>\n<hr>\n<h2 id=\"core-stack\">Core Stack</h2>\n<p>My work is primarily focused on backend systems and SaaS applications:</p>\n<ul>\n<li>Laravel + PHP</li>\n<li>MySQL</li>\n<li>Docker</li>\n<li>REST APIs</li>\n<li>Linux / VPS environments</li>\n</ul>\n<hr>\n<h2 id=\"editor\">Editor</h2>\n<p>I keep my editor setup minimal and fast for backend-heavy workflows.</p>\n<ul>\n<li>\n<p><strong>Visual Studio Code</strong> – My primary editor for daily development</p>\n</li>\n<li>\n<p><strong>Antigravity</strong> – AI-assisted coding</p>\n</li>\n<li>\n<p><strong>PhpStorm</strong> – Used for large Laravel codebases and deep debugging</p>\n</li>\n<li>\n<p>Theme: Monochrome (GitHub Edition)</p>\n</li>\n<li>\n<p>Fonts:</p>\n<ul>\n<li>Annotation Mono (current)</li>\n<li>Fira Code</li>\n</ul>\n</li>\n</ul>\n<hr>\n<h2 id=\"tools\">Tools</h2>\n<p>These are the tools I use daily for development, debugging, and collaboration.</p>\n<ul>\n<li>\n<p><strong>Herd, Docker</strong> – Local development environments (Docker keeps everything consistent with production)<br>\n→ If you’re working with Laravel, Docker is worth learning early.</p>\n</li>\n<li>\n<p><strong>Chrome (primary), Zen Browser (experimental)</strong> – Browsing and testing</p>\n</li>\n<li>\n<p><strong>ClickUp</strong> – Project and task management</p>\n</li>\n<li>\n<p><strong>Discord</strong> – Dev team communication</p>\n</li>\n<li>\n<p><strong>Slack</strong> – Office communication</p>\n</li>\n<li>\n<p><strong>Postman</strong> – API testing and debugging</p>\n</li>\n<li>\n<p><strong>Sequel Ace, DBeaver</strong> – Database management</p>\n</li>\n<li>\n<p><strong>CleanShot X</strong> – Screenshots and quick recordings</p>\n</li>\n<li>\n<p><strong>Apple Notes</strong> – Quick notes and lightweight documentation</p>\n</li>\n</ul>\n<hr>\n<h2 id=\"terminal\">Terminal</h2>\n<p>My terminal setup is focused on speed and simplicity.</p>\n<ul>\n<li><strong>iTerm2</strong> – Stable and reliable terminal</li>\n<li><strong>Warp</strong> – Modern terminal with better UX (used occasionally)</li>\n<li><strong>Zsh + Oh My Zsh (<code>bira</code> theme)</strong> – Shell environment</li>\n</ul>\n<hr>\n<h2 id=\"setup\">Setup</h2>\n<h3 id=\"primary-macos\">Primary (macOS)</h3>\n<p>My main development machine for all backend work.</p>\n<ul>\n<li><strong>Apple MacBook Pro M1 14”</strong> – 16GB RAM, 512GB SSD</li>\n<li><strong>LG 32UN650</strong> – 32” 4K Monitor</li>\n<li><strong>Rapoo Optical Mouse</strong> – Mouse</li>\n<li><strong>Rapoo E9050L</strong> – Wireless Keyboard</li>\n<li><strong>Orico USB-C Hub</strong> – (ORICO-TC4U-U3)</li>\n<li><strong>Transcend 1TB Portable SSD</strong> – (TS1TESD370C)</li>\n<li><strong>Adata A680 1TB Portable HDD</strong> – (AHD680-1TU31-CBK)</li>\n<li><strong>OnePlus Bullets Z2</strong> – Wireless Neckband</li>\n<li><strong>Orico Laptop Stand</strong></li>\n</ul>\n<hr>\n<h3 id=\"secondary-light-gaming--testing\">Secondary (Light Gaming / Testing)</h3>\n<p>Used for testing environments and occasional gaming.</p>\n<ul>\n<li><strong>ViewSonic VX2276-shd</strong> – 22” IPS Monitor</li>\n<li><strong>AMD Ryzen 5 8600G</strong> – RDNA3 760M iGPU</li>\n<li><strong>G.SKILL S5 32GB DDR5</strong> – 5200MHz RAM</li>\n<li><strong>256GB NVMe SSD</strong></li>\n<li><strong>512GB SATA SSD</strong></li>\n</ul>\n<hr>\n<h3 id=\"proxmox-homelab--vms\">Proxmox Homelab &#x26; VMs</h3>\n<p>Used for experimenting with infrastructure, containers, and backend setups.</p>\n<ul>\n<li><strong>Lenovo ThinkPad T480</strong> – 256GB SSD, 8GB RAM</li>\n</ul>\n<hr>\n<h3 id=\"virtualization\">Virtualization</h3>\n<p>I use virtualization heavily for testing and running isolated environments.</p>\n<ul>\n<li><strong>VMware Fusion Pro</strong> (macOS)</li>\n<li><strong>VMware Workstation</strong> (Secondary setup)</li>\n<li><strong>Proxmox</strong> – Homelab and containerized workloads</li>\n</ul>\n<hr>\n<h2 id=\"workflow-philosophy\">Workflow Philosophy</h2>\n<p>I prefer simple, fast, and production-aligned tools.</p>\n<p>Most of my setup is optimized for:</p>\n<ul>\n<li>Backend development (Laravel, APIs)</li>\n<li>Consistent environments (Docker)</li>\n<li>Real-world testing (VMs, homelab)</li>\n</ul>\n<p>I avoid overcomplicated setups — if something slows me down, I replace it.</p>\n<hr>\n<h2 id=\"currently-exploring\">Currently Exploring</h2>\n<ul>\n<li>Dockerized Laravel workflows</li>\n<li>API performance optimization</li>\n<li>Homelab setups with Proxmox</li>\n</ul>\n<hr>\n<blockquote>\n<p>Note: I primarily use macOS and experiment on Linux and Windows.</p>\n</blockquote>";

				const frontmatter = {};
				const file = "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/content/uses.md";
				const url = undefined;

				const Content = createComponent((result, _props, slots) => {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;

					return renderTemplate`${maybeRenderHead()}${unescapeHTML(html())}`;
				});

const $$Uses = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Uses" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="max-w-3xl mx-auto px-6 py-20"> <div class="mb-14"> <span class="section-label">Uses</span> <h1 class="font-display font-bold text-[clamp(2.5rem,6vw,4rem)] text-[var(--text-primary)] leading-tight">Uses</h1> <p class="font-serif italic text-[1.2rem] text-[var(--text-secondary)] mt-4">Tools & setup I use for my daily work.</p> </div> <article class="prose prose-neutral dark:prose-invert w-full max-w-none prose-p:text-[var(--text-secondary)] prose-p:leading-[1.8] prose-li:text-[var(--text-secondary)] prose-headings:font-display prose-headings:font-bold prose-headings:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-strong:font-semibold"> ${renderComponent($$result2, "UsesMarkdown", Content, {})} </article> </main> ` })}`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/uses.astro", void 0);

const $$file = "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/uses.astro";
const $$url = "/uses";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Uses,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
