export const sql = {
  FIND_RANKING: `
  SELECT
    p.id,
    p.name,
    p.type,
    p.image_url,
    p.ratings_count,
    p.owner_id,
    u.display_name AS owner_display_name,
    p.created_at
  FROM pets p
  INNER JOIN users u ON u.id = p.owner_id
  WHERE p.deleted_at IS NULL
    AND p.ratings_count > 0
    AND ($1::text IS NULL OR p.type = $1::text)
  ORDER BY p.ratings_count DESC, p.created_at DESC, p.id DESC
  LIMIT 10
  `,
};
