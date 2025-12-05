import type { FindUserRepository } from "@application/repositories/find-user.repository";
import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
import type { TokenIssuer, Tokens } from "@domain/entities/token";
import type {
  RefreshToken,
  RefreshTokenParsed,
} from "@domain/usecases/refresh-token.contract";
import { AppError } from "@application/errors/app-error";

export class RefreshTokenUseCase implements RefreshToken {
  constructor(
    private readonly tokenIssuer: TokenIssuer,
    private readonly findUser: FindUserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}
  async execute(token: RefreshTokenParsed): Promise<Tokens> {
    const refreshTokenDTO = await this.tokenIssuer.validateRefreshToken(token);

    const user = await this.findUser.findById(refreshTokenDTO.user_id);
    if (!user) {
      throw new AppError("UNAUTHORIZED");
    }

    const tokens = await this.tokenIssuer.execute(user);
    await this.refreshTokenRepository.revoke(refreshTokenDTO.id);

    return tokens;
  }
}
