/** What is actually measured, derived from build-time env. Used by the Privacy Policy. */
const provider = import.meta.env.PUBLIC_ANALYTICS_PROVIDER || 'none';

export const analyticsInUse = {
  cloudflare: Boolean(import.meta.env.PUBLIC_CF_BEACON_TOKEN) || import.meta.env.PUBLIC_CF_WEB_ANALYTICS === '1',
  plausible: provider === 'plausible' && Boolean(import.meta.env.PUBLIC_PLAUSIBLE_DOMAIN),
  zaraz: provider === 'zaraz',
  ga4: provider === 'ga4' && Boolean(import.meta.env.PUBLIC_GA4_ID),
};
