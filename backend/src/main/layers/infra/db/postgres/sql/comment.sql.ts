export const sql = {
  FIND_COMMENT_BY_IDEMPOTENCY_KEY: `
  SELECT id, post_id, author_id, content, idempotency_key, created_at
  FROM comments
  WHERE post_id = $1 AND author_id = $2 AND idempotency_key = $3
  `,
  FIND_COMMENT_BY_ID_AND_POST_ID: `
  SELECT id, post_id, author_id, content, idempotency_key, created_at
  FROM comments
  WHERE id = $1 AND post_id = $2
  `,
  CREATE_COMMENT: `
  INSERT INTO comments (post_id, author_id, content, idempotency_key)
  VALUES ($1, $2, $3, $4)
  ON CONFLICT (post_id, author_id, idempotency_key) DO NOTHING
  RETURNING id, post_id, author_id, content, idempotency_key, created_at
  `,
  DELETE_COMMENT: `
  DELETE FROM comments
  WHERE id = $1 AND post_id = $2
  `,
};
