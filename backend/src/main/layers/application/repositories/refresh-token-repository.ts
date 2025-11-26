import type { RefreshTokenDTO } from "@domain/entities/token";

export interface RefreshTokenRepository {
  save(refreshTokenDTO: RefreshTokenDTO): Promise<void>;
  findById(id: string): Promise<RefreshTokenDTO | null>;
}
