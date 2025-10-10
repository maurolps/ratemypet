export const env = {
  PORT: process.env.PORT || 8000,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://ratemypet:ratemypet@localhost:5432/ratemypet_dev?sslmode=disable",
};
