import { LikePostUseCase } from "@application/usecases/like-post.usecase";
import { PgLikeRepository } from "@infra/db/postgres/pg-like.repository";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";

export const makeLikePostUseCase = () => {
  const postRepository = new PgPostRepository();
  const likeRepository = new PgLikeRepository();
  const usecase = new LikePostUseCase(
    postRepository,
    likeRepository,
    postRepository,
  );

  return usecase;
};
