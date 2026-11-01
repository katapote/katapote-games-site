interface ImportMetaEnv {
  readonly PUBLIC_CF_BEACON_TOKEN?: string;
  readonly PUBLIC_ANALYTICS_PROVIDER?: 'none' | 'plausible' | 'zaraz' | 'ga4';
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly PUBLIC_PLAUSIBLE_SRC?: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_CF_WEB_ANALYTICS?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
