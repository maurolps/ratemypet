import type { TokenGenerator } from "@application/ports/token-generator.contract";
import type { AccessTokenPayload } from "@domain/entities/token";
import { env } from "@main/config/env";
import jwt, { type SignOptions } from "jsonwebtoken";

export class JwtAdapter implements TokenGenerator<AccessTokenPayload> {
  async issue(payload: AccessTokenPayload): Promise<string> {
    const jwtSecret = env.JWT_ACCESS_TOKEN_SECRET;
    const jwtExpiresIn = env.JWT_ACCESS_TOKEN_TTL as SignOptions["expiresIn"];

    const accessToken = jwt.sign(payload, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });
    return accessToken;
  }
}
