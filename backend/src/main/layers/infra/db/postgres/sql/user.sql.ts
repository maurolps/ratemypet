export const sql = {
  CREATE_USER: `
  INSERT INTO users (name, email, password_hash)
  VALUES ($1, $2, $3)
  RETURNING id, name, email, created_at
  `,
  FIND_BY_EMAIL: `
  SELECT id, name, email, created_at, password_hash
  FROM users
  WHERE email = $1
  `,
  FIND_BY_ID: `
  SELECT id, name, email, created_at, password_hash
  FROM users
  WHERE id = $1
  `,
  CREATE_REFRESH_TOKEN: `
  INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
  VALUES ($1, $2, $3, $4)
  `,
  FIND_REFRESH_TOKEN_BY_ID: `
  SELECT id, user_id, token_hash, created_at, expires_at, revoked_at
  FROM refresh_tokens
  WHERE id = $1
  `,
};
