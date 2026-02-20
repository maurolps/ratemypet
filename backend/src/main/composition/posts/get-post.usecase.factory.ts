import { GetPostUseCase } from "@application/usecases/get-post.usecase";
import { PgPostQuery } from "@infra/db/postgres/queries/pg-post.query";

export const makeGetPostUseCase = () => {
  const postQuery = new PgPostQuery();
  const usecase = new GetPostUseCase(postQuery, postQuery);

  return usecase;
};
