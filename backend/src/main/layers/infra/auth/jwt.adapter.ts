import type { TokenGenerator } from "@application/ports/token-generator.contract";
import type { AccessTokenPayload } from "@domain/entities/token";
import { env } from "@main/config/env";
import jwt, { type SignOptions } from "jsonwebtoken";

export class JwtAdapter implements TokenGenerator<AccessTokenPayload> {
  async issue(payload: AccessTokenPayload): Promise<string> {
    const secret = env.JWT_ACCESS_TOKEN_SECRET;
    const expiresIn = env.JWT_ACCESS_TOKEN_TTL as SignOptions["expiresIn"];

    const accessToken = jwt.sign(payload, secret, {
      expiresIn,
    });
    return accessToken;
  }
}
