import { b as createAstro, c as createComponent, r as renderTemplate, i as renderHead, a as renderComponent, e as addAttribute, F as Fragment, m as maybeRenderHead, d as renderScript, s as spreadAttributes, j as renderSlot } from './astro/server_CqgkFk_a.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                         */

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1, _b, _c;
const $$Astro$2 = createAstro("https://fazleyrabbi.xyz");
const $$Head = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Head;
  const { title, description, ogTitle, ogDescription, ogImage, ogUrl, ogType, twitterCard, twitterImage } = Astro2.props;
  const defaultTitle = "Fazley Rabbi — Laravel & Backend Engineer";
  const defaultDesc = "Laravel and backend engineer specializing in SaaS platforms, REST APIs, and payment integrations. Based in Bangladesh, available globally.";
  const isProduction = process.env.NODE_ENV === "production";
  const umamiID = process.env.UMAMI_ID;
  return renderTemplate(_c || (_c = __template$1(['<head><meta charset="utf-8"><title>', '</title><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="generator"', '><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"><link rel="manifest" href="/site.webmanifest"><meta name="description"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:url"', '><meta property="og:type"', '><meta name="twitter:card"', '><meta name="twitter:image"', '><link rel="canonical"', '><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Yrsa:ital,wght@0,300..700;1,300..700&display=swap" rel="stylesheet">', "", '<script>\n      // 1. Dark mode (Always default to dark)\n      ;(function() {\n        var t = localStorage.getItem("color-mode");\n        if (!t) {\n          t = "dark";\n        }\n        if (t === "dark") {\n          document.documentElement.classList.add("dark");\n        } else {\n          document.documentElement.classList.remove("dark");\n        }\n      })();\n\n      // 2. Theme engine (data-theme attribute — additive)\n      ;(function() {\n        var saved = localStorage.getItem("data-theme");\n        if (saved && saved !== "sass") {\n          document.documentElement.setAttribute("data-theme", saved);\n        }\n      })();\n    </script>', "</head>"])), title ?? defaultTitle, addAttribute(Astro2.generator, "content"), addAttribute(description ?? defaultDesc, "content"), addAttribute(ogTitle ?? title ?? defaultTitle, "content"), addAttribute(ogDescription ?? description ?? defaultDesc, "content"), addAttribute(ogImage ?? "", "content"), addAttribute(ogUrl ?? `https://fazleyrabbi.xyz${Astro2.url.pathname}`, "content"), addAttribute(ogType ?? "website", "content"), addAttribute(twitterCard ?? "summary_large_image", "content"), addAttribute(twitterImage ?? "", "content"), addAttribute(ogUrl ?? `https://fazleyrabbi.xyz${Astro2.url.pathname}`, "href"), isProduction && renderTemplate(_a$1 || (_a$1 = __template$1(['<script async src="https://us.umami.is/script.js"', "></script>"])), addAttribute(umamiID, "data-website-id")), isProduction && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate(_b || (_b = __template$1([`<script async src="https://www.googletagmanager.com/gtag/js?id=G-0LV5YH8TE8"></script><script>
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-0LV5YH8TE8');
                </script>`]))) })}`, renderHead());
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/layouts/Head.astro", void 0);

const $$Nav = createComponent(($$result, $$props, $$slots) => {
  const navItems = [
    { href: "/#projects", label: "Work" },
    { href: "/posts/", label: "Blog" },
    { href: "/about/", label: "About" }
  ];
  return renderTemplate`${maybeRenderHead()}<header class="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-[var(--border)]" style="background: color-mix(in srgb, var(--bg-base) 85%, transparent);" data-astro-cid-cnu5gvpy> <nav class="max-w-6xl mx-auto px-6 py-4" data-astro-cid-cnu5gvpy> <div class="flex items-center justify-between" data-astro-cid-cnu5gvpy> <!-- Logo --> <a href="/" class="flex items-center gap-2 group" data-astro-cid-cnu5gvpy> <span class="text-xl text-[var(--text-primary)] font-display font-bold tracking-tight" data-astro-cid-cnu5gvpy>
