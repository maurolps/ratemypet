import { CreateCommentUseCase } from "@application/usecases/create-comment.usecase";
import { ContentModerationService } from "@application/services/content-moderation.service";
import { PgCreateCommentRepository } from "@infra/db/postgres/pg-create-comment.repository";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { PgUnitOfWorkAdapter } from "@infra/db/postgres/adapters/pg-unit-of-work.adapter";
import { ProfanityCheckerAdapter } from "@infra/adapters/profanity-checker.adapter";

export const makeCreateCommentUseCase = () => {
  const postRepository = new PgPostRepository();
  const commentRepository = new PgCreateCommentRepository();
  const profanityChecker = new ProfanityCheckerAdapter();
  const contentModeration = new ContentModerationService(profanityChecker);
  const unitOfWork = new PgUnitOfWorkAdapter();
  const usecase = new CreateCommentUseCase(
    postRepository,
    commentRepository,
    postRepository,
    contentModeration,
    unitOfWork,
  );

  return usecase;
};
