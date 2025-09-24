import type { User } from "@domain/entities/user";
import { it, describe, beforeAll, afterAll, expect } from "vitest";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { dbmateMigrate } from "@infra/db/postgres/helpers/dbmate-migrate";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { CREATE_USER } from "@infra/db/postgres/sql/user.sql";

describe("Postgres UserRepository", () => {
  let pgContainer: PostgreSqlContainer;
  let pgConnection: StartedPostgreSqlContainer;
  let pgPool: PgPool;

  beforeAll(async () => {
    pgContainer = new PostgreSqlContainer("postgres:17");
    pgConnection = await pgContainer.start();
    const pgUri = pgConnection.getConnectionUri();
    await dbmateMigrate(pgUri);
    pgPool = PgPool.getInstance();
    pgPool.connect(pgUri);
  }, 60_000);

  afterAll(async () => {
    if (pgConnection) {
      await pgPool.disconnect();
      await pgConnection.stop();
    }
  }, 60_000);

  it("Should return an User on success", async () => {
    const userDTO = {
      name: "valid_name",
      email: "valid_email@mail.com",
      passwordHash: "hashed_password",
    };
    const { name, email, passwordHash } = userDTO;

    const userRows = await pgPool.query<User>(CREATE_USER, [
      name,
      email,
      passwordHash,
    ]);

    expect(userRows.rows[0].name).toEqual("valid_name");
  });
});
