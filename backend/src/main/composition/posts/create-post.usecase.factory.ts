import { CreatePostUseCase } from "@application/usecases/create-post.usecase";
import { ContentModerationService } from "@application/services/content-moderation.service";
import { PgPetRepository } from "@infra/db/postgres/pg-pet.repository";
import { PgPostRepository } from "@infra/db/postgres/pg-post.repository";
import { ProfanityCheckerAdapter } from "@infra/adapters/profanity-checker.adapter";

export const makeCreatePostUseCase = () => {
  const petRepository = new PgPetRepository();
  const postRepository = new PgPostRepository();
  const profanityChecker = new ProfanityCheckerAdapter();
  const contentModeration = new ContentModerationService(profanityChecker);
  const usecase = new CreatePostUseCase(
    petRepository,
    contentModeration,
    postRepository,
  );

  return usecase;
};
