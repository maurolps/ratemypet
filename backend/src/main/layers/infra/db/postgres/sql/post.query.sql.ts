export const sql = {
  POST_EXISTS_BY_ID: `
  SELECT EXISTS (
    SELECT 1
    FROM posts p
    WHERE p.id = $1
  ) AS post_exists
  `,
  FIND_POST_DETAILS_BY_ID: `
  SELECT
    p.id,
    p.pet_id,
    p.author_id,
    p.caption,
    p.status,
    p.created_at,
    p.likes_count,
    p.comments_count,
    (
      $2::uuid IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM likes l
        WHERE l.post_id = p.id
          AND l.user_id = $2::uuid
      )
    ) AS viewer_has_liked
  FROM posts p
  WHERE p.id = $1
  `,
  FIND_POST_COMMENTS: `
  SELECT
    c.id,
    c.post_id,
    c.author_id,
    u.name AS author_name,
    c.content,
    c.created_at
  FROM comments c
  INNER JOIN users u ON u.id = c.author_id
  WHERE c.post_id = $1
    AND (
      $2::timestamptz IS NULL
      OR c.created_at < $2::timestamptz
      OR (c.created_at = $2::timestamptz AND c.id < $3::uuid)
    )
  ORDER BY c.created_at DESC, c.id DESC
  LIMIT $4
  `,
};
