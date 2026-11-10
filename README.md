# Katapote Games — website

Portfolio & conversion site for Katapote Games. Primary goal: send visitors from X
to the **Doodle Nightmare TestFlight playtest**; secondary: App Store clicks for
Omoidase and ぼうの一族.

Astro (static) + TypeScript + plain CSS. No UI framework; the only client JS is a
~2 KB analytics helper and a one-line language redirect.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # type-check + static build into dist/
npm run preview    # serve dist/
npm run og         # regenerate OG image + icons (see below)
```

Node 22.23.4+ (see `.node-version`).

## Where to edit things

| What | File |
| --- | --- |
| Games/apps: names, taglines, status, order, icons, screenshots, App Store / TestFlight / gameplay URLs | `src/config/games.ts` |
| Brand, developer bio, X/YouTube/Discord links, contact | `src/config/site.ts` |
| UI strings (EN / JP) | `src/i18n/ui.ts` |
| Colors, fonts, buttons | `src/styles/global.css` |

Rules:

- **A link set to `null` is not rendered.** E.g. Omoidase shows "Store link coming
  soon" until `appStore.url` is filled; "Watch Gameplay" appears only once
  `gameplayVideo.url` is set; YouTube/Discord appear once their `url` is set.
- **Adding a game** = append one object to `games` in `games.ts`
  (`order` controls position, `featured: true` puts it in the hero).
- Text fields are `{ en, ja }`; `ja` falls back to `en` when omitted.

### Images

Put real assets in `src/assets/games/<game-id>/` and reference them by the path
relative to `src/assets/games/` in `games.ts`. Astro converts them to AVIF/WebP at
several widths. Missing files show a neutral placeholder of the same aspect ratio
(no layout shift when you add the real file).

Expected files (current config):

| Path | Use | Size |
| --- | --- | --- |
| `doodle-nightmare/key-visual.png` | Hero | 16:9, 1920×1080 |
| `doodle-nightmare/feature-draw.png` | Feature 1 | 16:9, ≥1280 wide |
| `doodle-nightmare/feature-stats.png` | Feature 2 | 16:9, ≥1280 wide |
| `doodle-nightmare/feature-fight.png` | Feature 3 | 16:9, ≥1280 wide |
| `doodle-nightmare/icon.png` | (card, if listed) | square, ≥512 |
| `omoidase/icon.png` | Card icon | square, ≥512 |
| `bou-no-ichizoku/icon.png` | Card icon | square, ≥512 |

Portrait screenshots? Change the `ratio` passed to `<Media>` in
`src/components/Features.astro` (e.g. `'9 / 19.5'`).

### OG image / icons

`npm run og` writes `public/og/og-default.png` (1200×630). If
`src/assets/games/doodle-nightmare/key-visual.*` exists it uses that real art with
the title over a dark band; otherwise a text-only brand card. Commit the result.
It also renders `public/apple-touch-icon.png` and `public/favicon-32.png` from
`public/favicon.svg`.

## Languages

- `/` = English (default), `/ja/` = Japanese. Both are static pages with
  `hreflang` alternates and their own canonical URL.
- On the **first** visit to `/`, a browser whose primary language is Japanese is
  redirected to `/ja/` (query string kept, so UTMs survive). Once the visitor uses
  the EN/JP switch, that choice (localStorage `kg_lang`) always wins.

## Analytics

### Events

| Event | Fired when |
| --- | --- |
| `page_view` | page load (once per path per tab session) |
| `click_doodle_testflight` | any "Join the Playtest" button (`location` = hero / features) |
| `click_doodle_gameplay` | "Watch Gameplay" |
| `click_omoidase_appstore` | Omoidase App Store button (only once its URL is set) |
| `click_bou_appstore` | ぼうの一族 App Store button |
| `click_synapse_appstore` | シナプス App Store button |
| `click_flipshot_appstore` | フリップショット App Store button |
| `click_x_profile` | any X link (`location` = header / about / footer) |
| `click_reaction_<id>` | a reaction button (`game`) |
| `click_<game>_review` | "Write a review" link shown after a reaction |
| `language_switch` | EN/JP switch (`from`, `to`) |

Every event carries: `lang`, `path`, `traffic_source`, and any `utm_*` present on
the landing URL (first touch, kept for the tab session).

`traffic_source` is `x_profile` when `utm_source` is `x`/`twitter` and the
medium/campaign/content contains `profile`; `x` for other X traffic (UTM or a
`t.co`/`x.com` referrer); otherwise the `utm_source`, the referring host, or
`direct`.

**Set the link in your X profile to:**

```
https://<your-domain>/?utm_source=x&utm_medium=social&utm_campaign=profile
```

For posts use e.g. `utm_campaign=post_<topic>`.

Guarantees:

- Clicks are observed passively (no `preventDefault`), and every external link is
  a plain `<a target="_blank">`: if analytics fails or is blocked, navigation
  still works.
- Each click event is sent at most **once per tab session per event name** (and
  `page_view` once per path), so reloads/double taps don't inflate numbers.
  Read the numbers as "sessions that clicked".
- **A TestFlight click is not a playtest join.** The site cannot see whether the
  visitor installed TestFlight or accepted the invite. Compare clicks with the
  tester count in App Store Connect → TestFlight → Public Link.
- No names, emails, IPs or full referrer URLs are collected by this code.

### Providers (set by env vars, nothing is hard-coded)

Cloudflare Web Analytics alone only gives page views, referrers and countries —
**it cannot record custom click events or UTM breakdowns.** Pick one event
provider:

| `PUBLIC_ANALYTICS_PROVIDER` | Notes |
| --- | --- |
| `plausible` (recommended) | Cookieless, custom events + props + UTM reports out of the box; paid (or self-host). Set `PUBLIC_PLAUSIBLE_DOMAIN`; in Plausible add goals for the event names above and the custom props `traffic_source`, `location`. |
| `zaraz` | Free tier, Cloudflare-native. Requires the site on a custom domain proxied by Cloudflare (not `*.pages.dev`). Enable Zaraz for the zone and add a tool (e.g. GA4) with triggers on the event names. No script needed in the code. |
| `ga4` | Free; set `PUBLIC_GA4_ID`. Uses cookies — consider a consent banner if you target the EU/UK. |
| `none` (default) | Events are only recorded locally (`window.kgEvents`) for verification. |

Page views via Cloudflare Web Analytics: either enable it in the Pages project
(Metrics → Web Analytics; Cloudflare injects the beacon) and set
`PUBLIC_CF_WEB_ANALYTICS=1`, or set `PUBLIC_CF_BEACON_TOKEN` to load the beacon
manually. These flags also drive which services the Privacy Policy lists, so keep
them accurate.

None of these values are secrets (they all end up in public HTML), but keep them in
environment variables, not in code. See `.env.example`.

### Verifying events

Open any page with `?kg_debug=1` (persists for the tab) and watch the console:

```
[kg-analytics] sent click_doodle_testflight {traffic_source: "x_profile", location: "hero", …} provider=plausible
[kg-analytics] skipped (duplicate) click_doodle_testflight …
```

`window.kgEvents` holds every event with `sent: true|false`. With a provider
enabled, also check its realtime view (Plausible dashboard / GA4 DebugView).

## Reactions (❤️ + stamps)

Every game shows reaction buttons (❤️ いいね, やってみたい, 面白そう, 遊んだよ, 続編希望).
Buttons and labels live in `src/config/reactions.ts`; counts appear only once a button
reaches `showCountFrom` (default 10). After a press the visitor is offered a link to
write an App Store review.

Storage is a Cloudflare D1 database used by `functions/api/reactions.ts` (a Pages
Function). **Until the database is bound the buttons stay hidden**, so deploying the
code alone changes nothing.

One-time setup (Cloudflare dashboard):

1. Storage & databases → D1 → **Create database**, name e.g. `katapote-reactions`.
2. Open it → **Console**, paste the contents of `migrations/0001_reactions.sql`, run.
3. Workers & Pages → the Pages project → Settings → **Bindings** → Add → D1 database:
   variable name `DB`, database = the one above. Save.
4. Deployments → latest → **Retry deployment**.

Abuse limits: one press per visitor per game per button (visitor = salted SHA-256 of
the IP; the IP is not stored) and 40 presses per visitor per day. The Privacy Policy
section about this is shown while `reactions.enabled` is true.

Local test: create a temporary `wrangler.toml` with `pages_build_output_dir = "dist"`
and a `[[d1_databases]]` binding `DB`, run
`npx wrangler d1 execute <name> --local --file migrations/0001_reactions.sql`, then
`npm run build && npx wrangler pages dev`. Don't commit `wrangler.toml`: Cloudflare
would use it instead of the dashboard settings.

## Deploy to Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git →
   select this repository.
2. Build settings:
   - Framework preset: **Astro**
   - Root directory: (leave empty — repo root)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Production branch: `main`
3. Environment variables (Production and Preview):
   - `SITE_URL` = final URL, e.g. `https://katapote-games.pages.dev` or your domain (**required** — canonical, OGP, sitemap, robots use it)
   - `NODE_VERSION` = `22.23.4` (or rely on `.node-version`)
   - analytics vars from `.env.example` as needed
4. Deploy. Optional: Custom domains → add your domain (needed for Zaraz).
5. After deploy:
   - Open `/` and `/ja/` on an iPhone; tap "Join the Playtest" → TestFlight.
   - Validate OGP with the X post composer (paste the URL) and
     <https://www.opengraph.xyz/>.
   - Submit `https://<domain>/sitemap-index.xml` in Google Search Console.
   - Update the X profile website link with the UTM URL above.

`public/_headers` sets long-term caching for hashed assets and basic security
headers.

## Structure

```
.
├── astro.config.mjs        # site URL, sitemap (+hreflang)
├── public/                 # favicon, OG image, _headers
├── scripts/make-og.mjs     # OG image + icon generator (sharp)
└── src/
    ├── config/             # ← edit content here (games.ts, site.ts)
    ├── i18n/ui.ts          # EN/JP strings + helpers
    ├── components/         # Header, Hero, Features, Works, GameCard, About, Footer, Media, PrivacyPage…
    ├── layouts/Base.astro  # <head>: SEO, OGP, Twitter, hreflang, analytics loaders
    ├── pages/              # /, /ja/, /privacy/, /ja/privacy/, 404, robots.txt
    ├── scripts/analytics.ts
    └── styles/global.css
```
