-- migrate:up
ALTER TYPE post_status ADD VALUE IF NOT EXISTS 'DELETED';

-- migrate:down
