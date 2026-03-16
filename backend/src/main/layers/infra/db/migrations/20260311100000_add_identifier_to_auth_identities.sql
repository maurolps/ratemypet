-- migrate:up
ALTER TABLE auth_identities
ADD COLUMN identifier TEXT NOT NULL;

ALTER TABLE users
DROP CONSTRAINT users_email_key;

ALTER TABLE auth_identities
ADD CONSTRAINT uq_auth_identities_provider_identifier UNIQUE (provider, identifier);

CREATE UNIQUE INDEX idx_auth_identities_provider_user_id
ON auth_identities (provider, provider_user_id)
WHERE provider_user_id IS NOT NULL;

-- migrate:down
DROP INDEX IF EXISTS idx_auth_identities_provider_user_id;

ALTER TABLE auth_identities
DROP CONSTRAINT IF EXISTS uq_auth_identities_provider_identifier;

ALTER TABLE users
ADD CONSTRAINT users_email_key UNIQUE (email);

ALTER TABLE auth_identities
DROP COLUMN IF EXISTS identifier;
