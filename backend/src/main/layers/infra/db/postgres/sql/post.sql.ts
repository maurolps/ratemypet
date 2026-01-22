export const sql = {
  CREATE_POST: `
  INSERT INTO posts (pet_id, author_id, caption, status)
  VALUES ($1, $2, $3, $4)
  RETURNING id, pet_id, author_id, caption, status, created_at
  `,
};
