import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dmighty007.github.io',
  integrations: [sitemap()],
  compressHTML: true,
});
