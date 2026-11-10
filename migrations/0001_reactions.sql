-- Reaction counts per game. Run once in the D1 console (Cloudflare dashboard → Storage & databases → D1 → your DB → Console).
CREATE TABLE IF NOT EXISTS reaction_counts (
  game TEXT NOT NULL,
  reaction TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (game, reaction)
);

-- One row per (game, reaction, visitor). `voter` is a salted SHA-256 of the IP address:
-- the IP itself is never stored, and the hash cannot be turned back into it.
CREATE TABLE IF NOT EXISTS reaction_votes (
  game TEXT NOT NULL,
  reaction TEXT NOT NULL,
  voter TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (game, reaction, voter)
);
CREATE INDEX IF NOT EXISTS reaction_votes_voter_time ON reaction_votes (voter, created_at);

-- Random salt for the voter hash, created automatically on first use.
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
