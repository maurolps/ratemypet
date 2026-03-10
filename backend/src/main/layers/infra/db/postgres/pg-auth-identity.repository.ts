import type { AuthIdentityRepository } from "@application/repositories/auth-identity-repository";
import type {
  AuthIdentity,
  AuthProvider,
  CreateAuthIdentityData,
} from "@application/auth/auth-identity";
import type { Transaction } from "@application/ports/unit-of-work.contract";
import { PgPool } from "./helpers/pg-pool";
import { sql } from "./sql/auth-identity.sql";
import {
  toAuthIdentity,
  type AuthIdentityRow,
} from "@infra/mappers/auth-identity-mapper";

export class PgAuthIdentityRepository implements AuthIdentityRepository {
  private readonly pool: PgPool;

  constructor() {
    this.pool = PgPool.getInstance();
  }

  async findByUserIdAndProvider(
    userId: string,
    provider: AuthProvider,
  ): Promise<AuthIdentity | null> {
    const authIdentityRows = await this.pool.query<AuthIdentityRow>(
      sql.FIND_BY_USER_ID_AND_PROVIDER,
      [userId, provider],
    );
    const authIdentityRow = authIdentityRows.rows[0] || null;

    return authIdentityRow ? toAuthIdentity(authIdentityRow) : null;
  }

  async create(
    authIdentity: CreateAuthIdentityData,
    transaction?: Transaction,
  ): Promise<AuthIdentity> {
    const client = (transaction ? transaction : this.pool) as typeof this.pool;
    const authIdentityRows = await client.query<AuthIdentityRow>(
      sql.CREATE_AUTH_IDENTITY,
      [
        authIdentity.user_id,
        authIdentity.provider,
        authIdentity.provider_user_id,
        authIdentity.password_hash,
      ],
    );

    return toAuthIdentity(authIdentityRows.rows[0]);
  }
}
