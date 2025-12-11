import type {
  AccessTokenGenerator,
  RefreshTokenGenerator,
} from "@application/ports/token-generator.contract";
import type { AccessTokenPayload } from "@domain/entities/token";

export class AccessTokenGeneratorStub implements AccessTokenGenerator {
  issue(_payload: AccessTokenPayload): Promise<string> {
    return new Promise((resolve) => resolve(`valid_access_token`));
  }

  async verify(_accessToken: string): Promise<AccessTokenPayload> {
    return new Promise((resolve) =>
      resolve({
        sub: "valid_user_id",
        name: "valid_name",
        email: "valid_email@mail.com",
      }),
    );
  }
}

export class RefreshTokenGeneratorStub implements RefreshTokenGenerator {
  issue(): Promise<string> {
    return new Promise((resolve) => resolve(`valid_token_id.refresh_token`));
  }
}
