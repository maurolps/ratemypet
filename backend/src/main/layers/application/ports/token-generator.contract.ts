import type { AccessTokenPayload } from "@domain/entities/token";

export interface AccessTokenGenerator {
  issue(payload: AccessTokenPayload): Promise<string>;
}

export interface RefreshTokenGenerator {
  issue(): Promise<string>;
}
