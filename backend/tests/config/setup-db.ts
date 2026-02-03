import { beforeAll, afterAll } from "vitest";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";

const pgPool = PgPool.getInstance();

beforeAll(async () => {
  const pgUri = process.env.DATABASE_TEST_URI || "";
  pgPool.initialize(pgUri);
  await pgPool.health();
});

afterAll(async () => {
  await pgPool.disconnect();
});
