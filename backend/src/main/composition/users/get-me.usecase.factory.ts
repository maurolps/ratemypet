import { GetMeUseCase } from "@application/usecases/get-me.usecase";
import { PgMeQuery } from "@infra/db/postgres/queries/pg-me.query";

export const makeGetMeUseCase = () => {
  const meQuery = new PgMeQuery();
  const usecase = new GetMeUseCase(meQuery, meQuery);

  return usecase;
};