Fazley<span class="text-[var(--accent)]" data-astro-cid-cnu5gvpy>.</span> </span> </a> <!-- Desktop Navigation --> <div class="hidden md:flex items-center gap-8" data-astro-cid-cnu5gvpy> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="nav-link-item text-[0.75rem] font-mono uppercase tracking-[0.08em] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors relative py-1" data-astro-cid-cnu5gvpy> ${item.label} </a>`)} <div class="flex items-center gap-2 ml-4 px-3 py-1.5 border border-[var(--border)] rounded-full bg-[var(--bg-surface)]" data-astro-cid-cnu5gvpy> <span class="avail-dot" data-astro-cid-cnu5gvpy></span> <span class="font-mono text-[0.7rem] text-[var(--text-muted)] uppercase tracking-wider" data-astro-cid-cnu5gvpy>Available</span> </div> <div class="ml-2 pl-4 border-l border-[var(--border)] flex items-center gap-2" data-astro-cid-cnu5gvpy> <!-- <ThemeIcon /> --> <select id="theme-select" class="theme-select font-mono text-[0.65rem] uppercase tracking-wider bg-transparent border border-[var(--border)] text-[var(--text-muted)] rounded px-2 py-1 cursor-pointer hover:border-[var(--accent)] transition-colors outline-none" aria-label="Select theme" data-astro-cid-cnu5gvpy> <option value="sass" data-astro-cid-cnu5gvpy>Sass</option> <option value="brutal" data-astro-cid-cnu5gvpy>Brutal</option> <option value="cyberpunk" data-astro-cid-cnu5gvpy>Cyber</option> <option value="nord" data-astro-cid-cnu5gvpy>Nord</option> </select> </div> </div> <!-- Mobile Menu Button --> <div class="flex md:hidden items-center gap-4" data-astro-cid-cnu5gvpy> <select id="theme-select-mobile" class="theme-select font-mono text-[0.65rem] uppercase tracking-wider bg-transparent border border-[var(--border)] text-[var(--text-muted)] rounded px-2 py-1 cursor-pointer hover:border-[var(--accent)] transition-colors outline-none" aria-label="Select theme" data-astro-cid-cnu5gvpy> <option value="sass" data-astro-cid-cnu5gvpy>Sass</option> <option value="brutal" data-astro-cid-cnu5gvpy>Brutal</option> <option value="cyberpunk" data-astro-cid-cnu5gvpy>Cyber</option> <option value="nord" data-astro-cid-cnu5gvpy>Nord</option> </select> <button id="mobile-menu-button" class="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)]" aria-label="Toggle menu" data-astro-cid-cnu5gvpy> <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-cnu5gvpy> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" data-astro-cid-cnu5gvpy></path> </svg> </button> </div> </div> <!-- Mobile Menu --> <div id="mobile-menu" class="hidden md:hidden mt-4 pb-4 space-y-4 border-t border-[var(--border)] pt-4" data-astro-cid-cnu5gvpy> ${navItems.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="block text-sm font-mono uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors" data-astro-cid-cnu5gvpy> ${item.label} </a>`)} <div class="pt-4 border-t border-[var(--border)]" data-astro-cid-cnu5gvpy> <div class="flex items-center gap-2 px-3 py-1.5 border border-[var(--border)] rounded-full bg-[var(--bg-surface)] w-fit" data-astro-cid-cnu5gvpy> <span class="avail-dot" data-astro-cid-cnu5gvpy></span> <span class="font-mono text-[0.7rem] text-[var(--text-muted)] uppercase tracking-wider" data-astro-cid-cnu5gvpy>Available</span> </div> </div> </div> </nav> </header>  ${renderScript($$result, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/layouts/Nav.astro?astro&type=script&index=0&lang.ts")} ${renderScript($$result, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/layouts/Nav.astro?astro&type=script&index=1&lang.ts")}`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/layouts/Nav.astro", void 0);

const $$Astro$1 = createAstro("https://fazleyrabbi.xyz");
const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Footer;
  const primaryNav = [
    { href: "/", label: "Home" },
    { href: "/#projects", label: "Work" },
    { href: "/posts", label: "Blog" },
    { href: "/about", label: "About" }
  ];
  const secondaryNav = [
    { href: "/uses", label: "Uses" },
    { href: "/gallery", label: "Gallery" },
    { href: "/resources", label: "Resources" },
    { href: "/resume", label: "Resume" },
    { href: "https://prompts.fazleyrabbi.xyz", label: "Prompts", external: true }
  ];
  return renderTemplate`${maybeRenderHead()}<footer class="py-12 border-t border-[var(--border)] bg-[var(--bg-base)]"> <div class="max-w-6xl mx-auto px-6"> <div class="footer-grid grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 relative"> <!-- Left Side: Brand & Tagline --> <div class="footer-left md:col-span-6 relative"> <div class="footer-watermark font-display font-bold text-[clamp(2.5rem,8vw,6rem)] text-white/[0.03] dark:text-white/[0.02] leading-none absolute -top-6 -left-2 pointer-events-none select-none">
