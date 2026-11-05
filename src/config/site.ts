/**
 * Brand, developer profile and social links.
 * Set a link's `url` to null (or remove the entry) to hide it everywhere.
 */
import type { Localized, TrackEvent } from './types';

export interface SocialLink {
  id: string;
  label: string;
  url: string | null;
  event?: TrackEvent;
  /** Show the icon in the header too (keep this to 1–2 links on mobile). */
  inHeader?: boolean;
}

export const site = {
  name: 'Katapote Games',
  /** Header logo: a 1–2 character mark plus a two-part wordmark (second part is drawn lighter). */
  brand: { mark: 'K', wordmark: 'KATAPOTE', wordmarkThin: ' GAMES' },
  /** Heading of the "other games" section. */
  worksHeading: { en: 'More from Katapote', ja: 'その他の作品' } satisfies Localized,
  /** Text on the 404 page. */
  notFoundBody: {
    en: 'This page drifted into the nightmare.',
    ja: 'このページは悪夢の中に消えてしまいました。',
  } satisfies Localized,
  defaultTitle: {
    en: 'Katapote Games — Doodle Nightmare & indie apps',
    ja: 'Katapote Games — Doodle Nightmare と個人開発アプリ',
  } satisfies Localized,
  description: {
    en: 'Indie games and apps by solo developer Katapote. Join the Doodle Nightmare playtest — a hand-drawn nightmare FPS where the weapons you draw shape how you fight.',
    ja: '個人開発者かたぽてのゲームとアプリ。描いた武器で戦い方が変わる手描きの悪夢FPS「Doodle Nightmare」のプレイテスト参加者を募集中。',
  } satisfies Localized,
  /** Path under /public. Regenerate from game art with `npm run og`. */
  ogImage: '/og/og-default.png',
  xHandle: '@potato05110813',
  /** Shown in footer only when set. e.g. 'mailto:you@example.com' or a form URL. */
  contactUrl: null as string | null,
  /** Optional footer link, e.g. to the template this site is built from. null hides it. */
  footerLink: {
    url: 'https://github.com/katapote/indie-game-site-template',
    label: { en: 'Free site template', ja: 'このサイトのテンプレート（無料）' },
  } as { url: string; label: Localized } | null,
  developer: {
    name: { en: 'Katapote', ja: 'かたぽて' } satisfies Localized,
    bio: {
      en: 'Solo indie developer building games and apps with a focus on playful ideas and unique experiences.',
      ja: '遊び心のあるアイデアと、ここでしか味わえない体験を大切に、ゲームとアプリをひとりで開発しています。',
    } satisfies Localized,
  },
};

export const socials: SocialLink[] = [
  {
    id: 'x',
    label: 'X',
    url: 'https://x.com/potato05110813',
    event: 'click_x_profile',
    inHeader: true,
  },
  { id: 'youtube', label: 'YouTube', url: null },
  { id: 'discord', label: 'Discord', url: null },
];

export const activeSocials = socials.filter(
  (s): s is SocialLink & { url: string } => typeof s.url === 'string' && s.url.length > 0,
);
