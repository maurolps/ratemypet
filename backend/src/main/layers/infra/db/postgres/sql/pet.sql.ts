export const sql = {
  SAVE_PET: `
  INSERT INTO pets (owner_id, name, type, image_url, caption)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, owner_id, name, type, image_url, caption, created_at, deleted_at
  `,
  FIND_PET_BY_ID: `
  SELECT id, owner_id, name, type, image_url, caption, created_at, deleted_at
  FROM pets
  WHERE id = $1
    AND deleted_at IS NULL
  `,
  FIND_PET_BY_ID_INCLUDING_DELETED: `
  SELECT id, owner_id, name, type, image_url, caption, created_at, deleted_at
  FROM pets
  WHERE id = $1
  `,
  COUNT_PETS_BY_OWNER_ID: `
  SELECT COUNT(*) AS count
  FROM pets
  WHERE owner_id = $1
    AND deleted_at IS NULL
  `,
  SOFT_DELETE_PET: `
  UPDATE pets
  SET deleted_at = NOW()
  WHERE id = $1
    AND deleted_at IS NULL
  `,
  INCREMENT_RATINGS_COUNT: `
  UPDATE pets
  SET ratings_count = ratings_count + 1
  WHERE id = $1
  `,
  DECREMENT_RATINGS_COUNT: `
  UPDATE pets
  SET ratings_count = GREATEST(0, ratings_count - 1)
  WHERE id = $1
  `,
};
