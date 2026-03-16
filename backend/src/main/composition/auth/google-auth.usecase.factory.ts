import { GoogleAuthUseCase } from "@application/usecases/google-auth.usecase";
import { PgUnitOfWorkAdapter } from "@infra/db/postgres/adapters/pg-unit-of-work.adapter";
import { PgAuthIdentityRepository } from "@infra/db/postgres/pg-auth-identity.repository";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";
import { makeTokenIssuer } from "@main/composition/users/token-issuer.factory";
import { makeGoogleTokenVerifier } from "./google-token-verifier.factory";

export const makeGoogleAuthUseCase = () => {
  const googleTokenVerifier = makeGoogleTokenVerifier();
  const userRepository = new PgUserRepository();
  const authIdentityRepository = new PgAuthIdentityRepository();
  const tokenIssuer = makeTokenIssuer();
  const unitOfWork = new PgUnitOfWorkAdapter();

  return new GoogleAuthUseCase(
    googleTokenVerifier,
    userRepository,
    userRepository,
    authIdentityRepository,
    tokenIssuer,
    unitOfWork,
  );
};
