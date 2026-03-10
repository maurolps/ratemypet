import type { AuthIdentity } from "@application/auth/auth-identity";
import { PgPool } from "@infra/db/postgres/helpers/pg-pool";
import { sql } from "@infra/db/postgres/sql/auth-identity.sql";
import {
  toAuthIdentity,
  type AuthIdentityRow,
} from "@infra/mappers/auth-identity-mapper";

export const insertFakeLocalAuthIdentity = async (
  userId: string,
  passwordHash = "hashed_password",
): Promise<AuthIdentity> => {
  const pool = PgPool.getInstance();
  const authIdentityRows = await pool.query<AuthIdentityRow>(
    sql.CREATE_AUTH_IDENTITY,
    [userId, "local", null, passwordHash],
  );

  return toAuthIdentity(authIdentityRows.rows[0]);
};
