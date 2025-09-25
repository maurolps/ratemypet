export const CREATE_USER = `
  INSERT INTO users (name, email, password_hash)
  VALUES ($1, $2, $3)
  RETURNING id, name, email
`;

export const FIND_BY_EMAIL = `
  SELECT id, name, email
  FROM users
  WHERE email = $1
  `;
