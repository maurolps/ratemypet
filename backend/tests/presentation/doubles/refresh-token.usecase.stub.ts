import type { Tokens } from "@domain/entities/token";
import type {
  RefreshToken,
  RefreshTokenParsed,
} from "@domain/usecases/refresh-token.contract";

export class RefreshTokenStub implements RefreshToken {
  async execute(_token: RefreshTokenParsed): Promise<Tokens> {
    return {
      accessToken: "new_valid_access_token",
      refreshToken: "new_valid_refresh_token",
    };
  }
}
