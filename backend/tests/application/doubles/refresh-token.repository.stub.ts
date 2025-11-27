import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
import type { RefreshTokenDTO } from "@domain/entities/token";

export class RefreshTokenRepositoryStub implements RefreshTokenRepository {
  save(_refreshTokenDTO: RefreshTokenDTO): Promise<void> {
    return new Promise((resolve) => resolve());
  }

  findById(id: string): Promise<RefreshTokenDTO | null> {
    return new Promise((resolve) =>
      resolve({
        id,
        user_id: "valid_user_id",
        token_hash: "hashed_refresh_token_secret",
        created_at: Date.now(),
        expires_at: Date.now() + 60_000,
      }),
    );
  }
}
