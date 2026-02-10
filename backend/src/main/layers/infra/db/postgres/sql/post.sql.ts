export const sql = {
  CREATE_POST: `
  INSERT INTO posts (pet_id, author_id, caption, status)
  VALUES ($1, $2, $3, $4)
  RETURNING id, pet_id, author_id, caption, status, created_at, likes_count, comments_count
  `,
  FIND_POST_BY_ID: `
  SELECT id, pet_id, author_id, caption, status, created_at, likes_count, comments_count
  FROM posts
  WHERE id = $1
  `,
  INCREMENT_LIKES_COUNT: `
  UPDATE posts
  SET likes_count = likes_count + 1
  WHERE id = $1
  RETURNING id, pet_id, author_id, caption, status, created_at, likes_count, comments_count
  `,
  DECREMENT_LIKES_COUNT: `
  UPDATE posts
  SET likes_count = GREATEST(0, likes_count - 1)
  WHERE id = $1
  RETURNING id, pet_id, author_id, caption, status, created_at, likes_count, comments_count
  `,
  INCREMENT_COMMENTS_COUNT: `
  UPDATE posts
  SET comments_count = comments_count + 1
  WHERE id = $1
  RETURNING id, pet_id, author_id, caption, status, created_at, likes_count, comments_count
  `,
};
