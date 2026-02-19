-- Tabelle 1: players (Spieler)
CREATE TABLE IF NOT EXISTS players (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabelle 2: game_results (Spielergebnisse)
CREATE TABLE IF NOT EXISTS game_results (
  id        SERIAL PRIMARY KEY,
  player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  attempts  INTEGER NOT NULL CHECK (attempts > 0),
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indizes für schnellere Highscore-Abfragen
CREATE INDEX IF NOT EXISTS idx_game_results_attempts ON game_results(attempts ASC);
CREATE INDEX IF NOT EXISTS idx_game_results_player   ON game_results(player_id);
