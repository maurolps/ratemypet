import { AppError } from "@application/errors/app-error";
import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
import type { Tokens } from "@domain/entities/token";
import type {
  RefreshToken,
  RefreshTokenParsed,
} from "@domain/usecases/refresh-token.contract";

export class RefreshTokenUseCase implements RefreshToken {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
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

    return {
      accessToken: "newAccessToken",
      refreshToken: "newRefreshToken",
    };
  }
}
