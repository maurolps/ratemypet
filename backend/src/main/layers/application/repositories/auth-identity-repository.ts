import type { Transaction } from "@application/ports/unit-of-work.contract";
import type {
  AuthIdentity,
  AuthProvider,
  CreateAuthIdentityData,
} from "@application/auth/auth-identity";

export interface AuthIdentityRepository {
  findByUserIdAndProvider(
    userId: string,
    provider: AuthProvider,
  ): Promise<AuthIdentity | null>;
  findByProviderAndIdentifier(
    provider: AuthProvider,
    identifier: string,
  ): Promise<AuthIdentity | null>;
  findByProviderUserId(
    provider: AuthProvider,
    providerUserId: string,
  ): Promise<AuthIdentity | null>;
  create(
    authIdentity: CreateAuthIdentityData,
    transaction?: Transaction,
  ): Promise<AuthIdentity>;
}
