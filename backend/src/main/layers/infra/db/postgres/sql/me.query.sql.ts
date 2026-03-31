export const sql = {
  FIND_ME_PROFILE: `
  SELECT
    u.id,
    u.display_name,
    u.email,
    u.bio,
    u.created_at,
    u.picture,
    COUNT(p.id)::int AS posts_count,
    COALESCE(SUM(p.likes_count), 0)::int AS likes_received
  FROM users u
  LEFT JOIN posts p
    ON p.author_id = u.id
    AND p.status = 'PUBLISHED'
  WHERE u.id = $1
  GROUP BY u.id, u.display_name, u.email, u.bio, u.created_at, u.picture
  `,
  FIND_ME_PETS: `
  SELECT
    id,
    name,
    type,
    image_url,
    COALESCE(ratings.ratings_count, 0)::int AS ratings_count
  FROM pets
  LEFT JOIN LATERAL (
    SELECT COUNT(*)::int AS ratings_count
    FROM ratings r
    WHERE r.pet_id = pets.id
  ) ratings ON TRUE
  WHERE owner_id = $1
    AND deleted_at IS NULL
  ORDER BY created_at ASC, id ASC
  `,
};
