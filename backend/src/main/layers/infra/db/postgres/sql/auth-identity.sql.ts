export const sql = {
  CREATE_AUTH_IDENTITY: `
  INSERT INTO auth_identities (user_id, provider, identifier, provider_user_id, password_hash)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id, user_id, provider, identifier, provider_user_id, password_hash, created_at
  `,
  FIND_BY_USER_ID_AND_PROVIDER: `
  SELECT id, user_id, provider, identifier, provider_user_id, password_hash, created_at
  FROM auth_identities
  WHERE user_id = $1 AND provider = $2
  `,
  FIND_BY_PROVIDER_AND_IDENTIFIER: `
  SELECT id, user_id, provider, identifier, provider_user_id, password_hash, created_at
  FROM auth_identities
  WHERE provider = $1 AND identifier = $2
  `,
  FIND_BY_PROVIDER_USER_ID: `
  SELECT id, user_id, provider, identifier, provider_user_id, password_hash, created_at
  FROM auth_identities
  WHERE provider = $1 AND provider_user_id = $2
  `,
};
