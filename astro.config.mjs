import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import rehypeSlug from "rehype-slug";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://fazleyrabbi.xyz",

  output: "server",

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  integrations: [
    tailwind(),
    sitemap(),
  ],

  image: {
    service: {
      entrypoint: "@astrojs/vercel/image-service",
    },
  },

  markdown: {
    rehypePlugins: [rehypeSlug],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "nord",
      },
    },
  },
});