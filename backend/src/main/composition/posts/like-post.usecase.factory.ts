import { LikePostUseCase } from "@application/usecases/like-post.usecase";
import { PgLikeRepository } from "@infra/db/postgres/pg-like.repository";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { PgUnitOfWorkAdapter } from "@infra/db/postgres/adapters/pg-unit-of-work.adapter";

export const makeLikePostUseCase = () => {
  const postRepository = new PgPostRepository();
  const likeRepository = new PgLikeRepository();
  const unitOfWork = new PgUnitOfWorkAdapter();
  const usecase = new LikePostUseCase(
    postRepository,
    likeRepository,
    postRepository,
    unitOfWork,
  );

  return usecase;
};
