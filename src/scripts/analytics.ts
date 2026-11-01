/**
 * Tiny provider-agnostic analytics layer (no dependencies, ~2 KB).
 *
 * - Links opt in with `data-track="<event>"`. Clicks are observed passively:
 *   we never call preventDefault, so navigation works even if tracking fails.
 * - UTM parameters and the referrer are captured on the first page of a
 *   session (first touch) and attached to every event as `traffic_source`
 *   and `utm_*` props. Nothing personal is collected.
 * - Each event is sent at most once per session per key (page path for
 *   page_view, event name for clicks) to avoid duplicates.
 * - Every event is also pushed to `window.kgEvents`. Add `?kg_debug=1` to any
 *   URL to log events to the console (persists for the tab session).
 */
import type { TrackEvent } from '../config/types';

type Props = Record<string, string>;
type Provider = 'none' | 'plausible' | 'zaraz' | 'ga4';

declare global {
  interface Window {
    kgEvents?: { name: string; props: Props; sent: boolean }[];
    kgTrack?: (name: TrackEvent, props?: Props) => void;
    plausible?: ((event: string, options?: { props?: Props }) => void) & { q?: unknown[] };
    zaraz?: { track: (name: string, props?: Props) => void };
    gtag?: (...args: unknown[]) => void;
  }
}

const PROVIDER = (import.meta.env.PUBLIC_ANALYTICS_PROVIDER || 'none') as Provider;
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const ATTR_KEY = 'kg_attr';
const SENT_KEY = 'kg_sent';
const DEBUG_KEY = 'kg_debug';

const memory: Record<string, string> = {};
const store = {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return memory[key] ?? null;
    }
  },
  set(key: string, value: string) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      memory[key] = value;
    }
  },
};

const params = new URLSearchParams(location.search);
if (params.get(DEBUG_KEY) === '1') store.set(DEBUG_KEY, '1');
const debug = store.get(DEBUG_KEY) === '1';

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** Classify where the visit came from. Only coarse labels, no full URLs. */
function classify(utm: Props, referrerHost: string): string {
  const src = (utm.utm_source || '').toLowerCase();
  const isX = src === 'x' || src === 'twitter' || ['t.co', 'x.com', 'twitter.com', 'mobile.twitter.com'].includes(referrerHost);
  if (isX) {
    const tag = `${utm.utm_medium || ''} ${utm.utm_campaign || ''} ${utm.utm_content || ''}`.toLowerCase();
    return tag.includes('profile') ? 'x_profile' : 'x';
  }
  if (src) return src;
  if (referrerHost && referrerHost !== location.hostname) return referrerHost;
  return 'direct';
}

function attribution(): Props {
  const saved = store.get(ATTR_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as Props;
    } catch {
      /* fall through and recompute */
    }
  }
  const utm: Props = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) utm[k] = v.slice(0, 100);
  }
  const attr: Props = { ...utm, traffic_source: classify(utm, hostOf(document.referrer)) };
  store.set(ATTR_KEY, JSON.stringify(attr));
  return attr;
}

const attr = attribution();

function alreadySent(key: string): boolean {
  let sent: string[] = [];
  try {
    sent = JSON.parse(store.get(SENT_KEY) || '[]') as string[];
  } catch {
    sent = [];
  }
  if (sent.includes(key)) return true;
  sent.push(key);
  store.set(SENT_KEY, JSON.stringify(sent.slice(-50)));
  return false;
}

function send(name: TrackEvent, props: Props) {
  switch (PROVIDER) {
    case 'plausible':
      window.plausible?.(name === 'page_view' ? 'pageview' : name, { props });
      break;
    case 'zaraz':
      // Zaraz records page views itself; only forward custom events.
      if (name !== 'page_view') window.zaraz?.track(name, props);
      break;
    case 'ga4':
      window.gtag?.('event', name, { ...props, transport_type: 'beacon' });
      break;
    default:
      break;
  }
}

export function track(name: TrackEvent, extra: Props = {}, dedupeKey: string = name) {
  try {
    const props: Props = {
      ...attr,
      lang: document.documentElement.lang || 'en',
      path: location.pathname,
      ...extra,
    };
    const duplicate = alreadySent(`${name}|${dedupeKey}`);
    (window.kgEvents ||= []).push({ name, props, sent: !duplicate });
    if (debug) console.info('[kg-analytics]', duplicate ? 'skipped (duplicate)' : 'sent', name, props, `provider=${PROVIDER}`);
    if (!duplicate) send(name, props);
  } catch (err) {
    if (debug) console.warn('[kg-analytics] failed', err);
  }
}

window.kgTrack = track;

track('page_view', {}, location.pathname);

document.addEventListener(
  'click',
  (e) => {
    const target = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-track]') : null;
    if (!target) return;
    const name = target.dataset.track as TrackEvent;
    const extra: Props = {};
    if (target.dataset.trackLocation) extra.location = target.dataset.trackLocation;
    if (name === 'language_switch') {
      extra.from = document.documentElement.lang;
      extra.to = target.dataset.trackTo || '';
      try {
        localStorage.setItem('kg_lang', extra.to);
      } catch {
        /* storage blocked: preference just isn't remembered */
      }
    }
    // Language switches may happen repeatedly; dedupe per direction.
    const key = name === 'language_switch' ? `${name}:${extra.to}` : name;
    track(name, extra, key);
  },
  { capture: true, passive: true },
);
