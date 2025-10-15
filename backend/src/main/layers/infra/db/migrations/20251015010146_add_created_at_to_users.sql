-- migrate:up
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- migrate:down
ALTER TABLE users
  DROP COLUMN IF EXISTS created_at;
