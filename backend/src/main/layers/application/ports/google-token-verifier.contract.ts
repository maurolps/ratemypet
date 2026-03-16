export type GoogleIdentity = {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
};

export interface GoogleTokenVerifier {
  verify(idToken: string): Promise<GoogleIdentity>;
}
