import { FIXED_DATE } from "../../config/constants";
import type {
  AuthIdentity,
  AuthProvider,
  CreateAuthIdentityData,
} from "@application/auth/auth-identity";
import type { Transaction } from "@application/ports/unit-of-work.contract";
import type { AuthIdentityRepository } from "@application/repositories/auth-identity-repository";

export class AuthIdentityRepositoryStub implements AuthIdentityRepository {
  async findByUserIdAndProvider(
    userId: string,
    provider: AuthProvider,
  ): Promise<AuthIdentity | null> {
    return {
      id: "valid_auth_identity_id",
      user_id: userId,
      provider,
      identifier: "valid_email@mail.com",
      password_hash: "hashed_valid_password",
      provider_user_id: null,
      created_at: FIXED_DATE,
    };
  }

  async findByProviderAndIdentifier(
    _provider: AuthProvider,
    _identifier: string,
  ): Promise<AuthIdentity | null> {
    return null;
  }

  async findByProviderUserId(
    provider: AuthProvider,
    providerUserId: string,
  ): Promise<AuthIdentity | null> {
    return {
      id: "valid_auth_identity_id",
      user_id: "valid_user_id",
      provider,
      identifier: "valid_email@mail.com",
      password_hash: null,
      provider_user_id: providerUserId,
      created_at: FIXED_DATE,
    };
  }

  async create(
    authIdentity: CreateAuthIdentityData,
    _transaction?: Transaction,
  ): Promise<AuthIdentity> {
    return {
      id: "valid_auth_identity_id",
      user_id: authIdentity.user_id,
      provider: authIdentity.provider,
      identifier: authIdentity.identifier,
      password_hash: authIdentity.password_hash,
      provider_user_id: authIdentity.provider_user_id,
      created_at: FIXED_DATE,
    };
  }
}
