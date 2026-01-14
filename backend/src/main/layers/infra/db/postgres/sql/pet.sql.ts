export const sql = {
  SAVE_PET: `
  INSERT INTO pets (owner_id, name, type, image_url, caption)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, owner_id, name, type, image_url, caption, created_at
  `,
  COUNT_PETS_BY_OWNER_ID: `
  SELECT COUNT(*) AS count
  FROM pets
  WHERE owner_id = $1
  `,
};
