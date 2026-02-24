import { GetFeedUseCase } from "@application/usecases/get-feed.usecase";
import { PgFeedQuery } from "@infra/db/postgres/queries/pg-feed.query";

export const makeGetFeedUseCase = () => {
  const feedQuery = new PgFeedQuery();
  const usecase = new GetFeedUseCase(feedQuery);

  return usecase;
};
