import type { Hasher } from "@application/ports/hasher.contract";
import type { TokenGenerator } from "@application/ports/token-generator.contract";
import type { RefreshTokenRepository } from "@application/repositories/refresh-token-repository";
import type { AccessTokenPayload, Tokens } from "@domain/entities/token";
import type { User } from "@domain/entities/user";
import { TokenIssuerService } from "@application/services/token-issuer.service";

export class TokenIssuerServiceStub extends TokenIssuerService {
  constructor() {
    super(
      {} as Hasher,
      {} as TokenGenerator<AccessTokenPayload>,
      {} as TokenGenerator,
      {} as RefreshTokenRepository,
    );
  }
  override async execute(_user: User): Promise<Tokens> {
    return {
      accessToken: "access_token",
      refreshToken: "refresh_token",
    };
  }
}
