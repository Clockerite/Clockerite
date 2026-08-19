import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: "https://clockerite.com",
  vite: {
    plugins: [tailwindcss()],
  },
});
