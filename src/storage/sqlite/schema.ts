export const ANALYTICS_SCHEMA_SQL = `
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS level_progress (
  level_id TEXT PRIMARY KEY,
  best_stars INTEGER NOT NULL DEFAULT 0,
  best_accuracy REAL NOT NULL DEFAULT 0,
  rounds_played INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rounds (
  id TEXT PRIMARY KEY,
  level_id TEXT NOT NULL,
  session_mode TEXT NOT NULL DEFAULT 'level',
  session_source TEXT NOT NULL DEFAULT 'standard',
  started_at TEXT NOT NULL,
  ended_at TEXT NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  stars INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS block_progress (
  block_id TEXT PRIMARY KEY,
  best_stars INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  completed INTEGER NOT NULL DEFAULT 0,
  exam_passed INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exam_attempts (
  id TEXT PRIMARY KEY,
  block_id TEXT NOT NULL,
  score REAL NOT NULL,
  passed INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS responses (
  id TEXT PRIMARY KEY,
  round_id TEXT NOT NULL,
  question_index INTEGER NOT NULL,
  level_id TEXT NOT NULL,
  session_mode TEXT NOT NULL DEFAULT 'level',
  session_source TEXT NOT NULL DEFAULT 'standard',
  target_note TEXT NOT NULL,
  target_string INTEGER NOT NULL,
  target_fret INTEGER NOT NULL,
  selected_string INTEGER,
  selected_fret INTEGER,
  is_correct INTEGER NOT NULL,
  response_time_ms INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses(created_at);
CREATE INDEX IF NOT EXISTS idx_responses_target_note ON responses(target_note);
CREATE INDEX IF NOT EXISTS idx_responses_target_string ON responses(target_string);
CREATE INDEX IF NOT EXISTS idx_responses_level_id ON responses(level_id);
CREATE INDEX IF NOT EXISTS idx_responses_session_mode ON responses(session_mode);

ALTER TABLE rounds ADD COLUMN IF NOT EXISTS session_mode TEXT NOT NULL DEFAULT 'level';
ALTER TABLE rounds ADD COLUMN IF NOT EXISTS session_source TEXT NOT NULL DEFAULT 'standard';
ALTER TABLE responses ADD COLUMN IF NOT EXISTS session_mode TEXT NOT NULL DEFAULT 'level';
ALTER TABLE responses ADD COLUMN IF NOT EXISTS session_source TEXT NOT NULL DEFAULT 'standard';
`;
