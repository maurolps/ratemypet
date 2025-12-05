import type {
  RefreshTokenDTO,
  TokenIssuer,
  Tokens,
} from "@domain/entities/token";
import type { User } from "@domain/entities/user";
import type { RefreshTokenParsed } from "@domain/usecases/refresh-token.contract";

export class TokenIssuerServiceStub implements TokenIssuer {
  async execute(_user: User): Promise<Tokens> {
    return {
      accessToken: "access_token",
      refreshToken: "refresh_token",
    };
  }

  async validateRefreshToken(
    token: RefreshTokenParsed,
  ): Promise<RefreshTokenDTO> {
    return new Promise((resolve) =>
      resolve({
        id: token.id,
        user_id: "valid_user_id",
        token_hash: "hashed_refresh_token_secret",
        created_at: Date.now(),
        expires_at: Date.now() + 60_000,
      }),
    );
  }
}
