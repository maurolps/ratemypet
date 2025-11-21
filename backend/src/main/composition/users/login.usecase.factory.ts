import { BcryptAdapter } from "@infra/security/bcrypt.adapter";
import { LoginUseCase } from "@application/usecases/login.usecase";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";
import { makeTokenIssuer } from "./token-issuer.factory";

export const makeLoginUseCase = () => {
  const findUserByEmail = new PgUserRepository();
  const hasher = new BcryptAdapter();
  const tokenIssuer = makeTokenIssuer();
  const usecase = new LoginUseCase(findUserByEmail, hasher, tokenIssuer);

  return usecase;
};