Fazley Rabbi
</div> <div class="relative z-10 pt-6"> <h3 class="font-display font-bold text-2xl text-[var(--text-primary)] mb-4">
Fazley<span class="text-[var(--accent)]">.</span> </h3> <p class="footer-tagline font-serif italic text-[1.1rem] text-[var(--text-secondary)] mb-4">
Building scalable systems, not just interfaces.
</p> <p class="text-[0.88rem] text-[var(--text-muted)] max-w-sm leading-relaxed">
Laravel & Backend Engineer specializing in SaaS platforms, REST APIs, and high-performance applications.
</p> </div> </div> <!-- Right Side: Split Navigation --> <div class="md:col-span-6 grid grid-cols-2 gap-8 md:justify-items-end"> <!-- Column 1: Main --> <nav class="footer-nav flex flex-col gap-3"> <span class="section-label mb-1">Navigation</span> <div class="flex flex-col gap-2"> ${primaryNav.map((item) => renderTemplate`<a${addAttribute(item.href, "href")} class="font-mono text-[0.68rem] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"> ${item.label} </a>`)} </div> </nav> <!-- Column 2: Explore --> <nav class="footer-nav flex flex-col gap-3"> <span class="section-label mb-1">Explore</span> <div class="flex flex-col gap-2"> ${secondaryNav.map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${spreadAttributes(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} class="font-mono text-[0.68rem] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"> ${item.label} </a>`)} </div> </nav> </div> </div> <!-- Bottom Bar --> <div class="footer-bottom border-t border-[var(--border)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4"> <div class="flex flex-wrap items-center justify-center gap-3 font-mono text-[0.62rem] text-[var(--text-muted)] uppercase tracking-widest"> <span>&copy; ${(/* @__PURE__ */ new Date()).getFullYear()}</span> <span class="text-[var(--accent)] opacity-50">·</span> <span>Powered by <a href="https://astro.build" target="_blank" class="hover:text-[var(--accent)] transition-colors">Astro</a></span> <span class="text-[var(--accent)] opacity-50">·</span> <span>Built with ❤ by <span class="text-[var(--text-secondary)]">Fazley Rabbi</span></span> </div> <div class="flex gap-5"> <a href="https://github.com/fazleyrabby" target="_blank" class="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors group"> <span class="sr-only">GitHub</span> <svg class="w-4 h-4 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg> </a> <a href="https://linkedin.com/in/fazley-rabby" target="_blank" class="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors group"> <span class="sr-only">LinkedIn</span> <svg class="w-4 h-4 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg> </a> </div> </div> </div> </footer>`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/layouts/Footer.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$ScrollToTop = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a || (_a = __template(["", `<div class="fixed bottom-6 right-6 z-50 flex gap-3"> <button id="toc-toggle-btn" class="hidden lg:hidden p-2.5 rounded-lg cursor-pointer bg-surface border border-border text-text hover:border-accent hover:text-accent transition-all items-center justify-center" aria-label="Toggle Table of Contents"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg> </button> <div onclick="scrollToTop()" class="p-2.5 rounded-lg cursor-pointer group scrollTop bg-surface border border-border text-[var(--text-secondary)] hover:border-accent hover:text-accent transition-all" style="display: none;"> <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform group-hover:-translate-y-0.5" viewBox="0 0 16 16"> <path fill="currentColor" fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"></path> </svg> </div> </div> <script>
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const toggleVisibility = () => {
        const showButtons = window.scrollY > 500;
        const tocBtn = document.getElementById('toc-toggle-btn');
        const scrollBtn = document.querySelector('.scrollTop');
        const hasToc = !!document.getElementById('toc-sidebar');
        if (tocBtn) tocBtn.style.display = showButtons && hasToc && window.innerWidth < 1024 ? 'flex' : 'none';
        if (scrollBtn) scrollBtn.style.display = showButtons ? 'block' : 'none';
    };

    const initTocToggle = () => {
        const tocBtn = document.getElementById('toc-toggle-btn');
        const sidebar = document.getElementById('toc-sidebar');
        if (!tocBtn || !sidebar || tocBtn.getAttribute('data-init') === 'true') return;
        tocBtn.setAttribute('data-init', 'true');

        tocBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = sidebar.classList.contains('toc-mobile-open');
            if (isOpen) {
                sidebar.style.display = '';
                sidebar.classList.remove('toc-mobile-open');
            } else {
                sidebar.style.setProperty('display', 'block', 'important');
                sidebar.classList.add('toc-mobile-open');
            }
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth < 1024 && sidebar.classList.contains('toc-mobile-open')) {
                if (!sidebar.contains(e.target) && !tocBtn.contains(e.target)) {
                    sidebar.style.display = '';
                    sidebar.classList.remove('toc-mobile-open');
                }
            }
        });
    };

    window.addEventListener("scroll", toggleVisibility);
    window.addEventListener("resize", toggleVisibility);

    document.addEventListener("astro:page-load", () => {
        toggleVisibility();
        initTocToggle();
    });

    document.addEventListener("DOMContentLoaded", initTocToggle);
    if (document.readyState !== 'loading') {
        initTocToggle();
    }
<\/script>`])), maybeRenderHead());
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/components/ScrollToTop.astro", void 0);

const $$Astro = createAstro("https://fazleyrabbi.xyz");
const $$MainLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$MainLayout;
  const { title, description, ogTitle, ogDescription, ogImage, ogUrl, ogType, twitterCard, twitterImage } = Astro2.props;
  return renderTemplate`<html lang="en"> ${renderComponent($$result, "Head", $$Head, { "title": title, "description": description, "ogTitle": ogTitle, "ogDescription": ogDescription, "ogImage": ogImage, "ogUrl": ogUrl, "ogType": ogType, "twitterCard": twitterCard, "twitterImage": twitterImage })}${maybeRenderHead()}<body class="font-sans min-h-screen relative overflow-x-hidden"> <div class="page-gradient-layer" aria-hidden="true"></div> <div class="cursor" aria-hidden="true"></div> ${renderComponent($$result, "Nav", $$Nav, {})} <div class="w-full relative z-10"> ${renderSlot($$result, $$slots["default"])} </div> ${renderComponent($$result, "Footer", $$Footer, {})} ${renderComponent($$result, "ScrollToTop", $$ScrollToTop, {})} ${renderScript($$result, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/layouts/MainLayout.astro?astro&type=script&index=0&lang.ts")} ${renderScript($$result, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/layouts/MainLayout.astro?astro&type=script&index=1&lang.ts")} </body> </html>`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/layouts/MainLayout.astro", void 0);

export { $$MainLayout as $ };
