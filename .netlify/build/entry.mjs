import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CvSoi7hX.mjs';
import { manifest } from './manifest_BQy29el1.mjs';
import { createExports } from '@astrojs/netlify/ssr-function.js';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/api/bot.astro.mjs');
const _page3 = () => import('./pages/api/contact.astro.mjs');
const _page4 = () => import('./pages/api/image-proxy.astro.mjs');
const _page5 = () => import('./pages/api/telegram-webhook.astro.mjs');
const _page6 = () => import('./pages/api/track.astro.mjs');
const _page7 = () => import('./pages/contact-success.astro.mjs');
const _page8 = () => import('./pages/gallery.astro.mjs');
const _page9 = () => import('./pages/posts/_slug_.astro.mjs');
const _page10 = () => import('./pages/posts.astro.mjs');
const _page11 = () => import('./pages/projects.astro.mjs');
const _page12 = () => import('./pages/resources.astro.mjs');
const _page13 = () => import('./pages/resume.astro.mjs');
const _page14 = () => import('./pages/uses.astro.mjs');
const _page15 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.13.5_@netlify+blobs@10.7.2_@types+node@25.5.0_jiti@1.21.7_rollup@4.59.0_typescript@5.9.3_yaml@2.8.2/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/api/bot.js", _page2],
    ["src/pages/api/contact.ts", _page3],
    ["src/pages/api/image-proxy.ts", _page4],
    ["src/pages/api/telegram-webhook.ts", _page5],
    ["src/pages/api/track.ts", _page6],
    ["src/pages/contact-success.astro", _page7],
    ["src/pages/gallery.astro", _page8],
    ["src/pages/posts/[slug].astro", _page9],
    ["src/pages/posts/index.astro", _page10],
    ["src/pages/projects.astro", _page11],
    ["src/pages/resources.astro", _page12],
    ["src/pages/resume.astro", _page13],
    ["src/pages/uses.astro", _page14],
    ["src/pages/index.astro", _page15]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "b02a7a33-fef0-4ab5-be25-ea9c8269eaf6"
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
