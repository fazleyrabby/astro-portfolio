/* empty css                                 */
import { b as createAstro, c as createComponent, m as maybeRenderHead, s as spreadAttributes, r as renderTemplate, d as renderScript, a as renderComponent } from '../chunks/astro/server_CqgkFk_a.mjs';
import 'kleur/colors';
import { inferImageDimensions, transformProps, transformSourceProps } from '@unpic/core';
import { getProviderForUrl, transformUrl } from 'unpic';
import { getPixels } from '@unpic/pixels';
import { i as imageConfig } from '../chunks/_astro_assets_DgiDkRiI.mjs';
import { env } from 'node:process';
import 'clsx';
import { $ as $$MainLayout } from '../chunks/MainLayout_AZj25lPk.mjs';
import { v2 } from 'cloudinary';
export { renderers } from '../renderers.mjs';

const specialBackgrounds = ["blurhash", "dominantColor", "lqip"];
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
async function getBackground(props) {
  if (props.background === "none") {
    return;
  }
  if (!specialBackgrounds.includes(props.background ?? "")) {
    return props.background;
  }
  let aspectRatio = props.aspectRatio;
  if (!aspectRatio) {
    if (props.width && props.height) {
      aspectRatio = props.height / props.width;
    } else {
      aspectRatio = 1;
    }
  }
  const cdn = getProviderForUrl(props.src) ?? props.fallback;
  if (!cdn) {
    return;
  }
  const bgImgProps = {
    url: props.src,
    width: 12,
    height: 12 * aspectRatio,
    fallback: props.fallback,
    cdn
  };
  if (!cdn) {
    return;
  }
  if (props.background === "lqip") {
    const lowUrl2 = transformUrl(
      bgImgProps,
      props.operations,
      props.options
    )?.toString();
    if (!lowUrl2) {
      return;
    }
    if (!isValidUrl(lowUrl2)) {
      return;
    }
    const response = await fetch(lowUrl2, {
      headers: {
        Accept: "image/webp,*/*"
      }
    });
    const contentType = response.headers.get("Content-Type");
    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    return "data:" + contentType + ";base64," + buffer.toString("base64");
  }
  const lowUrl = transformUrl(
    {
      ...bgImgProps,
      width: 100,
      height: 100 * aspectRatio
    },
    props.operations,
    props.options
  )?.toString();
  if (!lowUrl) {
    return;
  }
  if (!isValidUrl(lowUrl)) {
    return;
  }
  const pixels = await getPixels(lowUrl);
  if (!pixels) {
    return;
  }
  const data = Uint8ClampedArray.from(pixels.data);
  const { blurhashToDataUri, rgbColorToCssString, getDominantColor } = await import('@unpic/placeholder');
  if (props.background === "blurhash") {
    const { encode } = await import('blurhash');
    const blurhash = encode(data, pixels.width, pixels.height, 4, 3);
    return blurhashToDataUri(blurhash);
  }
  if (props.background === "dominantColor") {
    return rgbColorToCssString(getDominantColor(data));
  }
}

function getDefaultService() {
  if (env.NETLIFY || env.NETLIFY_LOCAL || "Netlify" in globalThis) {
    return "netlify";
  }
  if (env.VERCEL || env.NOW_BUILDER) {
    return "vercel";
  }
  return "astro";
}

function getDefaultImageCdn(config) {
  if (config?.fallbackService === "squoosh" || config?.fallbackService === "sharp") {
    return "astro";
  }
  return config.fallbackService ?? getDefaultService();
}
function getEndpointOptions(imageConfig, options = {}) {
  options.astro ??= {};
  options.astro.endpoint = typeof imageConfig?.endpoint === "object" ? (
    // The astro types are wrong here
    imageConfig?.endpoint?.route
  ) : imageConfig?.endpoint;
  return options;
}

const $$Astro$2 = createAstro("https://fazleyrabbi.xyz");
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Image;
  const { placeholder, ...props } = Astro2.props;
  let imgProps;
  if (typeof props.src === "object") {
    imgProps = {
      ...props,
      src: props.src.src,
      ...inferImageDimensions(props, props.src)
    };
  } else {
    imgProps = {
      ...props
    };
  }
  const config = imageConfig.service?.config;
  imgProps.layout ||= config?.layout;
  imgProps.background ||= placeholder ?? config?.placeholder;
  imgProps.background = await getBackground(imgProps);
  if (!imgProps.cdn && !imgProps.fallback) {
    imgProps.fallback = getDefaultImageCdn(config);
  }
  if (imgProps.cdn === "astro" || imgProps.fallback === "astro") {
    imgProps.options = getEndpointOptions(imageConfig, imgProps.options);
  }
  return renderTemplate`${maybeRenderHead()}<img${spreadAttributes(transformProps(imgProps))}>`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/node_modules/.pnpm/@unpic+astro@1.0.2_astro@5.13.5_@netlify+blobs@10.7.2_@types+node@25.5.0_jiti@1.21.7_ro_7362e11b9ce60daea785073565d5f581/node_modules/@unpic/astro/components/Image.astro", void 0);

