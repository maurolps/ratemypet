export const sql = {
  FIND_PROFILE: `
  SELECT
    u.id,
    u.display_name,
    u.bio,
    COUNT(p.id)::int AS posts_count,
    COALESCE(SUM(p.likes_count), 0)::int AS likes_received
  FROM users u
  LEFT JOIN posts p
    ON p.author_id = u.id
    AND p.status = 'PUBLISHED'
  WHERE u.id = $1
  GROUP BY u.id, u.display_name, u.bio
  `,
  FIND_PROFILE_PETS: `
  SELECT
    id,
    name,
    type,
    image_url
  FROM pets
  WHERE owner_id = $1
    AND deleted_at IS NULL
  ORDER BY created_at ASC, id ASC
  `,
};
