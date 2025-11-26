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
    const _refreshTokenDTO = await this.refreshTokenRepository.findById(
      token.id,
    );
    return {
      accessToken: "newAccessToken",
      refreshToken: "newRefreshToken",
    };
  }
}
