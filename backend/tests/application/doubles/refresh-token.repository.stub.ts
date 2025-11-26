import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
import type { RefreshTokenDTO } from "@domain/entities/token";
import { FIXED_DATE } from "../../config/constants";

export class RefreshTokenRepositoryStub implements RefreshTokenRepository {
  save(_refreshTokenDTO: RefreshTokenDTO): Promise<void> {
    return new Promise((resolve) => resolve());
  }

  findById(id: string): Promise<RefreshTokenDTO | null> {
    return new Promise((resolve) =>
      resolve({
        id,
        user_id: "valid_user_id",
        token_hash: "valid_token_hash",
        created_at: FIXED_DATE.getTime(),
        expires_at: FIXED_DATE.getTime() + 60_000,
      }),
    );
  }
}
