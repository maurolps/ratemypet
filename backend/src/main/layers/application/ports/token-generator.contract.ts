import type { AccessTokenPayload } from "@domain/entities/token";

export interface AccessTokenGenerator {
  issue(payload: AccessTokenPayload): Promise<string>;
  verify(accessToken: string): Promise<AccessTokenPayload>;
}

export interface RefreshTokenGenerator {
  issue(): Promise<string>;
}
