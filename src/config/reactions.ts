/**
 * Reaction buttons shown under every game (❤️ + quick stamps).
 * Shared by the page (src/components/Reactions.astro) and the API (functions/api/reactions.ts).
 * Changing an `id` resets its count; labels and emoji can change freely.
 */
import type { Localized } from './types';

export interface ReactionDef {
  id: string;
  emoji: string;
  label: Localized;
}

export const reactions = {
  /** Set to false to hide the buttons everywhere. */
  enabled: true,
  /** Counts are shown only once a button has at least this many presses (small numbers look empty). */
  showCountFrom: 10,
  items: [
    { id: 'like', emoji: '❤️', label: { en: 'Like', ja: 'いいね' } },
    { id: 'want', emoji: '🎮', label: { en: 'Want to play', ja: 'やってみたい' } },
    { id: 'fun', emoji: '✨', label: { en: 'Looks fun', ja: '面白そう' } },
    { id: 'played', emoji: '✅', label: { en: 'Played it', ja: '遊んだよ' } },
    { id: 'sequel', emoji: '🙏', label: { en: 'Want a sequel', ja: '続編希望' } },
  ] satisfies ReactionDef[],
};

export const reactionIds = reactions.items.map((r) => r.id);
