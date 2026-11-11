/**
 * All titles shown on the site live here.
 * To add a new game: append an object to `games` — no component changes needed.
 *
 * Images: drop files into src/assets/games/<id>/ and reference them by path
 * relative to src/assets/games/. Missing files render as a labeled placeholder.
 * URLs: keep `null` until the real link exists; null links are not rendered.
 */
import type { Game } from './types';

export const games: Game[] = [
  {
    id: 'doodle-nightmare',
    order: 2,
    status: 'available',
    title: { en: 'Doodle Nightmare', ja: 'らくがきナイトメア' },
    tagline: {
      en: 'A hand-drawn nightmare FPS.',
      ja: '手描きの悪夢FPS。',
    },
    catchcopy: {
      en: 'Draw weapons. Shape their stats. Fight nightmares.',
      ja: '武器を描け。性能を形づくれ。悪夢と戦え。',
    },
    description: {
      en: 'A hand-drawn nightmare FPS where the weapons you create shape how you fight.',
      ja: '自分で描いた武器が、戦い方を変える。手描きの悪夢を舞台にしたFPS。',
    },
    keyVisual: 'doodle-nightmare/key-visual.png',
    keyVisualAlt: {
      en: 'Doodle Nightmare title screen',
      ja: 'らくがきナイトメア のタイトル画面',
    },
    icon: 'doodle-nightmare/icon.png',
    preview: {
      image: 'doodle-nightmare/key-visual.png',
      video: '/media/doodle-nightmare/feature-fight.mp4',
    },
    appStore: {
      url: 'https://apps.apple.com/app/id6823218981',
      event: 'click_doodle_appstore',
    },
    testFlight: {
      url: 'https://testflight.apple.com/join/TnMhNcF6',
      event: 'click_doodle_testflight',
    },
    // Set to a YouTube (or other) URL to show the "Watch Gameplay" button.
    gameplayVideo: { url: null, event: 'click_doodle_gameplay' },
    features: [
      {
        title: { en: 'Draw Your Weapons', ja: '武器を描く' },
        body: {
          en: 'Sketch your own weapon right on the screen.',
          ja: '自分の武器を、画面に直接描いてつくる。',
        },
        image: 'doodle-nightmare/feature-draw.png',
        video: '/media/doodle-nightmare/feature-draw.mp4',
        imageAlt: { en: 'Drawing a weapon', ja: '武器を描いている画面' },
      },
      {
        title: { en: 'Shape Their Stats', ja: '形で性能が決まる' },
        body: {
          en: 'The shape you draw changes how the weapon performs.',
          ja: '描いた形によって、武器の性能が変わる。',
        },
        image: 'doodle-nightmare/feature-stats.png',
        video: '/media/doodle-nightmare/feature-stats-v2.mp4',
        imageAlt: { en: 'Weapon stats and upgrade screen', ja: '武器の性能と強化の画面' },
      },
      {
        title: { en: 'Fight Nightmares', ja: '悪夢と戦う' },
        body: {
          en: 'Battle through a hand-drawn nightmare world.',
          ja: '手描きの悪夢の世界で戦い抜く。',
        },
        image: 'doodle-nightmare/feature-fight.png',
        video: '/media/doodle-nightmare/feature-fight.mp4',
        imageAlt: { en: 'Fighting nightmares in a hand-drawn corridor', ja: '手描きの廊下で悪夢と戦う画面' },
      },
    ],
  },
  {
    id: 'omoidase',
    order: 4,
    status: 'available',
    title: { en: 'Omoidase' },
    tagline: {
      en: 'Find what you saved — even from a half-remembered word.',
      ja: '「あれ何だっけ」から見つかる。',
    },
    icon: 'omoidase/icon.png',
    appStore: {
      url: 'https://apps.apple.com/app/id6789476021',
      event: 'click_omoidase_appstore',
    },
  },
  {
    id: 'bou-no-ichizoku',
    featured: true,
    order: 1,
    status: 'available',
    title: { en: 'Bou no Ichizoku', ja: 'ぼうの一族' },
    tagline: {
      en: 'A stick-figure idle RPG.',
      ja: '棒人間の放置育成RPG。',
    },
    catchcopy: {
      en: 'How you play shapes who your stick figure becomes.',
      ja: 'あなたの生活が、ボウの姿になる。',
    },
    description: {
      en: 'A stick-figure idle RPG. When and how you play decides which of 11 forms your Bou evolves into. Rebirth and clones carry your clan forward — and it keeps growing while the app is closed. (Japanese only)',
      ja: '遊ぶ時間帯や遊び方で、11の姿に進化する棒人間の放置育成RPG。転生と分身で一族をつなぎ、閉じている間も育ち続ける。',
    },
    keyVisual: 'bou-no-ichizoku/key-visual.jpg',
    keyVisualAlt: {
      en: 'Bou no Ichizoku App Store screenshots',
      ja: 'ぼうの一族 の画面',
    },
    features: [
      {
        title: { en: '11 forms, decided by how you play', ja: '遊び方で、11の姿に' },
        body: {
          en: 'Morning or night, training or battle — your habits decide the evolution.',
          ja: '朝に遊ぶか夜に遊ぶか、修行か戦いか。あなたの遊び方で進化が決まる。',
        },
        image: 'bou-no-ichizoku/feature-evolve.jpg',
        imageAlt: { en: 'Evolution screens', ja: '進化の画面' },
      },
      {
        title: { en: 'Rebirth and clones', ja: '転生と分身で、一族が強くなる' },
        body: {
          en: 'Power and skills pass to the next life. One day, a clone may surpass you.',
          ja: '転生すると力と技が次の命へ。一緒に戦う分身は、いつか自分を超える。',
        },
        image: 'bou-no-ichizoku/feature-lineage.jpg',
        imageAlt: { en: 'Family tree and clone screens', ja: '系譜と分身の画面' },
      },
      {
        title: { en: 'Grows while closed', ja: '閉じていても、育っている' },
        body: {
          en: 'Training continues while you are away. Master duels are won by your own timing.',
          ja: '修行も戦いも、放置のあいだに進む。師範戦だけは、自分の手で見切る。',
        },
        image: 'bou-no-ichizoku/feature-idle.jpg',
        imageAlt: { en: 'Idle rewards and master duel screens', ja: '放置の報酬と師範戦の画面' },
      },
    ],
    icon: 'bou-no-ichizoku/icon.png',
    preview: {
      image: 'bou-no-ichizoku/preview.png',
      video: '/media/bou-no-ichizoku/preview.mp4',
      fit: 'contain',
    },
    appStore: {
      url: 'https://apps.apple.com/app/id6818558498',
      event: 'click_bou_appstore',
    },
  },
  {
    id: 'synapse',
    order: 3,
    status: 'available',
    title: { en: 'Synapse', ja: 'シナプス' },
    tagline: {
      en: 'An elemental-synergy bullet-hell roguelite.',
      ja: '属性シナジー弾幕ローグライト。',
    },
    icon: 'synapse/icon.png',
    preview: {
      image: 'synapse/preview.png',
      video: '/media/synapse/preview.mp4',
    },
    appStore: {
      url: 'https://apps.apple.com/app/id6791659740',
      event: 'click_synapse_appstore',
    },
  },
  {
    id: 'flip-shot',
    order: 5,
    status: 'available',
    title: { en: 'Flip Shot', ja: 'フリップショット' },
    tagline: {
      en: 'Stick-figure gun action.',
      ja: '棒人間ガンアクション。',
    },
    icon: 'flip-shot/icon.png',
    appStore: {
      url: 'https://apps.apple.com/app/id6809098164',
      event: 'click_flipshot_appstore',
    },
  },
];

export const sortedGames = [...games].sort((a, b) => a.order - b.order);
export const featuredGame = sortedGames.find((g) => g.featured) ?? sortedGames[0]!;
export const otherGames = sortedGames.filter((g) => g !== featuredGame);
