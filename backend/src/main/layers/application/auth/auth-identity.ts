export type AuthProvider = "local";

export interface AuthIdentity {
  id: string;
  user_id: string;
  provider: AuthProvider;
  identifier: string;
  password_hash: string | null;
  provider_user_id: string | null;
  created_at: Date;
}

export type CreateAuthIdentityData = Omit<AuthIdentity, "id" | "created_at">;
