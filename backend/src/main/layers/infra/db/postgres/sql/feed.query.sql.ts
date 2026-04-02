export const sql = {
  FIND_FEED_ITEMS: `
  SELECT
    p.id,
    p.caption,
    pet.image_url,
    pet.id AS pet_id,
    pet.name AS pet_name,
    pet.type AS pet_type,
    pet.ratings_count AS pet_ratings_count,
    u.id AS author_id,
    u.name AS author_name,
    p.likes_count,
    p.comments_count,
    (
      $3::uuid IS NOT NULL
      AND EXISTS (
        SELECT 1
        FROM likes l
        WHERE l.post_id = p.id
          AND l.user_id = $3::uuid
      )
    ) AS viewer_has_liked,
    p.status,
    p.created_at
  FROM posts p
  INNER JOIN users u ON u.id = p.author_id
  INNER JOIN pets pet ON pet.id = p.pet_id
  WHERE p.status = 'PUBLISHED'
    AND (
      $1::timestamptz IS NULL
      OR p.created_at < $1::timestamptz
      OR (p.created_at = $1::timestamptz AND p.id < $2::uuid)
    )
  ORDER BY p.created_at DESC, p.id DESC
  LIMIT $4
  `,
};
