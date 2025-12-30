export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 8000,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://ratemypet:ratemypet@localhost:5432/ratemypet_dev?sslmode=disable",
  JWT_ACCESS_TOKEN_SECRET:
    process.env.JWT_ACCESS_TOKEN_SECRET || "dev_access_token_secret",
  JWT_ACCESS_TOKEN_TTL: process.env.JWT_ACCESS_TOKEN_TTL || "10s",
  REFRESH_TOKEN_TTL:
    (process.env.REFRESH_TOKEN_TTL as unknown as number) || 20_000,
  RATE_LIMIT_ENABLED: process.env.RATE_LIMIT_ENABLED || "true",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  AWS_REGION: process.env.AWS_REGION || "auto",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
  AWS_ENDPOINT: process.env.AWS_ENDPOINT || "",
};
