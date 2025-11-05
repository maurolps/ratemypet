export type AccessTokenPayload = {
  sub: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
};
