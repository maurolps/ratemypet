import type { User } from "@domain/entities/user";
import { it, describe, beforeAll, afterAll, expect } from "vitest";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Pool, type PoolClient } from "pg";
import { dbmateMigrate } from "@infra/db/postgres/helpers/dbmate-migrate";

describe("Postgres UserRepository", () => {
  let pgContainer: PostgreSqlContainer;
  let pgConnection: StartedPostgreSqlContainer;
  let pgClient: PoolClient;
  let pgPool: Pool;

  beforeAll(async () => {
    pgContainer = new PostgreSqlContainer("postgres:17");
    pgConnection = await pgContainer.start();
    const pgUri = pgConnection.getConnectionUri();
    await dbmateMigrate(pgUri);
    pgPool = new Pool({
      connectionString: pgUri,
    });
    pgClient = await pgPool.connect();
  }, 60_000);

  afterAll(async () => {
    if (pgConnection) {
      pgClient.release();
      await pgPool.end();
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

    const user = await pgClient.query<User>(
      `
          INSERT INTO users (name, email, password_hash)
          VALUES ($1, $2, $3)
          RETURNING id, name, email
        `,
      [name, email, passwordHash],
    );

    expect(user.rows[0].name).toEqual("valid_name");
  });
});
