import type { User } from "@domain/entities/user";
import { it, describe, beforeAll, afterAll, expect } from "vitest";
import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import postgres from "postgres";
import { dbmateMigrate } from "@infra/db/postgres/helpers/dbmate-migrate";

describe("Postgres UserRepository", () => {
  let pgContainer: PostgreSqlContainer;
  let pgConnection: StartedPostgreSqlContainer;
  let sql: postgres.Sql;

  beforeAll(async () => {
    pgContainer = new PostgreSqlContainer("postgres:17");
    pgConnection = await pgContainer.start();
    const pgUri = pgConnection.getConnectionUri();
    await dbmateMigrate(pgUri);
    sql = postgres(pgUri);
  }, 60_000);

  afterAll(async () => {
    if (pgConnection) {
      await pgConnection.stop();
      sql?.end();
    }
  }, 60_000);

  it("Should return an User on success", async () => {
    const userDTO = {
      name: "valid_name",
      email: "valid_email@mail.com",
      passwordHash: "hashed_password",
    };
    const { name, email, passwordHash } = userDTO;

    const user: User[] = await sql`
      INSERT INTO users ( name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
      RETURNING id, name, email    
    `;

    expect(user[0].name).toEqual("valid_name");
  });
});
