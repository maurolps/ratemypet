-- migrate:up
ALTER TABLE pets
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- migrate:down
ALTER TABLE pets
DROP COLUMN IF EXISTS deleted_at;
