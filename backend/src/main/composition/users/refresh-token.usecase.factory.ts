import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";
import { makeTokenIssuer } from "./token-issuer.factory";
import { PgRefreshTokenRepository } from "@infra/db/postgres/pg-refresh-token.repository";
import { RefreshTokenUseCase } from "@application/usecases/refresh-token.usecase";

export const makeRefreshTokenUseCase = () => {
  const tokenIssuer = makeTokenIssuer();
  const findUser = new PgUserRepository();
  const refreshTokenRepository = new PgRefreshTokenRepository();
  const usecase = new RefreshTokenUseCase(
    tokenIssuer,
    findUser,
    refreshTokenRepository,
  );

  return usecase;
};
