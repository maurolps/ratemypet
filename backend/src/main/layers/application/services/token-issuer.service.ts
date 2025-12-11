import type { User } from "@domain/entities/user";
import type { Hasher } from "@application/ports/hasher.contract";
import type {
  AccessTokenGenerator,
  RefreshTokenGenerator,
} from "@application/ports/token-generator.contract";
import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
import type { RefreshTokenParsed } from "@domain/usecases/refresh-token.contract";
import type {
  RefreshTokenDTO,
  TokenIssuer,
  Tokens,
} from "@domain/entities/token";
import { AppError } from "@application/errors/app-error";

export class TokenIssuerService implements TokenIssuer {
  constructor(
    private readonly hasher: Hasher,
    private readonly accessTokenGenerator: AccessTokenGenerator,
    private readonly refreshTokenGenerator: RefreshTokenGenerator,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}
  async execute(user: User): Promise<Tokens> {
    const accessToken = await this.accessTokenGenerator.issue({
      sub: user.id,
      name: user.name,
      email: user.email,
    });
    const refreshTokenRaw = await this.refreshTokenGenerator.issue();

    const [id, secret] = refreshTokenRaw.split(".");
    if (!id || !secret) {
      throw new Error();
    }

    const refreshTokenHash = await this.hasher.hash(secret);
    const refreshTokenDTO: RefreshTokenDTO = {
      id,
      user_id: user.id,
      token_hash: refreshTokenHash,
    };

    await this.refreshTokenRepository.save(refreshTokenDTO);

    return {
      accessToken,
      refreshToken: refreshTokenRaw,
    };
  }

  async validateRefreshToken(
    token: RefreshTokenParsed,
  ): Promise<RefreshTokenDTO> {
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

    return refreshTokenDTO;
  }
}
