import type { AuthIdentity } from "@application/auth/auth-identity";

export type AuthIdentityRow = {
  id: string;
  user_id: string;
  provider: "local" | "google";
  identifier: string;
  provider_user_id: string | null;
  password_hash: string | null;
  created_at: Date | string;
};

export const toAuthIdentity = (row: AuthIdentityRow): AuthIdentity => ({
  id: row.id,
  user_id: row.user_id,
  provider: row.provider,
  identifier: row.identifier,
  provider_user_id: row.provider_user_id,
  password_hash: row.password_hash,
  created_at:
    row.created_at instanceof Date ? row.created_at : new Date(row.created_at),
});
