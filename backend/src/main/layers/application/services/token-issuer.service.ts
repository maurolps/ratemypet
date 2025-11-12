import type { User } from "@domain/entities/user";
import type { Hasher } from "@application/ports/hasher.contract";
import type { TokenGenerator } from "@application/ports/token-generator.contract";
import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
import type {
  AccessTokenPayload,
  RefreshTokenDTO,
  TokenIssuer,
  Tokens,
} from "@domain/entities/token";

export class TokenIssuerService implements TokenIssuer {
  constructor(
    private readonly hasher: Hasher,
    private readonly accessTokenGenerator: TokenGenerator<AccessTokenPayload>,
    private readonly refreshTokenGenerator: TokenGenerator,
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
}
