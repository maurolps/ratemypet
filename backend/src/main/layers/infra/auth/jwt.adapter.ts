import type { TokenGenerator } from "@application/ports/token-generator.contract";
import type { AccessTokenPayload } from "@domain/entities/token";
import jwt from "jsonwebtoken";

export class JwtAdapter implements TokenGenerator<AccessTokenPayload> {
  async issue(payload: AccessTokenPayload): Promise<string> {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET || "default_secret",
    );
    return `access token: ${accessToken}`;
  }
}
