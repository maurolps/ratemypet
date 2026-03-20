-- migrate:up
ALTER TABLE users
ADD COLUMN display_name TEXT NOT NULL,
ADD COLUMN bio TEXT NOT NULL;

CREATE INDEX IF NOT EXISTS idx_posts_author_id
ON posts (author_id);

CREATE INDEX IF NOT EXISTS idx_pets_owner_id_active
ON pets (owner_id)
WHERE deleted_at IS NULL;

-- migrate:down
DROP INDEX IF EXISTS idx_pets_owner_id_active;

DROP INDEX IF EXISTS idx_posts_author_id;

ALTER TABLE users
DROP COLUMN IF EXISTS bio,
DROP COLUMN IF EXISTS display_name;
