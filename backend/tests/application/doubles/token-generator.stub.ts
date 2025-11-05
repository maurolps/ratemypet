import type { TokenGenerator } from "@application/ports/token-generator.contract";
import type { TokenPayload } from "@domain/entities/auth";

export class TokenGeneratorStub implements TokenGenerator {
  issue(_payload: TokenPayload): Promise<string> {
    return new Promise((resolve) => resolve("valid_access_token"));
  }
}
