import type { User } from "@domain/entities/user";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { sql } from "@infra/db/postgres/sql/user.sql";

export const insertFakeUser = async (email?: string): Promise<User> => {
  const pool = PgPool.getInstance();
  const userRows = await pool.query<User>(sql.CREATE_USER, [
    "any_name",
    email ?? "fake_email@mail.com",
    "hashed_password",
  ]);
  const user = userRows.rows[0];
  return user;
};
