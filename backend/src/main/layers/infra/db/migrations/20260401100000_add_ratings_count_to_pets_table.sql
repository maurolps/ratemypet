-- migrate:up
ALTER TABLE pets
ADD COLUMN ratings_count INTEGER NOT NULL DEFAULT 0;

-- migrate:down
ALTER TABLE pets
DROP COLUMN IF EXISTS ratings_count;
