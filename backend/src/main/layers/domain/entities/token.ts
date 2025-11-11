export type AccessTokenPayload = {
  sub: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
};

export type RefreshTokenDTO = {
  id: string;
  user_id: string;
  token_hash: string;
  created_at?: number;
  expires_at?: number;
  revoked_at?: number;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};
