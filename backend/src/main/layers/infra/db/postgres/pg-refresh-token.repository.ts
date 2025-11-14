import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
import type { RefreshTokenDTO } from "@domain/entities/token";
import { PgPool } from "./helpers/pg-pool";
import { env } from "@main/config/env";
import { sql } from "./sql/user.sql";

export class PgRefreshTokenRepository implements RefreshTokenRepository {
  private readonly pool: PgPool;
  constructor() {
    this.pool = PgPool.getInstance();
  }

  async save(refreshTokenDTO: RefreshTokenDTO): Promise<void> {
    const { id, user_id, token_hash } = refreshTokenDTO;

    const expires_at = new Date(
      Date.now() + env.REFRESH_TOKEN_TTL,
    ).toISOString();

    await this.pool.query(sql.CREATE_REFRESH_TOKEN, [
      id,
      user_id,
      token_hash,
      expires_at,
    ]);
  }

  async findById(id: string): Promise<RefreshTokenDTO | null> {
    const result = await this.pool.query<RefreshTokenDTO>(
      sql.FIND_REFRESH_TOKEN_BY_ID,
      [id],
    );
    const refreshToken = result.rows[0] || null;
    return refreshToken;
  }
}
