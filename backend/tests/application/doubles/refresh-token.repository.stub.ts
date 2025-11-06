import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
import type { RefreshTokenDTO } from "@domain/entities/token";

export class RefreshTokenRepositoryStub implements RefreshTokenRepository {
  save(_refreshTokenDTO: RefreshTokenDTO): Promise<void> {
    return new Promise((resolve) => resolve());
  }
}
