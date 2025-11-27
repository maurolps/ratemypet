import { BcryptAdapter } from "@infra/security/bcrypt.adapter";
import { LoginUseCase } from "@application/usecases/login.usecase";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";
import { makeTokenIssuer } from "./token-issuer.factory";

export const makeLoginUseCase = () => {
  const findUser = new PgUserRepository();
  const hasher = new BcryptAdapter();
  const tokenIssuer = makeTokenIssuer();
  const usecase = new LoginUseCase(findUser, hasher, tokenIssuer);

  return usecase;
};
