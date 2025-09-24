export const CREATE_USER = `
  INSERT INTO users (name, email, password_hash)
  VALUES ($1, $2, $3)
  RETURNING id, name, email
`;
