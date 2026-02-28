import { DeleteCommentUseCase } from "@application/usecases/delete-comment.usecase";
import { PgUnitOfWorkAdapter } from "@infra/db/postgres/adapters/pg-unit-of-work.adapter";
import { PgCreateCommentRepository } from "@infra/db/postgres/pg-create-comment.repository";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";

export const makeDeleteCommentUseCase = () => {
  const postRepository = new PgPostRepository();
  const commentRepository = new PgCreateCommentRepository();
  const unitOfWork = new PgUnitOfWorkAdapter();
  const usecase = new DeleteCommentUseCase(
    postRepository,
    commentRepository,
    commentRepository,
    postRepository,
    unitOfWork,
  );

  return usecase;
};
