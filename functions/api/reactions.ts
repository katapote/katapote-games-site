/**
 * Reaction API (Cloudflare Pages Function).
 *   GET  /api/reactions                         → { counts: { [game]: { [reaction]: n } } }
 *   POST /api/reactions  { game, reaction }     → { ok, counted, counts: { [reaction]: n } }
 *
 * Needs a D1 database bound as `DB` (see README → Reactions). Without it every
 * request answers 503 and the page simply hides the buttons.
 *
 * Abuse limits: one press per visitor per game per reaction (visitor = salted
 * hash of the IP, the IP is never stored) and at most 40 presses per visitor per day.
 */
import { games } from '../../src/config/games.ts';
import { reactionIds } from '../../src/config/reactions.ts';

interface Env {
  DB?: D1Database;
}

const gameIds = new Set(games.map((g) => g.id));
const reactionSet = new Set(reactionIds);
const DAILY_LIMIT = 40;

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  });

async function salt(db: D1Database): Promise<string> {
  const row = await db.prepare('SELECT value FROM meta WHERE key = ?').bind('voter_salt').first<{ value: string }>();
  if (row) return row.value;
  const fresh = [...crypto.getRandomValues(new Uint8Array(32))].map((b) => b.toString(16).padStart(2, '0')).join('');
  await db.prepare('INSERT OR IGNORE INTO meta (key, value) VALUES (?, ?)').bind('voter_salt', fresh).run();
  const again = await db.prepare('SELECT value FROM meta WHERE key = ?').bind('voter_salt').first<{ value: string }>();
  return again!.value;
}

async function voterId(request: Request, db: D1Database): Promise<string> {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const data = new TextEncoder().encode(`${await salt(db)}:${ip}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function countsFor(db: D1Database, game?: string) {
  const stmt = game
    ? db.prepare('SELECT game, reaction, count FROM reaction_counts WHERE game = ?').bind(game)
    : db.prepare('SELECT game, reaction, count FROM reaction_counts');
  const { results } = await stmt.all<{ game: string; reaction: string; count: number }>();
  const out: Record<string, Record<string, number>> = {};
  for (const r of results) {
    if (!gameIds.has(r.game) || !reactionSet.has(r.reaction)) continue;
    (out[r.game] ??= {})[r.reaction] = r.count;
  }
  return out;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  if (!env.DB) return json({ error: 'not_configured' }, 503);
  try {
    return json({ counts: await countsFor(env.DB) }, 200, { 'Cache-Control': 'public, max-age=30' });
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ error: 'not_configured' }, 503);
  // Only accept presses sent from this site's own pages.
  const origin = request.headers.get('Origin');
  if (!origin || new URL(origin).host !== new URL(request.url).host) return json({ error: 'forbidden' }, 403);

  let body: { game?: unknown; reaction?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  const game = typeof body.game === 'string' ? body.game : '';
  const reaction = typeof body.reaction === 'string' ? body.reaction : '';
  if (!gameIds.has(game) || !reactionSet.has(reaction)) return json({ error: 'bad_request' }, 400);

  try {
    const db = env.DB;
    const voter = await voterId(request, db);
    const now = Date.now();
    const recent = await db
      .prepare('SELECT COUNT(*) AS n FROM reaction_votes WHERE voter = ? AND created_at > ?')
      .bind(voter, now - 24 * 60 * 60 * 1000)
      .first<{ n: number }>();
    if ((recent?.n ?? 0) >= DAILY_LIMIT) return json({ error: 'rate_limited' }, 429);

    const ins = await db
      .prepare('INSERT OR IGNORE INTO reaction_votes (game, reaction, voter, created_at) VALUES (?, ?, ?, ?)')
      .bind(game, reaction, voter, now)
      .run();
    const counted = (ins.meta.changes ?? 0) > 0;
    if (counted) {
      await db
        .prepare(
          'INSERT INTO reaction_counts (game, reaction, count) VALUES (?, ?, 1) ON CONFLICT (game, reaction) DO UPDATE SET count = count + 1',
        )
        .bind(game, reaction)
        .run();
    }
    const counts = (await countsFor(db, game))[game] ?? {};
    return json({ ok: true, counted, counts });
  } catch {
    return json({ error: 'unavailable' }, 503);
  }
};
