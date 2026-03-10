-- migrate:up
CREATE TABLE IF NOT EXISTS auth_identities (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_id UUID NOT NULL REFERENCES users(id),
provider TEXT NOT NULL,
provider_user_id TEXT NULL,
password_hash TEXT NULL,
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
CONSTRAINT auth_identities_user_provider_unique UNIQUE (user_id, provider)
);

ALTER TABLE users
DROP COLUMN password_hash;

-- migrate:down
ALTER TABLE users
ADD COLUMN password_hash TEXT;

UPDATE users
SET password_hash = ''
WHERE password_hash IS NULL;

ALTER TABLE users
ALTER COLUMN password_hash SET NOT NULL;

DROP TABLE IF EXISTS auth_identities;
