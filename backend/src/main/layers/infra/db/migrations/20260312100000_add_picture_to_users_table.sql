-- migrate:up
ALTER TABLE users
ADD COLUMN picture TEXT NULL;

-- migrate:down
ALTER TABLE users
DROP COLUMN IF EXISTS picture;