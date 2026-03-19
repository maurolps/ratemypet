import type {
  UpdateProfileData,
  UpdateProfileRepository,
} from "@application/repositories/update-profile.repository";
import { FIXED_DATE } from "../../config/constants";
import type { User } from "@domain/entities/user";

export class UpdateProfileRepositoryStub implements UpdateProfileRepository {
  async updateProfile(data: UpdateProfileData): Promise<User | null> {
    return {
      id: data.id,
      name: "valid_name",
      email: "valid_email@mail.com",
      displayName: data.displayName ?? "valid_display_name",
      bio: data.bio ?? "Pet lover 🐶",
      createdAt: FIXED_DATE,
    };
  }
}
