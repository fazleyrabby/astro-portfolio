import { defineConfig, passthroughImageService } from "astro/config";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";
import rehypeSlug from "rehype-slug";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://fazleyrabbi.xyz",
  output: "server",
  adapter: netlify(),
  integrations: [tailwind(), sitemap()],

  image: {
    service: passthroughImageService(),
  },

  markdown: {
    rehypePlugins: [rehypeSlug],
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "nord",
      },
    },
  }
});