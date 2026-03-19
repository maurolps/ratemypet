import { AppError } from "@application/errors/app-error";
import type { ContentModeration } from "@application/ports/content-moderation.contract";
import type { FindUserRepository } from "@application/repositories/find-user.repository";
import type { UpdateProfileRepository } from "@application/repositories/update-profile.repository";
import type {
  UpdateProfile,
  UpdateProfileDTO,
  UpdateProfileResult,
} from "@domain/usecases/update-profile.contract";

export class UpdateProfileUseCase implements UpdateProfile {
  constructor(
    private readonly findUserRepository: FindUserRepository,
    private readonly contentModeration: ContentModeration,
    private readonly updateProfileRepository: UpdateProfileRepository,
  ) {}

  async execute(data: UpdateProfileDTO): Promise<UpdateProfileResult> {
    const user = await this.findUserRepository.findById(data.user_id);

    if (!user) {
      throw new AppError("NOT_FOUND", "The authenticated user does not exist.");
    }

    if (data.displayName !== undefined) {
      const moderationResult = await this.contentModeration.execute(
        data.displayName,
      );

      if (!moderationResult.isAllowed) {
        throw new AppError(
          "UNPROCESSABLE_ENTITY",
          "Display name has inappropriate content.",
        );
      }
    }

    if (data.bio !== undefined) {
      const moderationResult = await this.contentModeration.execute(data.bio);

      if (!moderationResult.isAllowed) {
        throw new AppError(
          "UNPROCESSABLE_ENTITY",
          "Bio has inappropriate content.",
        );
      }
    }

    const currentDisplayName = user.displayName ?? user.name;
    const currentBio = user.bio ?? "";
    const nextDisplayName =
      data.displayName !== undefined ? data.displayName : currentDisplayName;
    const nextBio = data.bio !== undefined ? data.bio : currentBio;

    if (nextDisplayName === currentDisplayName && nextBio === currentBio) {
      return {
        id: user.id,
        displayName: currentDisplayName,
        bio: currentBio,
      };
    }

    const updatedUser = await this.updateProfileRepository.updateProfile({
      id: user.id,
      ...(data.displayName !== undefined
        ? { displayName: data.displayName }
        : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
    });

    if (!updatedUser) {
      throw new Error("Failed to update user profile.");
    }

    return {
      id: updatedUser.id,
      displayName: updatedUser.displayName ?? updatedUser.name,
      bio: updatedUser.bio ?? "",
    };
  }
}
