export const sql = {
  SAVE_PET: `
  INSERT INTO pets (name, type, image_url, caption)
  VALUES ($1, $2, $3, $4)
  RETURNING id, name, type, image_url, caption, created_at
  `,
};
