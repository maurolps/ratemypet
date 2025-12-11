import type {
  AccessTokenGenerator,
  RefreshTokenGenerator,
} from "@application/ports/token-generator.contract";
import type { AccessTokenPayload } from "@domain/entities/token";

export class AccessTokenGeneratorStub implements AccessTokenGenerator {
  issue(_payload: AccessTokenPayload): Promise<string> {
    return new Promise((resolve) => resolve(`valid_access_token`));
  }
}

export class RefreshTokenGeneratorStub implements RefreshTokenGenerator {
  issue(): Promise<string> {
    return new Promise((resolve) => resolve(`valid_token_id.refresh_token`));
  }
}
