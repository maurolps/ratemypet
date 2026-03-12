import { env } from "@main/config/env";
import { GoogleTokenVerifierAdapter } from "@infra/auth/google-token-verifier.adapter";

export const makeGoogleTokenVerifier = () => {
  return new GoogleTokenVerifierAdapter(env.GOOGLE_CLIENT_ID);
};
