import { AppError } from "@application/errors/app-error";
import type { FindUserRepository } from "@application/repositories/find-user.repository";
import type { TokenIssuer, Tokens } from "@domain/entities/token";
import type {
  RefreshToken,
  RefreshTokenParsed,
} from "@domain/usecases/refresh-token.contract";

export class RefreshTokenUseCase implements RefreshToken {
  constructor(
    private readonly tokenIssuer: TokenIssuer,
    private readonly findUser: FindUserRepository,
  ) {}
  async execute(token: RefreshTokenParsed): Promise<Tokens> {
    const refreshTokenDTO = await this.tokenIssuer.validateRefreshToken(token);
    const user = await this.findUser.findById(refreshTokenDTO.user_id);
    if (!user) {
      throw new AppError("UNAUTHORIZED");
    }

    return {
      accessToken: "newAccessToken",
      refreshToken: "newRefreshToken",
    };
  }
}
