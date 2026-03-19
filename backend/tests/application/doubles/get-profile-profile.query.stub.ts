import type { GetProfileProfileQuery } from "@application/queries/get-profile-profile.query";
import type { GetProfileData } from "@domain/usecases/get-profile.contract";
import { FIXED_DATE } from "../../config/constants";

export class GetProfileProfileQueryStub implements GetProfileProfileQuery {
  async findByUserId(_user_id: string): Promise<GetProfileData | null> {
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
    };
  }
}
