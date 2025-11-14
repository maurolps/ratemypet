export const sql = {
  CREATE_USER: `
  INSERT INTO users (name, email, password_hash)
  VALUES ($1, $2, $3)
  RETURNING id, name, email, created_at
  `,
  FIND_BY_EMAIL: `
  SELECT id, name, email, password_hash
  FROM users
  WHERE email = $1
  `,
  CREATE_REFRESH_TOKEN: `
  INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
  VALUES ($1, $2, $3, $4)
  `,
};
