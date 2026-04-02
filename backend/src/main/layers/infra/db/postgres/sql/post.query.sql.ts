export const sql = {
  POST_EXISTS_BY_ID: `
  SELECT EXISTS (
    SELECT 1
    FROM posts p
    WHERE p.id = $1
      AND p.status = 'PUBLISHED'
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
    pet.ratings_count AS ratings_total_count,
    COALESCE(ratings.cute_count, 0)::int AS cute_count,
    COALESCE(ratings.funny_count, 0)::int AS funny_count,
    COALESCE(ratings.majestic_count, 0)::int AS majestic_count,
    COALESCE(ratings.chaos_count, 0)::int AS chaos_count,
    COALESCE(ratings.smart_count, 0)::int AS smart_count,
    COALESCE(ratings.sleepy_count, 0)::int AS sleepy_count,
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
  INNER JOIN pets pet ON pet.id = p.pet_id
  LEFT JOIN LATERAL (
    SELECT
      COUNT(*) FILTER (WHERE r.rate = 'cute')::int AS cute_count,
      COUNT(*) FILTER (WHERE r.rate = 'funny')::int AS funny_count,
      COUNT(*) FILTER (WHERE r.rate = 'majestic')::int AS majestic_count,
      COUNT(*) FILTER (WHERE r.rate = 'chaos')::int AS chaos_count,
      COUNT(*) FILTER (WHERE r.rate = 'smart')::int AS smart_count,
      COUNT(*) FILTER (WHERE r.rate = 'sleepy')::int AS sleepy_count
    FROM ratings r
    WHERE r.pet_id = p.pet_id
  ) ratings ON TRUE
  WHERE p.id = $1
    AND p.status = 'PUBLISHED'
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
