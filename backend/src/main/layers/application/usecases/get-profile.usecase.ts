import { AppError } from "@application/errors/app-error";
import type { GetProfilePetsQuery } from "@application/queries/get-profile-pets.query";
import type { GetProfileProfileQuery } from "@application/queries/get-profile-profile.query";
import type {
  GetProfile,
  GetProfileDTO,
  GetProfileResult,
} from "@domain/usecases/get-profile.contract";

export class GetProfileUseCase implements GetProfile {
  constructor(
    private readonly getProfileProfileQuery: GetProfileProfileQuery,
    private readonly getProfilePetsQuery: GetProfilePetsQuery,
  ) {}

  async execute(data: GetProfileDTO): Promise<GetProfileResult> {
    const profile = await this.getProfileProfileQuery.findByUserId(
      data.user_id,
    );

    if (!profile) {
      throw new AppError("NOT_FOUND", "The requested user does not exist.");
    }

    const pets = await this.getProfilePetsQuery.findByOwnerId(data.user_id);

    return {
      ...profile,
      pets,
    };
  }
}
