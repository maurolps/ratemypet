-- migrate:up
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  idempotency_key UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT comments_content_length_guard CHECK (char_length(content) <= 1000),
  CONSTRAINT comments_idempotency_unique UNIQUE (post_id, author_id, idempotency_key)
);

-- migrate:down
DROP TABLE IF EXISTS comments;
