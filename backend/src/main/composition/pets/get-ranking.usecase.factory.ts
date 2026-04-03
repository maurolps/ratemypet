import { GetRankingUseCase } from "@application/usecases/get-ranking.usecase";
import { PgRankingQuery } from "@infra/db/postgres/queries/pg-ranking.query";

export const makeGetRankingUseCase = () => {
  const rankingQuery = new PgRankingQuery();
  const usecase = new GetRankingUseCase(rankingQuery);

  return usecase;
};
