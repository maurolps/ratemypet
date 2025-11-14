import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
import type { RefreshTokenDTO } from "@domain/entities/token";
import { PgPool } from "./helpers/pg-pool";
import { env } from "@main/config/env";

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
    await this.pool.query(
      `
      INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
      VALUES ($1, $2, $3, $4)
    `,
      [id, user_id, token_hash, expires_at],
    );
  }
}
