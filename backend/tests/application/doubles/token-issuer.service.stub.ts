import type { TokenIssuer, Tokens } from "@domain/entities/token";
import type { User } from "@domain/entities/user";

export class TokenIssuerServiceStub implements TokenIssuer {
  async execute(_user: User): Promise<Tokens> {
    return {
      accessToken: "access_token",
      refreshToken: "refresh_token",
    };
  }
}
