import type { User } from "@domain/entities/user";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { sql } from "@infra/db/postgres/sql/user.sql";
import { toUser, type UserRow } from "@infra/mappers/user-mapper";

export const insertFakeUser = async (
  email?: string,
  picture?: string | null,
  displayName = "any_name",
): Promise<User> => {
  const pool = PgPool.getInstance();
  const userRows = await pool.query<UserRow>(sql.CREATE_USER, [
    "any_name",
    email ?? "fake_email@mail.com",
    picture ?? null,
    displayName,
    "Pet lover 🐶",
  ]);
  return toUser(userRows.rows[0]);
};
