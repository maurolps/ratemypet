import type { TokenGenerator } from "@application/ports/token-generator.contract";

export class TokenGeneratorStub<T extends { sub: string }>
  implements TokenGenerator<T>
{
  issue(payload: T): Promise<string> {
    return new Promise((resolve) => resolve(`${payload.sub}_token`));
  }
}
