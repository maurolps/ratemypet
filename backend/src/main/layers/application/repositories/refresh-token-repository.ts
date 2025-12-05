import type { RefreshTokenDTO } from "@domain/entities/token";

export interface RefreshTokenRepository {
  save(refreshTokenDTO: RefreshTokenDTO): Promise<void>;
  findById(tokenId: string): Promise<RefreshTokenDTO | null>;
  revoke(tokenId: string): Promise<void>;
}
