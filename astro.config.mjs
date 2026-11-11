// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Public URL of the deployed site (used for canonical, hreflang, OGP, sitemap).
// Set SITE_URL in Cloudflare Pages → Settings → Environment variables.
const SITE_URL = process.env.SITE_URL || 'https://katapote-games.example';
if (!process.env.SITE_URL) {
  console.warn('[site] SITE_URL is not set. Using placeholder', SITE_URL);
}

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ja',
        locales: { ja: 'ja', en: 'en' },
      },
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
