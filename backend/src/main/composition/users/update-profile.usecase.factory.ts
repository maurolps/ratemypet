import { ContentModerationService } from "@application/services/content-moderation.service";
import { UpdateProfileUseCase } from "@application/usecases/update-profile.usecase";
import { ProfanityCheckerAdapter } from "@infra/adapters/profanity-checker.adapter";
import { PgUserRepository } from "@infra/db/postgres/pg-user.repository";

export const makeUpdateProfileUseCase = () => {
  const userRepository = new PgUserRepository();
  const profanityChecker = new ProfanityCheckerAdapter();
  const contentModeration = new ContentModerationService(profanityChecker);
  const usecase = new UpdateProfileUseCase(
    userRepository,
    contentModeration,
    userRepository,
  );

  return usecase;
};
