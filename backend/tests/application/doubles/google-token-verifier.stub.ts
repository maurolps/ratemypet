import type {
  GoogleIdentity,
  GoogleTokenVerifier,
} from "@application/ports/google-token-verifier.contract";

export class GoogleTokenVerifierStub implements GoogleTokenVerifier {
  async verify(_idToken: string): Promise<GoogleIdentity> {
    return {
      sub: "google_sub_123",
      email: "google_user@mail.com",
      name: "Google User",
      picture: "https://valid.picture/google.png",
      email_verified: true,
    };
  }
}
