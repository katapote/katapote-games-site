/**
 * Generates share/brand images into /public:
 *   public/og/og-default.png  (1200×630, used for og:image / twitter:image)
 *   public/apple-touch-icon.png, public/favicon-32.png
 *
 * Text comes from the featured game in src/config/games.ts and the brand in
 * src/config/site.ts. If the featured game's `keyVisual` file exists, the OG
 * image is built from that art (cropped to 1200×630 with a dark band and the
 * title). Otherwise a text-only brand card is produced.
 *
 * Usage: npm run og   (re-run after adding or changing the key visual)
 */
import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { featuredGame as game } from '../src/config/games.ts';
import { site } from '../src/config/site.ts';

const root = resolve(import.meta.dirname, '..');
const out = (p) => resolve(root, 'public', p);
mkdirSync(out('og'), { recursive: true });

const W = 1200;
const H = 630;
const kv = [game.keyVisual]
  .filter(Boolean)
  .map((p) => resolve(root, 'src/assets/games', p))
  .find(existsSync);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const title = game.title.en;
const line = game.catchcopy?.en ?? game.tagline?.en ?? '';
const brand = `${site.brand.wordmark}${site.brand.wordmarkThin}`.toUpperCase();
const cta = game.testFlight?.url
  ? 'Join the Playtest on TestFlight'
  : game.appStore?.url
    ? 'Available on the App Store'
    : '';

const textLayer = (withArt) => Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  ${withArt
    ? `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stop-color="#110e17" stop-opacity="0"/><stop offset="1" stop-color="#110e17" stop-opacity="0.92"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>`
    : `<rect width="${W}" height="${H}" fill="#110e17"/>
       <path d="M70 520 C 300 470, 520 560, 760 505 S 1060 470, 1130 515" fill="none" stroke="#8e6bd8" stroke-width="6" stroke-linecap="round"/>`}
  <text x="70" y="${withArt ? 470 : 300}" font-family="Permanent Marker, DejaVu Sans, sans-serif" font-weight="700" font-size="${withArt ? 76 : 96}" fill="#efeadf">${esc(title)}</text>
  <text x="72" y="${withArt ? 530 : 380}" font-family="DejaVu Sans, sans-serif" font-weight="700" font-size="34" fill="#efeadf">${esc(line)}</text>
  <text x="72" y="${withArt ? 582 : 440}" font-family="DejaVu Sans, sans-serif" font-size="26" fill="#c4b0f2">${esc(cta)}</text>
  ${withArt ? '' : `<text x="72" y="110" font-family="DejaVu Sans, sans-serif" font-weight="700" font-size="24" letter-spacing="6" fill="#b3abbd">${esc(brand)}</text>`}
</svg>`);

if (kv) {
  const base = await sharp(kv).resize(W, H, { fit: 'cover', position: 'attention' }).toBuffer();
  await sharp(base).composite([{ input: textLayer(true) }]).png({ compressionLevel: 9 }).toFile(out('og/og-default.png'));
  console.log('OG image built from', kv);
} else {
  await sharp(textLayer(false)).png({ compressionLevel: 9 }).toFile(out('og/og-default.png'));
  console.log('No key visual found — built text-only brand OG image.');
}

const icon = readFileSync(out('favicon.svg'));
await sharp(icon, { density: 600 }).resize(180, 180).flatten({ background: '#110e17' }).png().toFile(out('apple-touch-icon.png'));
await sharp(icon, { density: 300 }).resize(32, 32).png().toFile(out('favicon-32.png'));
console.log('Icons written.');
