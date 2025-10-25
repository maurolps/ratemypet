import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { dbmateMigrate } from "../infra/db/postgres/helpers/dbmate-migrate";

export default async function globalSetup() {
  const pgContainer = new PostgreSqlContainer("postgres:17");
  const pgConnection = await pgContainer.start();
  const pgUri = pgConnection.getConnectionUri();
  await dbmateMigrate(pgUri);
  process.env.DATABASE_TEST_URI = pgUri;

  return async () => {
    await pgConnection.stop();
  };
}
