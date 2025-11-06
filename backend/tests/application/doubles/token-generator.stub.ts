import type { TokenGenerator } from "@application/ports/token-generator.contract";

export class TokenGeneratorStub<T = void> implements TokenGenerator<T> {
  issue(_payload?: T): Promise<string> {
    return new Promise((resolve) =>
      resolve(_payload ? `valid_access_token` : `valid_id.valid_refresh_token`),
    );
  }
}
