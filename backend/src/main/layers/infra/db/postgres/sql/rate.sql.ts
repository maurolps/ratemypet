export const sql = {
  FIND_RATE: `
  SELECT pet_id, user_id, rate, created_at, updated_at
  FROM ratings
  WHERE pet_id = $1 AND user_id = $2
  `,
  DELETE_RATE: `
  DELETE FROM ratings
  WHERE pet_id = $1 AND user_id = $2
  `,
  UPSERT_RATE: `
  INSERT INTO ratings (pet_id, user_id, rate)
  VALUES ($1, $2, $3)
  ON CONFLICT (pet_id, user_id)
  DO UPDATE SET
  rate = EXCLUDED.rate,
  updated_at = CASE
    WHEN ratings.rate = EXCLUDED.rate THEN ratings.updated_at
    ELSE NOW()
  END
  RETURNING
  pet_id,
  user_id,
  rate,
  created_at,
  updated_at,
  (xmax = 0) AS was_created
  `,
};
