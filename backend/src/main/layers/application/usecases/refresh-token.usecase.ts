import { AppError } from "@application/errors/app-error";
import type { Hasher } from "@application/ports/hasher.contract";
import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
import type { Tokens } from "@domain/entities/token";
import type {
  RefreshToken,
  RefreshTokenParsed,
} from "@domain/usecases/refresh-token.contract";

export class RefreshTokenUseCase implements RefreshToken {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly hasher: Hasher,
  ) {}
  async execute(token: RefreshTokenParsed): Promise<Tokens> {
    const refreshTokenDTO = await this.refreshTokenRepository.findById(
      token.id,
    );

    if (!refreshTokenDTO) {
      throw new AppError("UNAUTHORIZED");
    }

    if (refreshTokenDTO.revoked_at) {
      throw new AppError("UNAUTHORIZED");
    }

    if (
      refreshTokenDTO.expires_at &&
      refreshTokenDTO.expires_at <= Date.now()
    ) {
      throw new AppError("UNAUTHORIZED");
    }

    if (
      !(await this.hasher.compare(token.secret, refreshTokenDTO.token_hash))
    ) {
      throw new AppError("UNAUTHORIZED");
    }

    return {
      accessToken: "newAccessToken",
      refreshToken: "newRefreshToken",
    };
  }
}
