import type {
  GetProfile,
  GetProfileDTO,
  GetProfileResult,
} from "@domain/usecases/get-profile.contract";
import { FIXED_DATE } from "../../config/constants";

export class GetProfileUseCaseStub implements GetProfile {
  async execute(_: GetProfileDTO): Promise<GetProfileResult> {
    return {
      id: "valid_user_id",
      displayName: "valid_display_name",
      bio: "Pet lover 🐶",
      createdAt: FIXED_DATE,
      picture: "https://valid.picture/profile.png",
      stats: {
        postsCount: 2,
        likesReceived: 7,
      },
      pets: [
        {
          id: "valid_pet_id",
          name: "valid_pet_name",
          type: "dog",
          imageUrl: "https://valid.image/pet.png",
        },
      ],
    };
  }
}
