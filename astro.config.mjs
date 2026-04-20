import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";

export default defineConfig({
  site: "https://fazleyrabbi.xyz",

  // 🔥 Static build (no SSR, no adapter needed)
  output: "static",

  integrations: [
    tailwind(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
    }),
  ],

  // ✅ Optional: basic image config (safe for static)
  image: {
    domains: ["fazleyrabbi.xyz"],
  },

  markdown: {
    rehypePlugins: [rehypeSlug],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "nord",
      },
      wrap: true, // prevents long code overflow
    },
  },

  // ⚡ Minor performance optimization
  build: {
    inlineStylesheets: "auto",
  },

  // ⚡ Dev + preview consistency
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});