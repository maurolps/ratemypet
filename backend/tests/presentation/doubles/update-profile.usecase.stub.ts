import type {
  UpdateProfile,
  UpdateProfileDTO,
  UpdateProfileResult,
} from "@domain/usecases/update-profile.contract";

export class UpdateProfileUseCaseStub implements UpdateProfile {
  async execute(_: UpdateProfileDTO): Promise<UpdateProfileResult> {
    return {
      id: "valid_user_id",
      displayName: "updated_display_name",
      bio: "updated_bio",
    };
  }
}
