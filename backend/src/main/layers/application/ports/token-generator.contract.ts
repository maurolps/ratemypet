import type { TokenPayload } from "@domain/entities/auth";

export interface TokenGenerator {
  issue(payload: TokenPayload): Promise<string>;
}
