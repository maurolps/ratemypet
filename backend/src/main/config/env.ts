export const env = {
  PORT: process.env.PORT || 8000,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://ratemypet:ratemypet@localhost:5432/ratemypet_dev?sslmode=disable",
  JWT_ACCESS_TOKEN_SECRET:
    process.env.JWT_ACCESS_TOKEN_SECRET || "dev_access_token_secret",
  JWT_ACCESS_TOKEN_TTL: process.env.JWT_ACCESS_TOKEN_TTL || "10s",
};
