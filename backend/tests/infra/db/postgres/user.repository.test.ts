import { it, describe, beforeAll, afterAll, expect } from "vitest";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { dbmateMigrate } from "./helpers/dbmate-migrate";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";

describe("PgUserRepository", () => {
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
    const sut = new PgUserRepository(pgPool);
    const userDTO = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password",
    };

    const user = await sut.perform(userDTO);

    expect(user.id).toBeTruthy();
    expect(user.name).toEqual("valid_name");
  });
});