const $$Astro$1 = createAstro("https://fazleyrabbi.xyz");
const $$Source = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Source;
  const props = Astro2.props;
  let sourceProps;
  if (typeof props.src === "object") {
    sourceProps = {
      ...props,
      src: props.src.src,
      ...inferImageDimensions(props, props.src)
    };
  } else {
    sourceProps = props;
  }
  const config = imageConfig.service?.config;
  sourceProps.layout ||= config?.layout;
  if (!sourceProps.cdn && !sourceProps.fallback) {
    sourceProps.fallback = getDefaultImageCdn(config);
  }
  if (sourceProps.cdn === "astro" || sourceProps.fallback === "astro") {
    sourceProps.options = getEndpointOptions(imageConfig, sourceProps.options);
  }
  return renderTemplate`${maybeRenderHead()}<source${spreadAttributes(transformSourceProps(sourceProps))}>`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/node_modules/.pnpm/@unpic+astro@1.0.2_astro@5.13.5_@netlify+blobs@10.7.2_@types+node@25.5.0_jiti@1.21.7_ro_7362e11b9ce60daea785073565d5f581/node_modules/@unpic/astro/components/Source.astro", void 0);

const $$ImagePopup = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<div id="modal" tabindex="-1" aria-hidden="true" class="hidden overlay overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur-md bg-white/30"> <div class="relative w-full max-w-2xl max-h-full top-28 mx-auto"> <!-- Modal content --> <div class="relative bg-white rounded-lg shadow dark:bg-gray-700"> <!-- Modal header --> <button type="button" class="close-btn bg-black absolute opacity-70 hover:opacity-100 right-2 top-2 sm:-right-4 sm:-top-4 text-white hover:text-gray-200 rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-hide="modal"> <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"> <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"></path> </svg> <span class="sr-only">Close modal</span> </button> <div class="image-show bg-slate-500"></div> </div> </div> </div> ${renderScript($$result, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/components/ImagePopup.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/components/ImagePopup.astro", void 0);

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": true, "MODE": "production", "PROD": false, "SITE": "https://fazleyrabbi.xyz", "SSR": true};
const $$Astro = createAstro("https://fazleyrabbi.xyz");
const $$Gallery = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Gallery;
  Astro2.response.headers.set("Cache-Control", "max-age=604800");
  const env = Object.assign(__vite_import_meta_env__, { CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME });
  v2.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true
  });
  const images = await v2.search.expression("folder:photography*").sort_by("uploaded_at", "desc").max_results(15).execute();
  return renderTemplate`${renderComponent($$result, "MainLayout", $$MainLayout, { "title": "Photography" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto px-4 md:px-8 py-8"> <p class="text-sm text-[var(--text-secondary)] text-center mb-8 leading-relaxed">
Some random shots I have taken on various trips. Mostly using my smart phone!
</p> <div class="grid grid-cols-2 md:grid-cols-3 gap-4"> ${images.total_count > 0 && images.resources.map((img) => renderTemplate`<div class="group relative overflow-hidden bg-[var(--bg-card)] aspect-square border border-[var(--border)]"> ${renderComponent($$result2, "Image", $$Image, { "height": 400, "width": 400, "loading": "lazy", "layout": "fullWidth", "class": "w-full h-full object-cover cursor-pointer transition-transform duration-300", "data-img": img.secure_url, "src": img.secure_url, "alt": "Photography" })} </div>`)} </div> ${renderComponent($$result2, "ImagePopup", $$ImagePopup, {})} <p class="text-[0.7rem] text-[var(--text-muted)] text-center mt-6">
(These images are hosted on Cloudinary)
</p> </main> ` })}`;
}, "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/gallery.astro", void 0);
const $$file = "/Users/rabbi/Desktop/Projects/Sites/astro-portfolio/src/pages/gallery.astro";
const $$url = "/gallery";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Gallery,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
