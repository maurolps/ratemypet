import { DeletePostUseCase } from "@application/usecases/delete-post.usecase";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";

export const makeDeletePostUseCase = () => {
  const postRepository = new PgPostRepository();
  const usecase = new DeletePostUseCase(postRepository, postRepository);

  return usecase;
};
