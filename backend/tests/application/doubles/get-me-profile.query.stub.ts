import type { GetMeProfileQuery } from "@application/queries/get-me-profile.query";
import type { GetMeProfile } from "@domain/usecases/get-me.contract";

export class GetMeProfileQueryStub implements GetMeProfileQuery {
  async findByUserId(_user_id: string): Promise<GetMeProfile | null> {
    return {
      id: "valid_user_id",
      displayName: "valid_display_name",
      email: "valid_email@mail.com",
      bio: "Pet lover 🐶",
      stats: {
        postsCount: 2,
        likesReceived: 7,
      },
    };
  }
}
