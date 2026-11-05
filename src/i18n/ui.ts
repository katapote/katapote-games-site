import type { Locale, Localized, GameStatus } from '../config/types';

export const locales: Locale[] = ['en', 'ja'];
export const defaultLocale: Locale = 'en';

export const ui = {
  en: {
    'nav.skip': 'Skip to content',
    'lang.label': 'Language',
    'lang.en': 'EN',
    'lang.ja': 'JP',
    'hero.eyebrow': 'Now in playtest',
    'cta.playtest': 'Join the Playtest',
    'cta.playtestNote': 'Free beta on Apple TestFlight. Opens in a new tab.',
    'cta.gameplay': 'Watch Gameplay',
    'cta.appstore': 'View on the App Store',
    'cta.storeSoon': 'Store link coming soon',
    'features.heading': 'How it plays',
    'about.heading': 'About the developer',
    'about.follow': 'Follow on',
    'status.playtest': 'Playtest open',
    'status.available': 'Available on the App Store',
    'status.coming-soon': 'Coming soon',
    'footer.privacy': 'Privacy Policy',
    'footer.contact': 'Contact',
    'placeholder.image': 'Image coming soon',
    'newTab': '(opens in a new tab)',
    'notfound.title': 'Page not found',
    'notfound.back': 'Back to home',
  },
  ja: {
    'nav.skip': '本文へスキップ',
    'lang.label': '言語',
    'lang.en': 'EN',
    'lang.ja': 'JP',
    'hero.eyebrow': 'プレイテスト実施中',
    'cta.playtest': 'プレイテストに参加する',
    'cta.playtestNote': 'Apple TestFlightで無料ベータに参加できます。新しいタブで開きます。',
    'cta.gameplay': 'プレイ動画を見る',
    'cta.appstore': 'App Storeで見る',
    'cta.storeSoon': 'ストアリンク準備中',
    'features.heading': 'ゲームの特徴',
    'about.heading': '開発者について',
    'about.follow': 'フォローする',
    'status.playtest': 'プレイテスト募集中',
    'status.available': 'App Storeで配信中',
    'status.coming-soon': '近日公開',
    'footer.privacy': 'プライバシーポリシー',
    'footer.contact': 'お問い合わせ',
    'placeholder.image': '画像準備中',
    'newTab': '（新しいタブで開きます）',
    'notfound.title': 'ページが見つかりません',
    'notfound.back': 'ホームへ戻る',
  },
} as const;

export type UiKey = keyof (typeof ui)['en'];

export function useT(locale: Locale) {
  return (key: UiKey): string => ui[locale][key] ?? ui.en[key];
}

export function l(text: Localized | undefined, locale: Locale): string {
  if (!text) return '';
  return (locale === 'ja' ? text.ja : undefined) ?? text.en;
}

export function statusLabel(status: GameStatus, locale: Locale) {
  return useT(locale)(`status.${status}` as UiKey);
}

/** '/privacy/' → '/ja/privacy/' etc. `path` is the locale-neutral path. */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean}`;
}
