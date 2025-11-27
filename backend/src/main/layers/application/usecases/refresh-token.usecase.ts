import type { TokenIssuer, Tokens } from "@domain/entities/token";
import type {
  RefreshToken,
  RefreshTokenParsed,
} from "@domain/usecases/refresh-token.contract";

export class RefreshTokenUseCase implements RefreshToken {
  constructor(private readonly tokenIssuer: TokenIssuer) {}
  async execute(token: RefreshTokenParsed): Promise<Tokens> {
    const _refreshTokenDTO = await this.tokenIssuer.validateRefreshToken(token);

    return {
      accessToken: "newAccessToken",
      refreshToken: "newRefreshToken",
    };
  }
}
