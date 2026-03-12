import type {
  GoogleIdentity,
  GoogleTokenVerifier,
} from "@application/ports/google-token-verifier.contract";
import { OAuth2Client } from "google-auth-library";

export class GoogleTokenVerifierAdapter implements GoogleTokenVerifier {
  private readonly client: OAuth2Client;

  constructor(private readonly clientId: string) {
    this.client = new OAuth2Client();
  }

  async verify(idToken: string): Promise<GoogleIdentity> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.clientId,
    });
    const payload = ticket.getPayload();

    if (
      !payload?.sub ||
      !payload.email ||
      !payload.name ||
      payload.email_verified === undefined
    ) {
      throw new Error("Invalid Google token payload");
    }

    return {
      sub: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name,
      picture: payload.picture ?? undefined,
      email_verified: payload.email_verified === true,
    };
  }
}
