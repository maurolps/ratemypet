-- migrate:up
CREATE TABLE IF NOT EXISTS refresh_tokens (
id TEXT PRIMARY KEY,
user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
token_hash TEXT NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW(),
expires_at TIMESTAMPTZ NOT NULL,
revoked_at TIMESTAMPTZ
);

-- migrate:down
DROP TABLE IF EXISTS refresh_tokens;
