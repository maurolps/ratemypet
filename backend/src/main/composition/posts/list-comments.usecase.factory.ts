import { ListCommentsUseCase } from "@application/usecases/list-comments.usecase";
import { PgPostQuery } from "@infra/db/postgres/queries/pg-post.query";

export const makeListCommentsUseCase = () => {
  const postQuery = new PgPostQuery();
  const usecase = new ListCommentsUseCase(postQuery, postQuery);

  return usecase;
};
