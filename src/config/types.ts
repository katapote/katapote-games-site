export type Locale = 'en' | 'ja';
/** Text that differs per language. `ja` falls back to `en` when omitted. */
export type Localized = { en: string; ja?: string };

export type GameStatus = 'playtest' | 'available' | 'coming-soon';

/** Event names the analytics layer accepts (see src/scripts/analytics.ts). */
export type TrackEvent = 'page_view' | 'language_switch' | `click_${string}`;

export interface StoreLink {
  /** Leave as null until the real URL exists — the button is hidden then. */
  url: string | null;
  /** Analytics event fired on click. */
  event?: TrackEvent;
}

export interface Feature {
  title: Localized;
  body: Localized;
  /** Path under src/assets/games/ (e.g. 'doodle-nightmare/feature-draw.png'). */
  image?: string;
  imageAlt?: Localized;
  /** Optional muted looping clip under public/ (e.g. '/media/doodle-nightmare/feature-draw.mp4'). `image` is its poster. */
  video?: string;
}

export interface Game {
  /** Stable id used in URLs/anchors. */
  id: string;
  title: Localized;
  /** One-line pitch shown on cards. */
  tagline: Localized;
  status: GameStatus;
  /** Lower comes first. */
  order: number;
  /** Featured title is shown in the hero. Exactly one should be true. */
  featured?: boolean;
  /** Path under src/assets/games/. Square PNG/JPG, 512px or larger. */
  icon?: string;
  appStore?: StoreLink;
  testFlight?: StoreLink;
  // ---- featured-only fields ----
  catchcopy?: Localized;
  description?: Localized;
  /** Path under src/assets/games/. 16:9, 1920×1080 recommended. */
  keyVisual?: string;
  keyVisualAlt?: Localized;
  gameplayVideo?: StoreLink;
  features?: Feature[];
  /** Optional preview shown on the card in "other games". `image` is under src/assets/games/, `video` under public/.
   *  On mouse devices the clip plays on hover; on touch devices while on screen. */
  preview?: {
    image: string;
    video?: string;
    /** 'contain' for portrait clips (shown whole on a dark background). Default 'cover'. */
    fit?: 'cover' | 'contain';
  };
}
