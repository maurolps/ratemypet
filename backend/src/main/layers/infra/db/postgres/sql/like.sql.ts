export const sql = {
  FIND_LIKE: `
  SELECT post_id, user_id, created_at
  FROM likes
  WHERE post_id = $1 AND user_id = $2
  `,
  CREATE_LIKE: `
  INSERT INTO likes (post_id, user_id)
  VALUES ($1, $2)
  ON CONFLICT (post_id, user_id) DO NOTHING
  RETURNING post_id, user_id, created_at
  `,
};
